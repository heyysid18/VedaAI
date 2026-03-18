import { Queue } from 'bullmq';
import { bullmqConnection } from '../config/bullmq';

// ── Job Data Shape ─────────────────────────────────────────────────────────────

export interface EmailJobData {
  to: string;
  subject: string;
  body: string;
  templateId?: string;
}

// ── Queue ─────────────────────────────────────────────────────────────────────

export const emailQueue = new Queue<EmailJobData>('email', {
  connection: bullmqConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000, // 5 s → 10 s → 20 s
    },
    removeOnComplete: { count: 100 },
    removeOnFail: { count: 500 },
  },
});

// ── Helper Factories ──────────────────────────────────────────────────────────

export async function enqueueEmail(data: EmailJobData): Promise<void> {
  await emailQueue.add('send-email', data);
  console.log(`📧  Email job queued for: ${data.to}`);
}

export async function enqueueEmailWithDelay(
  data: EmailJobData,
  delayMs: number
): Promise<void> {
  await emailQueue.add('send-email', data, { delay: delayMs });
  console.log(`📧  Email job queued (delay: ${delayMs}ms) for: ${data.to}`);
}
