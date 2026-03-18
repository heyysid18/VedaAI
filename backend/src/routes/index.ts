import { Router, Request, Response } from 'express';
import userRouter from './user.routes';
import assignmentRouter from './assignment.routes';

const router = Router();

// ── Health Check ──────────────────────────────────────────────────────────────

router.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// ── Resource Routes ───────────────────────────────────────────────────────────

router.use('/users', userRouter);
router.use('/assignments', assignmentRouter);


export default router;
