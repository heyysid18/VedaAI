import { Queue } from 'bullmq';
import { bullmqConnection } from '../config/bullmq';
import { QuestionType } from '../models/Assignment.model';

// ── Job Data Shape ─────────────────────────────────────────────────────────────

/**
 * Data passed to every question-generation job.
 * Matches the core fields from the Assignment document.
 */
export interface QuestionGenerationJobData {
  assignmentId: string;
  title: string;
  questionTypes: QuestionType[];
  numQuestions: number;
  marks: number;
  instructions?: string;
}

// ── Queue ─────────────────────────────────────────────────────────────────────

export const questionGenerationQueue = new Queue<QuestionGenerationJobData>(
  'question-generation',
  {
    connection: bullmqConnection,
    defaultJobOptions: {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 3000, // 3 s → 6 s → 12 s
      },
      removeOnComplete: { count: 50 },
      removeOnFail: { count: 200 },
    },
  }
);

// ── Helper ────────────────────────────────────────────────────────────────────

/**
 * Enqueue a question-generation job for the given assignment.
 * Call this immediately after a new Assignment is saved.
 */
export async function enqueueQuestionGeneration(
  data: QuestionGenerationJobData
): Promise<void> {
  await questionGenerationQueue.add('generate-questions', data);
  console.log(`📝  Question-generation job queued for assignment: ${data.assignmentId}`);
}
