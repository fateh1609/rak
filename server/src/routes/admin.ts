import { Router } from 'express';
import { query } from '../db';
import { requireAuth, requireRole } from '../middleware/auth';

const router = Router();
router.use(requireAuth, requireRole('admin'));

/** Dashboard aggregate stats. */
router.get('/admin/stats', async (_req, res) => {
  const [clients, agents, pendingAgents, plots, soldPlots, payments, pendingPayments,
    commissions, pendingPayouts, volume] = await Promise.all([
    query(`select count(*)::int as n from profiles where role = 'client'`),
    query(`select count(*)::int as n from profiles where role = 'agent'`),
    query(`select count(*)::int as n from profiles where role = 'agent' and status = 'pending'`),
    query(`select count(*)::int as n from plots`),
    query(`select count(*)::int as n from plots where status = 'SOLD'`),
    query(`select count(*)::int as n from payments`),
    query(`select count(*)::int as n from payments where status = 'pending'`),
    query(`select coalesce(sum(amount),0)::numeric as n from commissions where status = 'calculated_pending_approval'`),
    query(`select count(*)::int as n from payout_requests where status = 'pending_approval'`),
    query(`select coalesce(sum(amount),0)::numeric as n from payments where status = 'verified'`)
  ]);
  res.json({
    stats: {
      clients: clients.rows[0].n,
      agents: agents.rows[0].n,
      pending_agents: pendingAgents.rows[0].n,
      plots: plots.rows[0].n,
      sold_plots: soldPlots.rows[0].n,
      payments: payments.rows[0].n,
      pending_payments: pendingPayments.rows[0].n,
      pending_commission_amount: Number(commissions.rows[0].n),
      pending_payouts: pendingPayouts.rows[0].n,
      verified_volume: Number(volume.rows[0].n)
    }
  });
});

/** Clients list; ?filter=kyc_pending|defaulters */
router.get('/admin/clients', async (req, res) => {
  const filter = String(req.query.filter || '');
  let where = `role = 'client'`;
  if (filter === 'kyc_pending') where += ` and kyc_verified = false`;
  let sql = `
    select p.id, p.full_name, p.email, p.mobile, p.kyc_verified, p.status, p.created_at,
           s.agent_code as sponsor_code,
           (select count(*)::int from bookings b where b.user_id = p.id and b.status != 'CANCELLED') as bookings
    from profiles p left join profiles s on s.id = p.sponsor_id
    where p.${where.replace(/ and /g, ' and p.')}`;
  if (filter === 'defaulters') {
    sql = `
      select p.id, p.full_name, p.email, p.mobile, p.kyc_verified, p.status, p.created_at,
             s.agent_code as sponsor_code,
             (select count(*)::int from bookings b where b.user_id = p.id and b.status != 'CANCELLED') as bookings
      from profiles p left join profiles s on s.id = p.sponsor_id
      where p.role = 'client' and exists (
        select 1 from bookings b where b.user_id = p.id
          and b.status != 'CANCELLED' and b.next_emi_date < now()::date
          and b.paid_amount < b.total_amount
      )`;
  }
  const { rows } = await query(sql + ` order by p.created_at desc`);
  res.json({ clients: rows });
});

/** Agents list; ?filter=pending */
router.get('/admin/agents', async (req, res) => {
  const filter = String(req.query.filter || '');
  const where = filter === 'pending' ? `and p.status = 'pending'` : '';
  const { rows } = await query(
    `select p.id, p.full_name, p.email, p.mobile, p.agent_code, p.rank, p.status,
            p.kyc_verified, p.wallet_balance, p.created_at,
            s.agent_code as sponsor_code,
            (select count(*)::int from profiles d where d.sponsor_id = p.id) as direct_team
     from profiles p left join profiles s on s.id = p.sponsor_id
     where p.role = 'agent' ${where}
     order by p.created_at desc`
  );
  res.json({ agents: rows });
});

/** Update user: approve agent, toggle KYC, suspend, set rank. */
router.patch('/admin/users/:id', async (req, res) => {
  const { status, kyc_verified, rank } = req.body || {};
  const { rows } = await query(
    `update profiles set
       status = coalesce($2, status),
       kyc_verified = coalesce($3, kyc_verified),
       rank = coalesce($4, rank)
     where id = $1
     returning id, full_name, email, role, agent_code, rank, status, kyc_verified`,
    [req.params.id, status ?? null, kyc_verified ?? null, rank ?? null]
  );
  if (!rows.length) return res.status(404).json({ error: 'User not found' });
  res.json({ user: rows[0] });
});

export default router;
