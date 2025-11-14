import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/auth.js';

dotenv.config();

const app = express();

// Config via env
const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000';
const TRUST_PROXY = (process.env.REACT_APP_TRUST_PROXY || 'false').toLowerCase() === 'true';

if (TRUST_PROXY) {
  app.set('trust proxy', 1);
}

// Security & middleware
app.use(helmet());
app.use(
  cors({
    origin: CORS_ORIGIN,
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  })
);
app.use(express.json());
app.use(morgan('dev'));

// Basic rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  limit: 30, // max overall per minute
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/auth', authLimiter);

// Health check endpoint
// PUBLIC_INTERFACE
app.get('/health', (req, res) => {
  /**
   * This endpoint reports basic health status of the backend.
   * Returns 200 with JSON payload { status: "ok" }.
   */
  res.status(200).json({ status: 'ok' });
});

// Register routes
app.use('/auth', authRoutes);

// Error handler
// PUBLIC_INTERFACE
app.use((err, req, res, next) => {
  /** Centralized error handler returning JSON with message and optional details. */
  // eslint-disable-next-line no-console
  console.error('Error:', err);
  if (res.headersSent) {
    return next(err);
  }
  const status = err.status || 500;
  res.status(status).json({
    error: err.message || 'Internal Server Error',
  });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Auth backend running on http://localhost:${PORT}`);
});
