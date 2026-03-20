export type QuestionType =
  | 'mcq'
  | 'short_answer'
  | 'long_answer'
  | 'true_false'
  | 'fill_in_the_blank';

export type Difficulty = 'easy' | 'medium' | 'hard';
export type AssignmentStatus = 'pending' | 'completed';

// ── Generated Paper ───────────────────────────────────────────────────────────

export interface GeneratedQuestion {
  questionText: string;
  questionType: QuestionType;
  marks: number;
  options?: string[];   // present for mcq and true_false
}

export interface GeneratedSection {
  sectionTitle: string;
  questions: GeneratedQuestion[];
}

// ── Assignment ─────────────────────────────────────────────────────────────────

export interface Assignment {
  _id: string;
  title: string;
  dueDate: string;
  questionTypes: QuestionType[];
  numQuestions: number;
  marksPerQuestion: number;
  instructions?: string;
  status: AssignmentStatus;
  generatedPaper: GeneratedSection[];
  createdAt: string;
  updatedAt: string;
}

// ── Form ──────────────────────────────────────────────────────────────────────

export interface CreateAssignmentDto {
  title: string;
  dueDate: string;
  questionTypes: QuestionType[];
  numQuestions: number;
  marksPerQuestion: number;
  instructions?: string;
}

// ── API Responses ─────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// ── Socket events ─────────────────────────────────────────────────────────────

export interface AssignmentDonePayload {
  assignmentId: string;
  status: AssignmentStatus;
  sections: GeneratedSection[];
  completedAt: string;
}
