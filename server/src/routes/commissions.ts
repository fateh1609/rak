import { Router } from 'express';
import { pool, query } from '../db';
import { requireAuth, requireRole } from '../middleware/auth';

const router = Router();

router.get('/commissions/my', requireAuth, requireRole('agent', 'admin'), async (req, res) => {
  const { rows } = await query(
    `select c.*, u.full_name as source_client
     from commissions c
     left join payments pay on pay.id = c.source_payment_id
     left join profiles u on u.id = pay.user_id
     where c.agent_id = $1 order by c.created_at desc`,
    [req.user!.sub]
  );
  res.json({ commissions: rows });
});

router.get('/admin/commissions', requireAuth, requireRole('admin'), async (_req, res) => {
  const { rows } = await query(
    `select c.*, a.full_name as agent_name, a.agent_code
     from commissions c join profiles a on a.id = c.agent_id
     order by c.created_at desc`
  );
  res.json({ commissions: rows });
});

/** Approve commission: credits agent wallet. */
router.patch('/admin/commissions/:id/approve', requireAuth, requireRole('admin'), async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('begin');
    const { rows } = await client.query(
      `update commissions set status = 'approved'
       where id = $1 and status = 'calculated_pending_approval' returning *`,
      [req.params.id]
    );
    if (!rows.length) {
      await client.query('rollback');
      return res.status(404).json({ error: 'Pending commission not found' });
    }
    await client.query(
      `update profiles set wallet_balance = wallet_balance + $2 where id = $1`,
      [rows[0].agent_id, rows[0].amount]
    );
    await client.query('commit');
    res.json({ commission: rows[0] });
  } catch (e) {
    await client.query('rollback');
    throw e;
  } finally {
    client.release();
  }
});

export default router;
