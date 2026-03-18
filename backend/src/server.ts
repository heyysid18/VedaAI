import 'dotenv/config';
import http from 'http';
import app from './app';
import { env } from './config/env';
import { connectDB, disconnectDB } from './config/database';
import { connectRedis, disconnectRedis } from './config/redis';
import { initSocket } from './sockets';

// ── Imported to register workers at startup ───────────────────────────────────
import './workers/email.worker';
import './workers/questionGeneration.worker';


// ── HTTP Server ───────────────────────────────────────────────────────────────

const httpServer = http.createServer(app);

// ── Socket.io ─────────────────────────────────────────────────────────────────

initSocket(httpServer);

// ── Startup ───────────────────────────────────────────────────────────────────

async function start(): Promise<void> {
  try {
    await connectDB();
    // Connect to Redis (errors are handled inside connectRedis)
    await connectRedis();


    httpServer.listen(env.PORT, () => {
      console.log('');
      console.log(`🚀  Server running in ${env.NODE_ENV} mode`);
      console.log(`    ➜  http://localhost:${env.PORT}/api/v1/health`);
      console.log('');
    });
  } catch (err) {
    console.error('💥  Startup failed:', err);
    process.exit(1);
  }
}

// ── Graceful Shutdown ─────────────────────────────────────────────────────────

async function shutdown(signal: string): Promise<void> {
  console.log(`\n🛑  ${signal} received — shutting down gracefully…`);

  httpServer.close(async () => {
    console.log('🔒  HTTP server closed');
    await disconnectDB();
    await disconnectRedis();
    console.log('👋  Process exiting');
    process.exit(0);
  });

  // Force-kill after 15 s
  setTimeout(() => {
    console.error('⏱️  Graceful shutdown timed out — forcing exit');
    process.exit(1);
  }, 15_000);
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

process.on('uncaughtException', (err) => {
  console.error('💥  Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('💥  Unhandled Rejection:', reason);
  process.exit(1);
});

start();
