import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env';
import apiRouter from './routes';
import { notFound } from './middlewares/notFound';
import { errorHandler } from './middlewares/errorHandler';

const app: Application = express();

// ── Security & Utility Middleware ─────────────────────────────────────────────

app.use(helmet());

app.use(
  cors({
    origin: env.ALLOWED_ORIGINS,
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (env.isDevelopment) {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// ── Routes ────────────────────────────────────────────────────────────────────

app.use('/api/v1', apiRouter); // versioned
app.use('/api', apiRouter);    // unversioned alias (backwards compat)

// ── Error Handling ────────────────────────────────────────────────────────────

app.use(notFound);
app.use(errorHandler);

export default app;
