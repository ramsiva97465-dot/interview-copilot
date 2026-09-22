// Service for tracking, updating and synchronizing user meeting credits & usage
// between the desktop app, overlay, and meetfloo.com backend

export interface UserAccountData {
  id: string;
  email: string;
  name?: string;
  minutes_used: number;
  credits: number;
  plan: string;
}

export function getBaseApiUrl(): string {
  const envUrl = (import.meta as any).env?.VITE_APP_API_URL;
  if (envUrl) {
    return envUrl.replace(/\/+$/, '');
  }
  if (typeof window !== 'undefined' && window.location?.origin && !window.location.origin.includes('file://')) {
    return window.location.origin.replace(/\/+$/, '');
  }
  return 'https://www.meetfloo.com';
}

export function getStoredUserEmail(): string | null {
  if (typeof localStorage === 'undefined') return null;
  return localStorage.getItem('meetfloo_user_email');
}

export function getStoredUserCredits(): number {
  if (typeof localStorage === 'undefined') return 0;
  return parseInt(localStorage.getItem('meetfloo_user_credits') || '0', 10);
}

export function setStoredUserData(user: Partial<UserAccountData>): void {
  if (typeof localStorage === 'undefined') return;
  if (user.credits !== undefined) {
    localStorage.setItem('meetfloo_user_credits', String(user.credits));
  }
  if (user.minutes_used !== undefined) {
    localStorage.setItem('meetfloo_user_minutes_used', String(user.minutes_used));
  }
  if (user.plan !== undefined) {
    localStorage.setItem('meetfloo_user_plan', user.plan);
  }
  if (user.name) {
    localStorage.setItem('meetfloo_user_name', user.name);
  }

  // Dispatch custom DOM event across window components
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('meetfloo_user_credits_updated', { detail: user }));
  }
}

export async function fetchUserProfile(email?: string | null): Promise<UserAccountData | null> {
  const targetEmail = (email || getStoredUserEmail())?.trim();
  if (!targetEmail || !targetEmail.includes('@')) {
    return null;
  }

  try {
    const baseUrl = getBaseApiUrl();
    const res = await fetch(`${baseUrl}/api/user/profile?email=${encodeURIComponent(targetEmail)}&_t=${Date.now()}`, {
      cache: 'no-store',
      headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate' }
    });
    const data = await res.json();
    if (data.success && data.user) {
      setStoredUserData(data.user);
      return data.user as UserAccountData;
    }
  } catch (err) {
    console.warn('[userUsageService] fetchUserProfile failed:', err);
  }
  return null;
}

export async function recordMeetingUsage(minutesUsed: number, email?: string | null): Promise<UserAccountData | null> {
  const targetEmail = (email || getStoredUserEmail())?.trim();
  if (!targetEmail || !targetEmail.includes('@')) {
    return null;
  }

  try {
    const baseUrl = getBaseApiUrl();
    const res = await fetch(`${baseUrl}/api/user/record-usage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: targetEmail, minutesUsed: Math.max(1, minutesUsed) }),
    });
    const data = await res.json();
    if (data.success && data.user) {
      setStoredUserData(data.user);
      return data.user as UserAccountData;
    }
  } catch (err) {
    console.warn('[userUsageService] recordMeetingUsage failed:', err);
  }
  return null;
}
