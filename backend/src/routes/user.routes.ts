import { Router } from 'express';
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from '../controllers/user.controller';

const router = Router();

/**
 * @route   GET /api/v1/users
 * @desc    Fetch all users
 */
router.get('/', getUsers);

/**
 * @route   GET /api/v1/users/:id
 * @desc    Fetch a single user by ID
 */
router.get('/:id', getUserById);

/**
 * @route   POST /api/v1/users
 * @desc    Create a new user
 * @body    { name, email, passwordHash }
 */
router.post('/', createUser);

/**
 * @route   PATCH /api/v1/users/:id
 * @desc    Partially update a user
 */
router.patch('/:id', updateUser);

/**
 * @route   DELETE /api/v1/users/:id
 * @desc    Delete a user
 */
router.delete('/:id', deleteUser);

export default router;
