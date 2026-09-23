/**
 * Shared constants used across Meeting-bot applications.
 */

// ─── API Configuration ──────────────────────────────────────────────────────

/** Default API base URL for the MeetFloo backend server */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

// ─── Plan Names ──────────────────────────────────────────────────────────────

export const PLAN_NAMES = {
  FREE: 'free',
  PRO: 'pro',
  ENTERPRISE: 'enterprise',
} as const;

export const PLAN_LABELS: Record<string, string> = {
  free: 'Free',
  pro: 'Pro',
  enterprise: 'Enterprise',
};

// ─── Payment Statuses ────────────────────────────────────────────────────────

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
} as const;

export const PAYMENT_STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  approved: 'Approved',
  rejected: 'Rejected',
};

// ─── User Statuses ───────────────────────────────────────────────────────────

export const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
} as const;

// ─── App Metadata ────────────────────────────────────────────────────────────

export const APP_NAME = 'MeetFloo';
export const APP_DESCRIPTION = 'AI Meeting Co-Pilot';
export const APP_VERSION = '2.9.2';

// ─── Download URLs ───────────────────────────────────────────────────────────

export const DOWNLOAD_URLS = {
  WINDOWS: 'https://github.com/ramsiva97465-dot/interview-copilot/releases/download/v2.9.2/MeetFloo-Setup-2.9.2.exe',
  MAC_ARM: '',    // TODO: Add Mac ARM download URL
  MAC_INTEL: '',  // TODO: Add Mac Intel download URL
  LINUX: '',      // TODO: Add Linux download URL
} as const;
