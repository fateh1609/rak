import { Router } from 'express';
import { pool, query } from '../db';
import { requireAuth, requireRole } from '../middleware/auth';
import { calculateUnilevelCommission } from '../mlm';

const router = Router();

/** Client submits a payment (proof) against a booking. */
router.post('/payments', requireAuth, async (req, res) => {
  const { booking_id, amount, method, transaction_ref } = req.body || {};
  if (!booking_id || !amount || Number(amount) <= 0) {
    return res.status(400).json({ error: 'booking_id and positive amount required' });
  }
  const { rows: bookingRows } = await query(
    `select id from bookings where id = $1 and user_id = $2 and status != 'CANCELLED'`,
    [booking_id, req.user!.sub]
  );
  if (!bookingRows.length) return res.status(404).json({ error: 'Booking not found' });

  const { rows } = await query(
    `insert into payments (user_id, booking_id, amount, method, transaction_ref)
     values ($1, $2, $3, $4, $5) returning *`,
    [req.user!.sub, booking_id, amount, method || 'BANK_TRANSFER', transaction_ref || null]
  );
  res.status(201).json({ payment: rows[0] });
});

router.get('/payments/my', requireAuth, async (req, res) => {
  const { rows } = await query(
    `select * from payments where user_id = $1 order by created_at desc`,
    [req.user!.sub]
  );
  res.json({ payments: rows });
});

router.get('/admin/payments', requireAuth, requireRole('admin'), async (_req, res) => {
  const { rows } = await query(
    `select pay.*, u.full_name as client_name, u.email as client_email
     from payments pay join profiles u on u.id = pay.user_id
     order by pay.created_at desc`
  );
  res.json({ payments: rows });
});

/**
 * Admin verifies or rejects a payment.
 * Verify: booking paid_amount += amount, plot SOLD once booking confirmed & paid,
 * then unilevel commissions calculated.
 */
router.patch('/admin/payments/:id/verify', requireAuth, requireRole('admin'), async (req, res) => {
  const { action } = req.body || {}; // 'verify' | 'reject'
  if (!['verify', 'reject'].includes(action)) {
    return res.status(400).json({ error: "action must be 'verify' or 'reject'" });
  }

  const client = await pool.connect();
  try {
    await client.query('begin');
    const { rows } = await client.query(
      `update payments set status = $2, verified_by = $3
       where id = $1 and status = 'pending' returning *`,
      [req.params.id, action === 'verify' ? 'verified' : 'rejected', req.user!.sub]
    );
    if (!rows.length) {
      await client.query('rollback');
      return res.status(404).json({ error: 'Pending payment not found' });
    }
    const payment = rows[0];

    if (action === 'verify' && payment.booking_id) {
      const { rows: bookingRows } = await client.query(
        `update bookings set paid_amount = paid_amount + $2,
           next_emi_date = (next_emi_date + interval '1 month')::date
         where id = $1 returning *`,
        [payment.booking_id, payment.amount]
      );
      const booking = bookingRows[0];
      if (booking && Number(booking.paid_amount) >= Number(booking.total_amount)) {
        await client.query(
          `update plots set status = 'SOLD', owner_id = $2 where id = $1`,
          [booking.plot_id, booking.user_id]
        );
      }
    }
    await client.query('commit');

    if (action === 'verify') {
      await calculateUnilevelCommission(payment.id, Number(payment.amount), payment.user_id);
    }
    res.json({ payment });
  } catch (e) {
    await client.query('rollback');
    throw e;
  } finally {
    client.release();
  }
});

export default router;
