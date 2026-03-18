import { Request, Response, NextFunction } from 'express';

// ── Allowed values ────────────────────────────────────────────────────────────

const VALID_QUESTION_TYPES = [
  'mcq',
  'short_answer',
  'long_answer',
  'true_false',
  'fill_in_the_blank',
] as const;

const VALID_STATUSES = ['pending', 'completed'] as const;

// ── Validate Create Assignment ────────────────────────────────────────────────

export function validateCreateAssignment(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const errors: string[] = [];
  const { title, dueDate, questionTypes, numQuestions, marks, instructions, status } =
    req.body;

  // title
  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    errors.push('title is required and must be a non-empty string');
  } else if (title.trim().length > 200) {
    errors.push('title cannot exceed 200 characters');
  }

  // dueDate
  if (!dueDate) {
    errors.push('dueDate is required');
  } else {
    const parsed = new Date(dueDate);
    if (isNaN(parsed.getTime())) {
      errors.push('dueDate must be a valid date');
    }
  }

  // questionTypes
  if (!Array.isArray(questionTypes) || questionTypes.length === 0) {
    errors.push('questionTypes must be a non-empty array');
  } else {
    const invalid = questionTypes.filter(
      (t: unknown) => typeof t !== 'string' || !VALID_QUESTION_TYPES.includes(t as any)
    );
    if (invalid.length > 0) {
      errors.push(
        `Invalid questionTypes: [${invalid.join(', ')}]. Allowed: ${VALID_QUESTION_TYPES.join(', ')}`
      );
    }
  }

  // numQuestions
  if (numQuestions === undefined || numQuestions === null) {
    errors.push('numQuestions is required');
  } else if (!Number.isInteger(numQuestions) || numQuestions < 1 || numQuestions > 500) {
    errors.push('numQuestions must be an integer between 1 and 500');
  }

  // marks
  if (marks === undefined || marks === null) {
    errors.push('marks is required');
  } else if (typeof marks !== 'number' || marks < 1) {
    errors.push('marks must be a number greater than or equal to 1');
  }

  // instructions (optional)
  if (instructions !== undefined && instructions !== null) {
    if (typeof instructions !== 'string') {
      errors.push('instructions must be a string');
    } else if (instructions.length > 2000) {
      errors.push('instructions cannot exceed 2000 characters');
    }
  }

  // status (optional)
  if (status !== undefined && !VALID_STATUSES.includes(status)) {
    errors.push(`status must be one of: ${VALID_STATUSES.join(', ')}`);
  }

  if (errors.length > 0) {
    res.status(400).json({ success: false, errors });
    return;
  }

  next();
}
