import { Worker, Job } from 'bullmq';
import { bullmqConnection } from '../config/bullmq';
import { EmailJobData } from '../queues/email.queue';

// ── Email Processor ───────────────────────────────────────────────────────────

async function processEmailJob(job: Job<EmailJobData>): Promise<void> {
  const { to, subject, body: _body, templateId } = job.data;

  console.log(`📬  [Job #${job.id}] Processing email → ${to}`);
  console.log(`    Subject : ${subject}`);
  if (templateId) console.log(`    Template: ${templateId}`);

  /**
   * TODO: Replace with your actual email provider (e.g. SendGrid, Resend, SES).
   *
   * Example (Resend):
   *   await resend.emails.send({ from: 'noreply@vedaai.com', to, subject, html: body });
   */

  // Simulate async sending
  await new Promise<void>((resolve) => setTimeout(resolve, 500));

  console.log(`✅  [Job #${job.id}] Email sent to ${to}`);
}

// ── Worker ────────────────────────────────────────────────────────────────────

export const emailWorker = new Worker<EmailJobData>('email', processEmailJob, {
  connection: bullmqConnection,
  concurrency: 5,
});

emailWorker.on('completed', (job) => {
  console.log(`✅  Email worker — job #${job.id} completed`);
});

emailWorker.on('failed', (job, err) => {
  console.error(`❌  Email worker — job #${job?.id} failed:`, err.message);
});

emailWorker.on('error', (err) => {
  console.error('❌  Email worker error:', err);
});
