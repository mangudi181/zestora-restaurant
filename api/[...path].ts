
import express from 'express';
import { apiRouter } from '../server/routes';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' });
});

app.use('/api', apiRouter);

export default app;
