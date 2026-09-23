/**
 * Shared type definitions used across all Meeting-bot applications:
 * - Desktop App (natively-cluely-ai-assistant)
 * - Admin Panel
 * - Landing Page
 */

// ─── User ────────────────────────────────────────────────────────────────────

export interface UserRecord {
  id: string;
  email: string;
  minutes_used: number;
  credits: number;
  plan: 'free' | 'pro' | 'enterprise' | string;
  status: 'active' | 'inactive' | 'suspended' | string;
  created_at: string;
  last_active: string;
}

// ─── Payment ─────────────────────────────────────────────────────────────────

export interface PaymentRecord {
  id: string;
  user_email: string;
  utr_number: string;
  amount: number;
  credits?: number;
  status: 'pending' | 'approved' | 'rejected' | string;
  license_key?: string;
  created_at: string;
}

// ─── License ─────────────────────────────────────────────────────────────────

export interface LicenseRecord {
  id: string;
  email: string;
  license_key: string;
  plan: string;
  credits?: number;
  created_at: string;
}

// ─── Admin Overview Stats ────────────────────────────────────────────────────

export interface AdminOverviewStats {
  totalUsers: number;
  totalMinutesUsed: number;
  totalCreditsGranted: number;
  pendingPayments: number;
}

// ─── API Response ────────────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  error?: string;
  data?: T;
}
