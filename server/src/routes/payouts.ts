import { Router } from 'express';
import { pool, query } from '../db';
import { requireAuth, requireRole } from '../middleware/auth';
import { checkPayoutEligibility } from '../mlm';

const router = Router();

const USDT_INR_RATE = Number(process.env.USDT_INR_RATE || 92);

/** Agent requests a payout; wallet debited immediately (refunded on reject). */
router.post('/payouts', requireAuth, requireRole('agent'), async (req, res) => {
  const amountInr = Number(req.body?.amount_inr);
  if (!amountInr || amountInr <= 0) return res.status(400).json({ error: 'amount_inr required' });

  let agent;
  try {
    agent = await checkPayoutEligibility(req.user!.sub, amountInr);
  } catch (e: any) {
    return res.status(400).json({ error: e.message });
  }

  const client = await pool.connect();
  try {
    await client.query('begin');
    await client.query(
      `update profiles set wallet_balance = wallet_balance - $2 where id = $1`,
      [req.user!.sub, amountInr]
    );
    const { rows } = await client.query(
      `insert into payout_requests (agent_id, amount_inr, amount_usdt, wallet_address)
       values ($1, $2, $3, $4) returning *`,
      [req.user!.sub, amountInr, Math.round((amountInr / USDT_INR_RATE) * 100) / 100, agent.wallet_address_trc20]
    );
    await client.query('commit');
    res.status(201).json({ payout: rows[0] });
  } catch (e) {
    await client.query('rollback');
    throw e;
  } finally {
    client.release();
  }
});

router.get('/payouts/my', requireAuth, requireRole('agent'), async (req, res) => {
  const { rows } = await query(
    `select * from payout_requests where agent_id = $1 order by created_at desc`,
    [req.user!.sub]
  );
  res.json({ payouts: rows });
});

router.get('/admin/payouts', requireAuth, requireRole('admin'), async (_req, res) => {
  const { rows } = await query(
    `select pr.*, a.full_name as agent_name, a.agent_code
     from payout_requests pr join profiles a on a.id = pr.agent_id
     order by pr.created_at desc`
  );
  res.json({ payouts: rows });
});

/** Admin processes payout: complete (with tx_hash) or reject (refund wallet). */
router.patch('/admin/payouts/:id', requireAuth, requireRole('admin'), async (req, res) => {
  const { action, tx_hash } = req.body || {}; // 'complete' | 'reject'
  if (!['complete', 'reject'].includes(action)) {
    return res.status(400).json({ error: "action must be 'complete' or 'reject'" });
  }
  const client = await pool.connect();
  try {
    await client.query('begin');
    const { rows } = await client.query(
      `update payout_requests set status = $2, tx_hash = $3
       where id = $1 and status in ('pending_approval', 'processing') returning *`,
      [req.params.id, action === 'complete' ? 'completed' : 'rejected', tx_hash || null]
    );
    if (!rows.length) {
      await client.query('rollback');
      return res.status(404).json({ error: 'Open payout not found' });
    }
    if (action === 'reject') {
      await client.query(
        `update profiles set wallet_balance = wallet_balance + $2 where id = $1`,
        [rows[0].agent_id, rows[0].amount_inr]
      );
    }
    await client.query('commit');
    res.json({ payout: rows[0] });
  } catch (e) {
    await client.query('rollback');
    throw e;
  } finally {
    client.release();
  }
});

export default router;
