import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRouter from './routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({
  origin: '*',
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger for horological audit trail
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    brand: 'VK TIME',
    status: 'Operational',
    timestamp: new Date().toISOString(),
    chronometerPrecision: 'Master Standard',
  });
});

// API Routes
app.use('/api', apiRouter);

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    error: 'Internal horology server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`═══════════════════════════════════════════════════════`);
    console.log(`   VK TIME Luxury Horology API Engine`);
    console.log(`   Server operating on http://localhost:${PORT}`);
    console.log(`   Precision: Synchronized | Environment: ${process.env.NODE_ENV}`);
    console.log(`═══════════════════════════════════════════════════════`);
  });
}

export default app;
