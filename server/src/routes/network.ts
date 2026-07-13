import { Router } from 'express';
import { query } from '../db';
import { requireAuth, requireRole } from '../middleware/auth';

const router = Router();

/** Full downline tree (agents + clients) for the requesting agent, max 5 levels. */
router.get('/network/tree', requireAuth, requireRole('agent', 'admin'), async (req, res) => {
  const { rows } = await query(
    `with recursive downline as (
       select id, full_name, email, role, agent_code, sponsor_id, rank, kyc_verified, status, created_at, 1 as level
       from profiles where sponsor_id = $1
       union all
       select p.id, p.full_name, p.email, p.role, p.agent_code, p.sponsor_id, p.rank, p.kyc_verified, p.status, p.created_at, d.level + 1
       from profiles p join downline d on p.sponsor_id = d.id
       where d.level < 5
     )
     select * from downline order by level, created_at`,
    [req.user!.sub]
  );
  res.json({ network: rows });
});

/** Aggregate stats for agent home/sidebar. */
router.get('/network/stats', requireAuth, requireRole('agent', 'admin'), async (req, res) => {
  const agentId = req.user!.sub;
  const [direct, team, monthEarnings, totalEarnings, pendingCommissions, sales] = await Promise.all([
    query(`select count(*)::int as n from profiles where sponsor_id = $1`, [agentId]),
    query(
      `with recursive downline as (
         select id from profiles where sponsor_id = $1
         union all
         select p.id from profiles p join downline d on p.sponsor_id = d.id
       ) select count(*)::int as n from downline`,
      [agentId]
    ),
    query(
      `select coalesce(sum(amount), 0)::numeric as n from commissions
       where agent_id = $1 and status in ('approved', 'paid')
         and created_at >= date_trunc('month', now())`,
      [agentId]
    ),
    query(
      `select coalesce(sum(amount), 0)::numeric as n from commissions
       where agent_id = $1 and status in ('approved', 'paid')`,
      [agentId]
    ),
    query(
      `select coalesce(sum(amount), 0)::numeric as n from commissions
       where agent_id = $1 and status = 'calculated_pending_approval'`,
      [agentId]
    ),
    query(
      `select count(*)::int as n from bookings b
       join profiles c on c.id = b.user_id
       where c.sponsor_id = $1 and b.status != 'CANCELLED'`,
      [agentId]
    )
  ]);
  const { rows: me } = await query(
    `select wallet_balance, rank, agent_code from profiles where id = $1`, [agentId]
  );
  res.json({
    stats: {
      direct_team: direct.rows[0].n,
      total_network: team.rows[0].n,
      month_earnings: Number(monthEarnings.rows[0].n),
      total_earnings: Number(totalEarnings.rows[0].n),
      pending_commissions: Number(pendingCommissions.rows[0].n),
      direct_sales: sales.rows[0].n,
      wallet_balance: Number(me[0]?.wallet_balance || 0),
      rank: me[0]?.rank || 1,
      agent_code: me[0]?.agent_code
    }
  });
});

/** Direct clients of the requesting agent with booking + commission aggregates. */
router.get('/network/clients', requireAuth, requireRole('agent', 'admin'), async (req, res) => {
  const { rows } = await query(
    `select c.id, c.full_name, c.email, c.mobile, c.kyc_verified, c.created_at,
            b.id as booking_id, b.status as booking_status, b.total_amount, b.paid_amount,
            b.next_emi_date, b.booking_date,
            p.plot_number, p.block,
            coalesce((
              select sum(cm.amount) from commissions cm
              join payments pay on pay.id = cm.source_payment_id
              where cm.agent_id = $1 and pay.user_id = c.id
                and cm.status in ('approved', 'paid')
            ), 0)::numeric as my_earnings
     from profiles c
     left join bookings b on b.user_id = c.id and b.status != 'CANCELLED'
     left join plots p on p.id = b.plot_id
     where c.sponsor_id = $1 and c.role = 'client'
     order by c.created_at desc`,
    [req.user!.sub]
  );
  res.json({ clients: rows });
});

/** Top agents by approved commissions. */
router.get('/leaderboard', requireAuth, async (_req, res) => {
  const { rows } = await query(
    `select a.id, a.full_name, a.agent_code, a.rank,
            coalesce(sum(c.amount), 0)::numeric as total_earnings,
            count(distinct c.id)::int as commission_count
     from profiles a
     left join commissions c on c.agent_id = a.id and c.status in ('approved', 'paid')
     where a.role = 'agent' and a.status = 'active'
     group by a.id order by total_earnings desc limit 20`
  );
  res.json({ leaderboard: rows });
});

export default router;
