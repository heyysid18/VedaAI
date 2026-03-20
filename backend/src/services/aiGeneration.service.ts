import { GoogleGenerativeAI, GenerateContentResult } from '@google/generative-ai';
import { env } from '../config/env';
import { QuestionType } from '../models/Assignment.model';

// ── Types ─────────────────────────────────────────────────────────────────────

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface GeneratedQuestion {
  text: string;
  difficulty: Difficulty;
  marks: number;
  options?: string[];   // only for MCQ and true_false
}

export interface GeneratedSection {
  title: string;
  instruction: string;
  questions: GeneratedQuestion[];
}

export interface AIGenerationResult {
  sections: GeneratedSection[];
}

export interface AIGenerationInput {
  title: string;
  questionTypes: QuestionType[];
  numQuestions: number;
  marks: number;
  instructions?: string;
}

// ── Gemini client (singleton) ─────────────────────────────────────────────────

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

// ── Prompt builder ────────────────────────────────────────────────────────────

function buildPrompt(input: AIGenerationInput): string {
  const marksPerQuestion = Math.round(input.marks / input.numQuestions) || 1;
  const questionTypesFormatted = input.questionTypes.join(', ');

  return `
You are an expert exam paper generator.

Generate a structured exam paper for the assignment titled: "${input.title}".

Rules:
- Total questions: ${input.numQuestions}
- Total marks: ${input.marks}
- Marks per question: ${marksPerQuestion} (assign exactly ${marksPerQuestion} marks to each question)
- Question types to include: ${questionTypesFormatted}
- Distribute questions into sections — one section per question type.
- Each question must have a difficulty level: "easy", "medium", or "hard".
- For "mcq" and "true_false" question types, you MUST include an "options" array with exactly 4 choices for MCQ, or ["True", "False"] for True/False questions.
- For all other question types (short_answer, long_answer, fill_in_the_blank), omit the "options" field entirely.
${input.instructions ? `- Additional instructions: ${input.instructions}` : ''}

Return ONLY a valid JSON object in this exact format, with no extra text, no markdown, and no explanation:

{
  "sections": [
    {
      "title": "<Section title, e.g. Multiple Choice Questions>",
      "instruction": "<Brief instruction for the student, e.g. Choose the best answer>",
      "questions": [
        {
          "text": "<Question text>",
          "difficulty": "easy" | "medium" | "hard",
          "marks": ${marksPerQuestion},
          "options": ["Option A", "Option B", "Option C", "Option D"]  // include ONLY for mcq and true_false
        }
      ]
    }
  ]
}
`.trim();
}

// ── Safe JSON parser ──────────────────────────────────────────────────────────

function parseGeminiResponse(rawText: string): AIGenerationResult {
  // Strip any markdown code fences if the model accidentally wraps in ```json
  const cleaned = rawText
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error(
      `Gemini returned invalid JSON.\n\nRaw response:\n${rawText.slice(0, 500)}`
    );
  }

  // ── Runtime shape validation ────────────────────────────────────────────────
  if (
    typeof parsed !== 'object' ||
    parsed === null ||
    !Array.isArray((parsed as any).sections)
  ) {
    throw new Error(
      `Gemini response is missing "sections" array.\n\nParsed: ${JSON.stringify(parsed, null, 2).slice(0, 500)}`
    );
  }

  const sections = (parsed as any).sections as unknown[];

  const validSections: GeneratedSection[] = sections.map((sec: unknown, sIdx) => {
    if (
      typeof sec !== 'object' ||
      sec === null ||
      typeof (sec as any).title !== 'string' ||
      typeof (sec as any).instruction !== 'string' ||
      !Array.isArray((sec as any).questions)
    ) {
      throw new Error(`Section ${sIdx} is malformed: ${JSON.stringify(sec)}`);
    }

    const questions: GeneratedQuestion[] = ((sec as any).questions as unknown[]).map(
      (q: unknown, qIdx) => {
        if (
          typeof q !== 'object' ||
          q === null ||
          typeof (q as any).text !== 'string' ||
          !['easy', 'medium', 'hard'].includes((q as any).difficulty) ||
          typeof (q as any).marks !== 'number'
        ) {
          throw new Error(
            `Question ${qIdx} in section ${sIdx} is malformed: ${JSON.stringify(q)}`
          );
        }
        return {
          text: (q as any).text as string,
          difficulty: (q as any).difficulty as Difficulty,
          marks: (q as any).marks as number,
          options: Array.isArray((q as any).options) ? (q as any).options as string[] : undefined,
        };
      }
    );

    return {
      title: (sec as any).title as string,
      instruction: (sec as any).instruction as string,
      questions,
    };
  });

  return { sections: validSections };
}

// ── Main export ───────────────────────────────────────────────────────────────

/**
 * Calls the Gemini API to generate a structured exam paper.
 * Parses the response safely and validates its shape before returning.
 *
 * @throws If the Gemini API fails or returns unparseable / invalid JSON.
 */
export async function generateQuestionsWithAI(
  input: AIGenerationInput
): Promise<AIGenerationResult> {
  console.log(
    `🤖  [Gemini] Generating ${input.numQuestions} questions for: "${input.title}"`
  );

  const prompt = buildPrompt(input);

  let result: GenerateContentResult;
  try {
    result = await model.generateContent(prompt);
  } catch (err: any) {
    throw new Error(`Gemini API call failed: ${err.message}`);
  }

  const rawText = result.response.text();

  if (!rawText || rawText.trim().length === 0) {
    throw new Error('Gemini returned an empty response');
  }

  const structured = parseGeminiResponse(rawText);

  console.log(
    `✅  [Gemini] Generated ${structured.sections.reduce(
      (acc, s) => acc + s.questions.length,
      0
    )} questions across ${structured.sections.length} section(s)`
  );

  return structured;
}
