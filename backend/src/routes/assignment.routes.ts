import { Router } from 'express';
import {
  createAssignment,
  getAssignments,
  getAssignmentById,
  updateAssignment,
  deleteAssignment,
} from '../controllers/assignment.controller';
import { validateCreateAssignment } from '../middlewares/assignment.validation';

const router = Router();

/**
 * @route   POST /api/v1/assignments
 * @desc    Create a new assignment
 * @body    { title, dueDate, questionTypes, numQuestions, marks, instructions?, status?, generatedPaper? }
 */
router.post('/', validateCreateAssignment, createAssignment);

/**
 * @route   GET /api/v1/assignments
 * @desc    Fetch all assignments
 */
router.get('/', getAssignments);

/**
 * @route   GET /api/v1/assignments/:id
 * @desc    Fetch a single assignment by ID
 */
router.get('/:id', getAssignmentById);

/**
 * @route   PATCH /api/v1/assignments/:id
 * @desc    Partially update an assignment
 */
router.patch('/:id', updateAssignment);

/**
 * @route   DELETE /api/v1/assignments/:id
 * @desc    Delete an assignment
 */
router.delete('/:id', deleteAssignment);

export default router;
