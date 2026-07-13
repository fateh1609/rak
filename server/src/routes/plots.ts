import { Router } from 'express';
import { query } from '../db';
import { requireAuth, requireRole } from '../middleware/auth';

const router = Router();

router.get('/plots', requireAuth, async (_req, res) => {
  const { rows } = await query(`select * from plots order by plot_number`);
  res.json({ plots: rows });
});

router.post('/admin/plots', requireAuth, requireRole('admin'), async (req, res) => {
  const { plot_number, block, type, size_sqft, price_aed, price_inr } = req.body || {};
  if (!plot_number || !block || !type || !price_aed || !price_inr) {
    return res.status(400).json({ error: 'plot_number, block, type, price_aed, price_inr required' });
  }
  try {
    const { rows } = await query(
      `insert into plots (plot_number, block, type, size_sqft, price_aed, price_inr)
       values ($1,$2,$3,$4,$5,$6) returning *`,
      [plot_number, block, type, size_sqft || 1000, price_aed, price_inr]
    );
    res.status(201).json({ plot: rows[0] });
  } catch (e: any) {
    if (e.code === '23505') return res.status(409).json({ error: 'Plot number already exists' });
    throw e;
  }
});

router.patch('/admin/plots/:id', requireAuth, requireRole('admin'), async (req, res) => {
  const { status, price_aed, price_inr, type, block } = req.body || {};
  const { rows } = await query(
    `update plots set
       status = coalesce($2, status),
       price_aed = coalesce($3, price_aed),
       price_inr = coalesce($4, price_inr),
       type = coalesce($5, type),
       block = coalesce($6, block)
     where id = $1 returning *`,
    [req.params.id, status || null, price_aed || null, price_inr || null, type || null, block || null]
  );
  if (!rows.length) return res.status(404).json({ error: 'Plot not found' });
  res.json({ plot: rows[0] });
});

router.delete('/admin/plots/:id', requireAuth, requireRole('admin'), async (req, res) => {
  const { rowCount } = await query(
    `delete from plots where id = $1 and status = 'AVAILABLE'`, [req.params.id]
  );
  if (!rowCount) return res.status(409).json({ error: 'Only AVAILABLE plots can be deleted' });
  res.json({ ok: true });
});

export default router;
