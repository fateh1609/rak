
import { supabase } from './supabaseClient';
import { UserProfile, CommissionType } from '../types';

/**
 * MLM ENGINE - CORE BUSINESS LOGIC
 * Based on Technical Specification v1.0
 */

// Section 1.1: Distribution Constants
const POOL_PERCENTAGE = 0.20; // 20% of inflow goes to pool
const UNILEVEL_RATES = { 1: 0.08, 2: 0.03, 3: 0.02, 4: 0.01, 5: 0.01 };
const INFINITY_RATES = { 3: 0.02, 4: 0.03, 5: 0.04 };
const TDS_RATE = 0.10;

/**
 * Section 1.2: Unilevel Calculation Algorithm
 * Executes per verified payment.
 */
export const calculateUnilevelCommission = async (paymentId: string, amount: number, clientId: string) => {
    // 1. Retrieve client's direct agent
    const { data: clientData } = await supabase
        .from('profiles')
        .select('sponsor_id')
        .eq('id', clientId)
        .single();

    if (!clientData?.sponsor_id) return; // No agent attached

    let currentAgentId = clientData.sponsor_id;

    // 2. Traverse genealogy tree upward (max 5 levels)
    for (let level = 1; level <= 5; level++) {
        // Get agent details
        const { data: agent } = await supabase
            .from('profiles')
            .select('id, sponsor_id, role, kyc_verified') // Added kyc check as per PDF
            .eq('id', currentAgentId)
            .single();

        if (!agent) break;

        // IF agent exists AND is active (KYC verified acts as basic active check here)
        if (agent.role === 'agent' && agent.kyc_verified) {
            const percentage = UNILEVEL_RATES[level as keyof typeof UNILEVEL_RATES];
            const commissionAmount = amount * percentage;

            // Store commission record (pending status)
            await supabase.from('commissions').insert({
                agent_id: agent.id,
                source_payment_id: paymentId,
                amount: commissionAmount,
                type: CommissionType.UNILEVEL,
                level: level,
                status: 'calculated_pending_approval' // As per Section 5.2 Step 2
            });
        }

        // Move to next upline
        if (agent.sponsor_id) {
            currentAgentId = agent.sponsor_id;
        } else {
            break; // Root reached
        }
    }
};

/**
 * Section 2.1: Rank Advancement Logic
 * Checks requirements: Sales Volume & Recruitment
 */
export const checkRankAdvancement = async (agentId: string) => {
    // Fetch stats
    const { data: stats } = await supabase.rpc('get_agent_stats', { agent_uuid: agentId });
    const { personal_sales, active_recruits, team_volume } = stats || { personal_sales: 0, active_recruits: 0, team_volume: 0 };

    let newRank = 1;

    // Rank 2: Complete ANY 2 quests (Example logic based on PDF Quests A-F)
    const questsCompleted = [
        personal_sales >= 1, // Quest A
        active_recruits >= 3, // Quest B
        personal_sales >= 5, // Quest C
        team_volume >= 25,   // Quest D
    ].filter(Boolean).length;

    if (questsCompleted >= 5) newRank = 5;
    else if (questsCompleted >= 4) newRank = 4;
    else if (questsCompleted >= 3) newRank = 3;
    else if (questsCompleted >= 2) newRank = 2;

    // Update Rank if increased
    if (newRank > 1) {
        await supabase.from('profiles').update({ rank: newRank }).eq('id', agentId);
        // Trigger notification logic here
    }
};

/**
 * Section 4.2: Payout Request Eligibility Check
 */
export const checkPayoutEligibility = async (agentId: string, amount: number) => {
    const { data: agent } = await supabase
        .from('profiles')
        .select('wallet_balance, kyc_verified, wallet_address_trc20')
        .eq('id', agentId)
        .single();

    if (!agent) throw new Error("Agent not found");

    // Rule 1: Min Balance
    if (agent.wallet_balance < 10000) throw new Error("Minimum payout is ₹10,000");
    
    // Rule 2: Wallet Verified
    if (!agent.wallet_address_trc20) throw new Error("No verified wallet found");

    // Rule 5: KYC
    if (!agent.kyc_verified) throw new Error("KYC not verified");

    // Rule: Sufficient Funds
    if (amount > agent.wallet_balance) throw new Error("Insufficient funds");

    return true;
};
