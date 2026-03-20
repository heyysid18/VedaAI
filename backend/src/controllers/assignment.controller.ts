import { Request, Response, NextFunction } from 'express';
import * as assignmentService from '../services/assignment.service';
import { enqueueQuestionGeneration } from '../queues/questionGeneration.queue';

// ── POST /assignments/generate/:id ────────────────────────────────────────────

export async function triggerGeneration(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const assignment = await assignmentService.findAssignmentById(req.params.id);
    if (!assignment) {
      res.status(404).json({ success: false, message: 'Assignment not found' });
      return;
    }

    await enqueueQuestionGeneration({
      assignmentId: assignment._id.toString(),
      title: assignment.title,
      questionTypes: assignment.questionTypes,
      numQuestions: assignment.numQuestions,
      marks: assignment.numQuestions * assignment.marksPerQuestion, // total marks
      instructions: assignment.instructions,
    });

    res.status(202).json({
      success: true,
      message: 'Question generation started. You will be notified via WebSocket when complete.',
      assignmentId: assignment._id.toString(),
    });
  } catch (err) {
    next(err);
  }
}


export async function createAssignment(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const assignment = await assignmentService.createAssignment(req.body);
    // Return the created assignment — AI generation is triggered separately by the user
    res.status(201).json({ success: true, data: assignment });
  } catch (err) {
    next(err);
  }
}


// ── GET /assignments ──────────────────────────────────────────────────────────

export async function getAssignments(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const assignments = await assignmentService.findAllAssignments();
    res.status(200).json({ success: true, data: assignments });
  } catch (err) {
    next(err);
  }
}

// ── GET /assignments/:id ──────────────────────────────────────────────────────

export async function getAssignmentById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const assignment = await assignmentService.findAssignmentById(req.params.id);
    if (!assignment) {
      res.status(404).json({ success: false, message: 'Assignment not found' });
      return;
    }
    res.status(200).json({ success: true, data: assignment });
  } catch (err) {
    next(err);
  }
}

// ── PATCH /assignments/:id ────────────────────────────────────────────────────

export async function updateAssignment(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const updated = await assignmentService.updateAssignment(req.params.id, req.body);
    if (!updated) {
      res.status(404).json({ success: false, message: 'Assignment not found' });
      return;
    }
    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
}

// ── DELETE /assignments/:id ───────────────────────────────────────────────────

export async function deleteAssignment(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const deleted = await assignmentService.deleteAssignment(req.params.id);
    if (!deleted) {
      res.status(404).json({ success: false, message: 'Assignment not found' });
      return;
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
