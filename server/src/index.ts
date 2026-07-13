import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { migrate } from './migrate';
import authRoutes from './routes/auth';
import plotRoutes from './routes/plots';
import bookingRoutes from './routes/bookings';
import paymentRoutes from './routes/payments';
import commissionRoutes from './routes/commissions';
import payoutRoutes from './routes/payouts';
import networkRoutes from './routes/network';
import adminRoutes from './routes/admin';
import contentRoutes from './routes/content';
import advisorRoutes from './routes/advisor';

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.use('/api/auth', authRoutes);
app.use('/api', plotRoutes);
app.use('/api', bookingRoutes);
app.use('/api', paymentRoutes);
app.use('/api', commissionRoutes);
app.use('/api', payoutRoutes);
app.use('/api', networkRoutes);
app.use('/api', adminRoutes);
app.use('/api', contentRoutes);
app.use('/api', advisorRoutes);

app.use((_req, res) => res.status(404).json({ error: 'Not found' }));

// Central error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = Number(process.env.PORT || 4000);

migrate()
  .then(() => {
    app.listen(PORT, () => console.log(`RAK Oasis API listening on :${PORT}`));
  })
  .catch(e => {
    console.error('Migration failed:', e);
    process.exit(1);
  });
