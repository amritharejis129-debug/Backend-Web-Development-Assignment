import express from 'express';
import postRoutes from './routes/postRoutes.js';
import { sendError } from './utils/http.js';

const app = express();

app.use(express.json());

// Mount routes
app.use('/', postRoutes);

// Global Error Handler - Prevents leaking stack traces to clients
app.use((err, req, res, next) => {
  console.error('[SERVER LOG]', err);

  return sendError(res, 'INTERNAL_ERROR', 'An internal server error occurred', 500);
});

export default app;