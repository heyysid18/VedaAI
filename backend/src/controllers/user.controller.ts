import { Request, Response, NextFunction } from 'express';
import * as userService from '../services/user.service';

// ── GET /users ────────────────────────────────────────────────────────────────

export async function getUsers(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const users = await userService.findAllUsers();
    res.status(200).json({ success: true, data: users });
  } catch (err) {
    next(err);
  }
}

// ── GET /users/:id ────────────────────────────────────────────────────────────

export async function getUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = await userService.findUserById(req.params.id);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
}

// ── POST /users ───────────────────────────────────────────────────────────────

export async function createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { name, email, passwordHash } = req.body as {
      name: string;
      email: string;
      passwordHash: string;
    };
    const user = await userService.createUser({ name, email, passwordHash });
    res.status(201).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
}

// ── PATCH /users/:id ──────────────────────────────────────────────────────────

export async function updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const updated = await userService.updateUser(req.params.id, req.body);
    if (!updated) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }
    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
}

// ── DELETE /users/:id ─────────────────────────────────────────────────────────

export async function deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const deleted = await userService.deleteUser(req.params.id);
    if (!deleted) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
