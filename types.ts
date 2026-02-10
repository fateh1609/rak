
export enum PlotType {
  STANDARD = 'Standard',
  GARDEN = 'Garden Facing',
  CORNER = 'Corner Plot'
}

export enum UserRank {
  AGENT = 1,
  SENIOR_AGENT = 2,
  AREA_MANAGER = 3, // Unlocks 2% Infinity
  ZONAL_HEAD = 4,   // Unlocks 3% Infinity
  PRESIDENT = 5     // Unlocks 4% Infinity
}

export enum CommissionType {
  UNILEVEL = 'UNILEVEL',
  INFINITY = 'INFINITY',
  LEADERBOARD = 'LEADERBOARD'
}

export enum PaymentStatus {
  PENDING = 'pending',
  SUCCESS = 'success',
  FAILED = 'failed',
  VERIFIED = 'verified',
  REJECTED = 'rejected'
}

export interface CalculationResult {
  totalAed: number;
  totalInr: number;
  bookingAmountAed: number;
  monthlyEmiAed: number;
}

export interface UserProfile {
  id: string;
  full_name: string;
  mobile: string;
  email: string;
  role: 'client' | 'agent' | 'admin';
  agent_code?: string;
  sponsor_id?: string | null; // For Genealogy
  rank: UserRank;
  wallet_balance: number;
  kyc_verified: boolean;
  wallet_address_trc20?: string;
  created_at?: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}

// --- PAGE CONTROL TYPES ---
export enum PageStatus {
  ENABLED = 'ENABLED',
  DISABLED = 'DISABLED',
  HIDDEN = 'HIDDEN'
}

export interface PageSettings {
  client: {
    [key: string]: PageStatus;
  };
  agent: {
    [key: string]: PageStatus;
  };
}

// --- DASHBOARD TYPES ---

export type DashboardMode = 'GHOST' | 'LIVE';
export type WizardStep = 'KYC' | 'PLOT' | 'DEPOSIT' | 'SUCCESS';
export type PaymentMethod = 'RAZORPAY' | 'USDT_TRC20' | 'BANK_TRANSFER';
export type PlotStatus = 'AVAILABLE' | 'RESERVED' | 'SOLD' | 'FORFEITED';

export interface Plot {
    id: string;
    plot_number: string;
    block: string;
    type: PlotType;
    size_sqft: number;
    price_aed: number;
    price_inr: number; // For PDF calculation
    status: PlotStatus;
    owner_id?: string | null;
}

export interface Booking {
    id: string;
    user_id: string;
    plot_id: string;
    plot_details: Plot;
    status: 'PENDING_VERIFICATION' | 'CONFIRMED' | 'CANCELLED';
    booking_date: string;
    total_amount: number;
    paid_amount: number;
    next_emi_date: string;
    strike_count: number; // For 3-Strike Rule
}

export interface CommissionRecord {
    id: string;
    agent_id: string;
    source_payment_id: string;
    amount: number;
    type: CommissionType;
    level?: number; // 1-5 for Unilevel
    status: 'calculated_pending_approval' | 'approved' | 'paid';
    created_at: string;
}

export interface PayoutRequest {
    id: string;
    agent_id: string;
    amount_inr: number;
    amount_usdt: number;
    wallet_address: string;
    network: 'TRC20' | 'ERC20';
    status: 'pending_approval' | 'processing' | 'completed' | 'rejected';
    tx_hash?: string;
    created_at: string;
}
