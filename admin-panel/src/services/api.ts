import type { UserRecord, PaymentRecord, LicenseRecord, AdminOverviewStats } from '../../../shared/types';
import { API_BASE_URL } from '../../../shared/constants';

export const adminApi = {
  async fetchOverview(): Promise<{ success: boolean; stats: AdminOverviewStats; error?: string }> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/overview`);
      return await res.json();
    } catch (err) {
      return { success: false, stats: { totalUsers: 0, totalMinutesUsed: 0, totalCreditsGranted: 0, pendingPayments: 0 }, error: String(err) };
    }
  },

  async fetchUsers(): Promise<{ success: boolean; users: UserRecord[]; error?: string }> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/users`);
      return await res.json();
    } catch (err) {
      return { success: false, users: [], error: String(err) };
    }
  },

  async fetchPayments(): Promise<{ success: boolean; payments: PaymentRecord[]; error?: string }> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/payments`);
      return await res.json();
    } catch (err) {
      return { success: false, payments: [], error: String(err) };
    }
  },

  async fetchLicenses(): Promise<{ success: boolean; licenses: LicenseRecord[]; error?: string }> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/licenses`);
      return await res.json();
    } catch (err) {
      return { success: false, licenses: [], error: String(err) };
    }
  },

  async addCredits(email: string, credits: number, note?: string): Promise<{ success: boolean; error?: string }> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/credits/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, credits, note }),
      });
      return await res.json();
    } catch (err) {
      return { success: false, error: String(err) };
    }
  },

  async approvePayment(paymentId: string, credits: number, generateLicense: boolean): Promise<{ success: boolean; licenseKey?: string; error?: string }> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/payments/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentId, credits, generateLicense }),
      });
      return await res.json();
    } catch (err) {
      return { success: false, error: String(err) };
    }
  },

  async rejectPayment(paymentId: string, reason?: string): Promise<{ success: boolean; error?: string }> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/payments/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentId, reason }),
      });
      return await res.json();
    } catch (err) {
      return { success: false, error: String(err) };
    }
  },

  async generateLicense(email: string, plan: string, credits?: number): Promise<{ success: boolean; licenseKey?: string; error?: string }> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/licenses/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, plan, credits }),
      });
      return await res.json();
    } catch (err) {
      return { success: false, error: String(err) };
    }
  }
};
