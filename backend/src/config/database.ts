import mongoose from 'mongoose';
import { env } from './env';

const MONGO_OPTS: mongoose.ConnectOptions = {
  autoIndex: !env.isProduction, // disable in prod for perf
};

export async function connectDB(): Promise<void> {
  try {
    await mongoose.connect(env.MONGO_URI, MONGO_OPTS);
    console.log('✅  MongoDB connected');
  } catch (err) {
    console.error('❌  MongoDB connection error:', err);
    process.exit(1);
  }
}

export async function disconnectDB(): Promise<void> {
  await mongoose.disconnect();
  console.log('🔌  MongoDB disconnected');
}

// Surface connection events
mongoose.connection.on('disconnected', () => {
  console.warn('⚠️   MongoDB disconnected — attempting reconnect…');
});

mongoose.connection.on('error', (err) => {
  console.error('❌  MongoDB error:', err);
});
