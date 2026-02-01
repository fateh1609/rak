export enum PlotType {
  STANDARD = 'Standard',
  GARDEN = 'Garden Facing',
  CORNER = 'Corner Plot'
}

export interface CalculationResult {
  totalAed: number;
  totalInr: number;
  bookingAmountAed: number;
  monthlyEmiAed: number;
}

export interface LeadForm {
  name: string;
  email: string;
  phone: string;
  interest: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}

export interface UserProfile {
  id: string;
  full_name: string;
  mobile: string;
  email: string;
  role: 'client' | 'agent' | 'admin';
  agent_code?: string;
}