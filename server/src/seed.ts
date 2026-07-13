import bcrypt from 'bcryptjs';
import { pool, query } from './db';
import { migrate } from './migrate';
import { calculateUnilevelCommission } from './mlm';

const PASSWORD = process.env.SEED_PASSWORD || 'RakOasis@2026';

/** Idempotent demo/bootstrap seed. Safe to run repeatedly. */
async function seed() {
  await migrate();
  const hash = await bcrypt.hash(PASSWORD, 10);

  const upsertUser = async (u: {
    full_name: string; email: string; role: string; mobile?: string;
    agent_code?: string; sponsor_email?: string; rank?: number;
    kyc?: boolean; wallet?: string;
  }): Promise<string> => {
    let sponsorId: string | null = null;
    if (u.sponsor_email) {
      const { rows } = await query(`select id from profiles where email = $1`, [u.sponsor_email]);
      sponsorId = rows[0]?.id || null;
    }
    const { rows } = await query(
      `insert into profiles (full_name, email, mobile, password_hash, role, agent_code, sponsor_id, rank, kyc_verified, wallet_address_trc20)
       values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       on conflict (email) do update set full_name = excluded.full_name
       returning id`,
      [u.full_name, u.email, u.mobile || '+971501234567', hash, u.role,
       u.agent_code || null, sponsorId, u.rank || 1, u.kyc ?? true, u.wallet || null]
    );
    return rows[0].id;
  };

  // Users: admin + 3-level agent chain + clients
  await upsertUser({ full_name: 'System Administrator', email: 'admin@rakoasis.com', role: 'admin' });
  await upsertUser({
    full_name: 'Vikram Mehta', email: 'vikram@rakoasis.com', role: 'agent',
    agent_code: 'AGT-10501', rank: 4, wallet: 'TVikramWallet1234567890TRC20'
  });
  await upsertUser({
    full_name: 'Sunita Rao', email: 'sunita@rakoasis.com', role: 'agent',
    agent_code: 'AGT-10510', sponsor_email: 'vikram@rakoasis.com', rank: 3,
    wallet: 'TSunitaWallet1234567890TRC20'
  });
  const agentId = await upsertUser({
    full_name: 'Rajesh Kumar', email: 'agent@rakoasis.com', role: 'agent',
    agent_code: 'AGT-10523', sponsor_email: 'sunita@rakoasis.com', rank: 3,
    wallet: 'TRajeshWallet1234567890TRC20'
  });
  const clientId = await upsertUser({
    full_name: 'Amit Sharma', email: 'client@rakoasis.com', role: 'client',
    sponsor_email: 'agent@rakoasis.com'
  });
  await upsertUser({
    full_name: 'Neha Verma', email: 'neha@example.com', role: 'client',
    sponsor_email: 'agent@rakoasis.com', kyc: false
  });

  // Plots: blocks A-C, 8 per block. Base 131 AED/sqft * 1000 sqft; +5% garden/corner.
  const { rows: plotCount } = await query(`select count(*)::int as n from plots`);
  if (plotCount[0].n === 0) {
    for (const block of ['A', 'B', 'C']) {
      for (let i = 1; i <= 8; i++) {
        const type = i % 4 === 0 ? 'Corner Plot' : i % 3 === 0 ? 'Garden Facing' : 'Standard';
        const mult = type === 'Standard' ? 1 : 1.05;
        await query(
          `insert into plots (plot_number, block, type, size_sqft, price_aed, price_inr)
           values ($1, $2, $3, 1000, $4, $5)`,
          [`${block}-${100 + i}`, block, type, Math.round(131000 * mult), Math.round(3275000 * mult)]
        );
      }
    }
    console.log('seeded 24 plots');
  }

  // Demo booking + verified payment + commissions (only once)
  const { rows: existingBooking } = await query(
    `select id from bookings where user_id = $1 limit 1`, [clientId]
  );
  if (!existingBooking.length) {
    const { rows: plotRows } = await query(
      `update plots set status = 'RESERVED' where plot_number = 'A-101' returning *`
    );
    const plot = plotRows[0];
    const { rows: bookingRows } = await query(
      `insert into bookings (user_id, plot_id, status, total_amount, paid_amount, next_emi_date)
       values ($1, $2, 'CONFIRMED', $3, $4, (now() + interval '1 month')::date) returning *`,
      [clientId, plot.id, plot.price_inr, Math.round(plot.price_inr * 0.1)]
    );
    await query(`update plots set owner_id = $2 where id = $1`, [plot.id, clientId]);
    const { rows: payRows } = await query(
      `insert into payments (user_id, booking_id, amount, method, status, transaction_ref)
       values ($1, $2, $3, 'BANK_TRANSFER', 'verified', 'DEMO-TXN-001') returning *`,
      [clientId, bookingRows[0].id, Math.round(plot.price_inr * 0.1)]
    );
    await calculateUnilevelCommission(payRows[0].id, Number(payRows[0].amount), clientId);
    // Approve level-1 commission so agent has wallet balance for payout demo
    const { rows: comm } = await query(
      `update commissions set status = 'approved'
       where agent_id = $1 and source_payment_id = $2 returning amount`,
      [agentId, payRows[0].id]
    );
    if (comm.length) {
      await query(
        `update profiles set wallet_balance = wallet_balance + $2 where id = $1`,
        [agentId, comm[0].amount]
      );
    }
    console.log('seeded demo booking/payment/commissions');
  }

  // Announcements
  const { rows: updateCount } = await query(`select count(*)::int as n from updates`);
  if (updateCount[0].n === 0) {
    await query(
      `insert into updates (title, body, audience) values
       ('Phase 1 Launch Live', 'Phase 1 (84.67 acres) is now open for booking. Standard plots at 131 AED/sq.ft.', 'all'),
       ('Infrastructure Update', 'Road grading complete for Block A. Utility trenching begins next month.', 'client'),
       ('Q3 Leaderboard Contest', 'Top 3 agents by verified sales volume this quarter earn a bonus pool share.', 'agent')`
    );
    console.log('seeded updates');
  }

  console.log(`seed complete. Login: admin@rakoasis.com / agent@rakoasis.com / client@rakoasis.com — password: ${PASSWORD}`);
}

seed()
  .then(() => pool.end())
  .catch(e => { console.error(e); process.exit(1); });
