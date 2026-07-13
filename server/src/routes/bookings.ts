import { Router } from 'express';
import { pool, query } from '../db';
import { requireAuth, requireRole } from '../middleware/auth';

const router = Router();

const BOOKING_SELECT = `
  select b.*, row_to_json(p.*) as plot_details
  from bookings b join plots p on p.id = b.plot_id`;

/** Client books a plot: reserves it, creates booking with 10% booking amount due. */
router.post('/bookings', requireAuth, async (req, res) => {
  const { plot_id } = req.body || {};
  if (!plot_id) return res.status(400).json({ error: 'plot_id required' });

  const client = await pool.connect();
  try {
    await client.query('begin');
    const { rows: plotRows } = await client.query(
      `update plots set status = 'RESERVED' where id = $1 and status = 'AVAILABLE' returning *`,
      [plot_id]
    );
    if (!plotRows.length) {
      await client.query('rollback');
      return res.status(409).json({ error: 'Plot is not available' });
    }
    const plot = plotRows[0];
    const { rows: bookingRows } = await client.query(
      `insert into bookings (user_id, plot_id, total_amount, next_emi_date)
       values ($1, $2, $3, (now() + interval '1 month')::date) returning *`,
      [req.user!.sub, plot_id, plot.price_inr]
    );
    await client.query('commit');
    res.status(201).json({ booking: { ...bookingRows[0], plot_details: plot } });
  } catch (e) {
    await client.query('rollback');
    throw e;
  } finally {
    client.release();
  }
});

router.get('/bookings/my', requireAuth, async (req, res) => {
  const { rows } = await query(
    `${BOOKING_SELECT} where b.user_id = $1 order by b.booking_date desc`,
    [req.user!.sub]
  );
  res.json({ bookings: rows });
});

router.get('/admin/bookings', requireAuth, requireRole('admin'), async (_req, res) => {
  const { rows } = await query(
    `select b.*, row_to_json(p.*) as plot_details, u.full_name as client_name, u.email as client_email
     from bookings b
     join plots p on p.id = b.plot_id
     join profiles u on u.id = b.user_id
     order by b.booking_date desc`
  );
  res.json({ bookings: rows });
});

/** Admin confirm/cancel booking. Cancel releases the plot. */
router.patch('/admin/bookings/:id', requireAuth, requireRole('admin'), async (req, res) => {
  const { status } = req.body || {};
  if (!['CONFIRMED', 'CANCELLED'].includes(status)) {
    return res.status(400).json({ error: 'status must be CONFIRMED or CANCELLED' });
  }
  const client = await pool.connect();
  try {
    await client.query('begin');
    const { rows } = await client.query(
      `update bookings set status = $2 where id = $1 returning *`,
      [req.params.id, status]
    );
    if (!rows.length) {
      await client.query('rollback');
      return res.status(404).json({ error: 'Booking not found' });
    }
    const booking = rows[0];
    if (status === 'CANCELLED') {
      await client.query(
        `update plots set status = 'AVAILABLE', owner_id = null where id = $1`,
        [booking.plot_id]
      );
    } else {
      await client.query(
        `update plots set owner_id = $2 where id = $1`,
        [booking.plot_id, booking.user_id]
      );
    }
    await client.query('commit');
    res.json({ booking });
  } catch (e) {
    await client.query('rollback');
    throw e;
  } finally {
    client.release();
  }
});

export default router;
