import { query } from './db';

/**
 * MLM ENGINE — server-side port of lib/mlmEngine.ts
 * Runs inside payment verification.
 */

export const UNILEVEL_RATES: Record<number, number> = {
  1: 0.08, 2: 0.03, 3: 0.02, 4: 0.01, 5: 0.01
};

/**
 * Walks the genealogy upward from the paying client (max 5 levels),
 * inserting pending commission records for active KYC-verified agents.
 */
export async function calculateUnilevelCommission(paymentId: string, amount: number, clientId: string) {
  const { rows: clientRows } = await query(
    `select sponsor_id from profiles where id = $1`, [clientId]
  );
  let currentAgentId: string | null = clientRows[0]?.sponsor_id || null;

  for (let level = 1; level <= 5 && currentAgentId; level++) {
    const { rows } = await query(
      `select id, sponsor_id, role, kyc_verified, status from profiles where id = $1`,
      [currentAgentId]
    );
    const agent = rows[0];
    if (!agent) break;

    if (agent.role === 'agent' && agent.kyc_verified && agent.status === 'active') {
      const commissionAmount = Math.round(amount * UNILEVEL_RATES[level] * 100) / 100;
      await query(
        `insert into commissions (agent_id, source_payment_id, amount, type, level, status)
         values ($1, $2, $3, 'UNILEVEL', $4, 'calculated_pending_approval')`,
        [agent.id, paymentId, commissionAmount, level]
      );
    }
    currentAgentId = agent.sponsor_id;
  }
}

/** Payout eligibility (Section 4.2). Throws with user-facing message. */
export async function checkPayoutEligibility(agentId: string, amountInr: number) {
  const { rows } = await query(
    `select wallet_balance, kyc_verified, wallet_address_trc20 from profiles where id = $1`,
    [agentId]
  );
  const agent = rows[0];
  if (!agent) throw new Error('Agent not found');
  if (Number(agent.wallet_balance) < 10000) throw new Error('Minimum payout is ₹10,000');
  if (!agent.wallet_address_trc20) throw new Error('No verified wallet found');
  if (!agent.kyc_verified) throw new Error('KYC not verified');
  if (amountInr > Number(agent.wallet_balance)) throw new Error('Insufficient funds');
  return agent;
}
