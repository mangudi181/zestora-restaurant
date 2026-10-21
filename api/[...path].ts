import express from 'express';
import { apiRouter } from '../server/routes';
import { db } from '../server/db';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Initialize DB then mount routes
let dbInitialized = false;

app.use(async (_req, _res, next) => {
  if (!dbInitialized) {
    try {
      await db.init();
      dbInitialized = true;
    } catch (err) {
      console.error('DB init error:', err);
    }
  }
  next();
});

app.use('/api', apiRouter);

export default app;
