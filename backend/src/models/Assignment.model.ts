import { Schema, model, Document, Types } from 'mongoose';

// ── Enums ─────────────────────────────────────────────────────────────────────

export type AssignmentStatus = 'pending' | 'completed';

export type QuestionType =
  | 'mcq'
  | 'short_answer'
  | 'long_answer'
  | 'true_false'
  | 'fill_in_the_blank';

// ── Sub-document Interfaces ───────────────────────────────────────────────────

export interface IQuestion {
  questionText: string;
  questionType: QuestionType;
  marks: number;
  options?: string[]; // for MCQ / true_false
  answer?: string;
}

export interface ISection {
  sectionTitle: string;
  questions: IQuestion[];
}

// ── Main Interface ────────────────────────────────────────────────────────────

export interface IAssignment {
  title: string;
  dueDate: Date;
  questionTypes: QuestionType[];
  numQuestions: number;
  marks: number;
  instructions?: string;
  status: AssignmentStatus;
  generatedPaper: ISection[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IAssignmentDocument extends IAssignment, Document {
  _id: Types.ObjectId;
}

// ── Sub-schemas ───────────────────────────────────────────────────────────────

const QuestionSchema = new Schema<IQuestion>(
  {
    questionText: {
      type: String,
      required: [true, 'Question text is required'],
      trim: true,
    },
    questionType: {
      type: String,
      enum: ['mcq', 'short_answer', 'long_answer', 'true_false', 'fill_in_the_blank'],
      required: [true, 'Question type is required'],
    },
    marks: {
      type: Number,
      required: [true, 'Marks per question are required'],
      min: [0, 'Marks cannot be negative'],
    },
    options: {
      type: [String],
      default: undefined,
    },
    answer: {
      type: String,
      default: undefined,
    },
  },
  { _id: false }
);

const SectionSchema = new Schema<ISection>(
  {
    sectionTitle: {
      type: String,
      required: [true, 'Section title is required'],
      trim: true,
    },
    questions: {
      type: [QuestionSchema],
      default: [],
    },
  },
  { _id: false }
);

// ── Main Schema ───────────────────────────────────────────────────────────────

const AssignmentSchema = new Schema<IAssignmentDocument>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    dueDate: {
      type: Date,
      required: [true, 'Due date is required'],
    },
    questionTypes: {
      type: [String],
      enum: ['mcq', 'short_answer', 'long_answer', 'true_false', 'fill_in_the_blank'],
      required: [true, 'At least one question type is required'],
      validate: {
        validator: (v: string[]) => Array.isArray(v) && v.length > 0,
        message: 'questionTypes must be a non-empty array',
      },
    },
    numQuestions: {
      type: Number,
      required: [true, 'Number of questions is required'],
      min: [1, 'Must have at least 1 question'],
      max: [500, 'Cannot exceed 500 questions'],
    },
    marks: {
      type: Number,
      required: [true, 'Total marks are required'],
      min: [1, 'Marks must be at least 1'],
    },
    instructions: {
      type: String,
      trim: true,
      maxlength: [2000, 'Instructions cannot exceed 2000 characters'],
    },
    status: {
      type: String,
      enum: ['pending', 'completed'],
      default: 'pending',
    },
    generatedPaper: {
      type: [SectionSchema],
      default: [],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// ── Indexes ───────────────────────────────────────────────────────────────────

AssignmentSchema.index({ status: 1 });
AssignmentSchema.index({ dueDate: 1 });

// ── Model ─────────────────────────────────────────────────────────────────────

export const Assignment = model<IAssignmentDocument>('Assignment', AssignmentSchema);
