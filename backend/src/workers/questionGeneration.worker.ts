import { Worker, Job } from 'bullmq';
import { bullmqConnection } from '../config/bullmq';
import { QuestionGenerationJobData } from '../queues/questionGeneration.queue';
import { generateQuestionsWithAI } from '../services/aiGeneration.service';
import { updateAssignment } from '../services/assignment.service';
import { emitToRoom, broadcast } from '../sockets';

// ── Processor ─────────────────────────────────────────────────────────────────

async function processQuestionGenerationJob(
  job: Job<QuestionGenerationJobData>
): Promise<void> {
  const { assignmentId, title, questionTypes, numQuestions, marks, instructions } =
    job.data;

  console.log(`📝  [Job #${job.id}] Starting question generation for: "${title}" (${assignmentId})`);

  // ── Step 1: Call AI service (placeholder / real) ───────────────────────────
  const { sections } = await generateQuestionsWithAI({
    title,
    questionTypes,
    numQuestions,
    marks,
    instructions,
  });

  console.log(
    `🤖  [Job #${job.id}] AI generated ${sections.reduce(
      (acc, s) => acc + s.questions.length,
      0
    )} questions across ${sections.length} section(s)`
  );

  // ── Step 2: Map AI output → ISection[] shape ──────────────────────────────
  // Infer the questionType per section from the section title Gemini returns.
  // Fall back to 'short_answer' if the title doesn't match a known type.
  function inferQuestionType(sectionTitle: string): string {
    const t = sectionTitle.toLowerCase();
    if (t.includes('multiple choice') || t.includes('mcq')) return 'mcq';
    if (t.includes('true') && t.includes('false'))             return 'true_false';
    if (t.includes('fill'))                                     return 'fill_in_the_blank';
    if (t.includes('long'))                                     return 'long_answer';
    return 'short_answer';
  }

  const generatedPaper = sections.map((sec) => ({
    sectionTitle: `${sec.title}${sec.instruction ? ` — ${sec.instruction}` : ''}`,
    questions: sec.questions.map((q) => ({
      questionText: q.text,
      questionType: inferQuestionType(sec.title) as any,
      marks: q.marks,
      options: q.options ?? undefined,  // pass MCQ choices through to DB
    })),
  }));

  // ── Step 3: Persist result to the database ─────────────────────────────────
  const updated = await updateAssignment(assignmentId, {
    generatedPaper,
    status: 'completed',
  });

  if (!updated) {
    throw new Error(`Assignment not found in DB: ${assignmentId}`);
  }

  console.log(`✅  [Job #${job.id}] Assignment "${assignmentId}" updated → status: completed`);

  // ── Step 4: Notify clients via WebSocket ───────────────────────────────────
  // Emit to the assignment-specific room so only subscribed clients receive it.
  // Frontend should call: socket.join(assignmentId) to subscribe.
  const payload = {
    assignmentId,
    status: 'completed',
    sections: updated.generatedPaper,
    completedAt: new Date().toISOString(),
  };

  try {
    emitToRoom(assignmentId, 'assignment_done', payload);
  } catch {
    // Socket.io might not be ready in test environments — fall back to broadcast
    broadcast('assignment_done', payload);
  }
}

// ── Worker ────────────────────────────────────────────────────────────────────

export const questionGenerationWorker = new Worker<QuestionGenerationJobData>(
  'question-generation',
  processQuestionGenerationJob,
  {
    connection: bullmqConnection,
    concurrency: 3, // process up to 3 assignments simultaneously
  }
);

// ── Event listeners ───────────────────────────────────────────────────────────

questionGenerationWorker.on('completed', (job) => {
  console.log(`✅  Question-generation worker — job #${job.id} completed`);
});

questionGenerationWorker.on('failed', (job, err) => {
  console.error(
    `❌  Question-generation worker — job #${job?.id} failed:`,
    err.message
  );
});

questionGenerationWorker.on('error', (err) => {
  console.error('❌  Question-generation worker error:', err);
});
