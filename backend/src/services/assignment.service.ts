import { Assignment, IAssignment, IAssignmentDocument } from '../models/Assignment.model';

// ── Types ─────────────────────────────────────────────────────────────────────

export type CreateAssignmentInput = Omit<IAssignment, 'status' | 'generatedPaper' | 'createdAt' | 'updatedAt'> &
  Partial<Pick<IAssignment, 'status' | 'generatedPaper'>>;

// ── Create ────────────────────────────────────────────────────────────────────

export async function createAssignment(
  input: CreateAssignmentInput
): Promise<IAssignmentDocument> {
  const assignment = new Assignment(input);
  return assignment.save();
}

// ── Find All ──────────────────────────────────────────────────────────────────

export async function findAllAssignments(): Promise<IAssignmentDocument[]> {
  return Assignment.find().sort({ createdAt: -1 });
}

// ── Find By ID ────────────────────────────────────────────────────────────────

export async function findAssignmentById(
  id: string
): Promise<IAssignmentDocument | null> {
  return Assignment.findById(id);
}

// ── Update ────────────────────────────────────────────────────────────────────

export async function updateAssignment(
  id: string,
  update: Partial<IAssignment>
): Promise<IAssignmentDocument | null> {
  return Assignment.findByIdAndUpdate(id, update, { new: true, runValidators: true });
}

// ── Delete ────────────────────────────────────────────────────────────────────

export async function deleteAssignment(
  id: string
): Promise<IAssignmentDocument | null> {
  return Assignment.findByIdAndDelete(id);
}
