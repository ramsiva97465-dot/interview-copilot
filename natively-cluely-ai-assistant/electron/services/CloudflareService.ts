// electron/services/CloudflareService.ts
// Client service to synchronize meetings and profile documents with Cloudflare D1 backend

export interface CloudflareMeetingPayload {
  id: string;
  userId?: string;
  title: string;
  notes?: string;
  summary?: string;
  duration?: number;
}

export interface CloudflareProfilePayload {
  id: string;
  userId?: string;
  docType: string;
  rawText?: string;
  structuredData?: any;
}

export interface CloudflareTranscriptPayload {
  meetingId: string;
  speaker: string;
  content: string;
  timestampMs?: number;
}

export interface CloudflareAIInteractionPayload {
  meetingId?: string;
  userId?: string;
  type?: string;
  userQuery?: string;
  aiResponse?: string;
  metadata?: any;
}

export class CloudflareService {
  private static instance: CloudflareService | null = null;
  private endpoint: string;

  constructor() {
    this.endpoint = (process.env.CLOUDFLARE_BACKEND_URL || 'https://cloudflare-backend.ramsiva97465.workers.dev').replace(/\/+$/, '');
  }

  public static getInstance(): CloudflareService {
    if (!CloudflareService.instance) {
      CloudflareService.instance = new CloudflareService();
    }
    return CloudflareService.instance;
  }

  public setEndpoint(url: string): void {
    this.endpoint = url.replace(/\/+$/, '');
  }

  public getEndpoint(): string {
    return this.endpoint;
  }

  /**
   * Test connection to Cloudflare Worker & D1 database
   */
  public async testConnection(): Promise<{ success: boolean; latencyMs?: number; error?: string }> {
    const t0 = Date.now();
    try {
      const resp = await fetch(`${this.endpoint}/api/meetings`);
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      return { success: true, latencyMs: Date.now() - t0 };
    } catch (err: any) {
      return { success: false, error: err?.message || String(err) };
    }
  }

  /**
   * Sync a meeting record to Cloudflare D1
   */
  public async syncMeeting(meeting: CloudflareMeetingPayload): Promise<boolean> {
    try {
      const resp = await fetch(`${this.endpoint}/api/meetings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(meeting),
      });
      const data = (await resp.json()) as any;
      return !!data?.success;
    } catch (err) {
      console.warn('[CloudflareService] syncMeeting failed:', err);
      return false;
    }
  }

  /**
   * Fetch meetings from Cloudflare D1
   */
  public async fetchMeetings(userId: string = 'local'): Promise<any[]> {
    try {
      const resp = await fetch(`${this.endpoint}/api/meetings?userId=${encodeURIComponent(userId)}`);
      const data = (await resp.json()) as any;
      return data?.meetings || [];
    } catch (err) {
      console.warn('[CloudflareService] fetchMeetings failed:', err);
      return [];
    }
  }

  /**
   * Sync a live transcript line to Cloudflare D1
   */
  public async syncTranscript(transcript: CloudflareTranscriptPayload): Promise<boolean> {
    try {
      const resp = await fetch(`${this.endpoint}/api/transcripts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transcript),
      });
      const data = (await resp.json()) as any;
      return !!data?.success;
    } catch (err) {
      console.warn('[CloudflareService] syncTranscript failed:', err);
      return false;
    }
  }

  /**
   * Sync an AI interaction (turn / response) to Cloudflare D1
   */
  public async syncAIInteraction(interaction: CloudflareAIInteractionPayload): Promise<boolean> {
    try {
      const resp = await fetch(`${this.endpoint}/api/ai-interactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(interaction),
      });
      const data = (await resp.json()) as any;
      return !!data?.success;
    } catch (err) {
      console.warn('[CloudflareService] syncAIInteraction failed:', err);
      return false;
    }
  }

  /**
   * Sync a profile document (e.g. resume / JD) to Cloudflare D1
   */
  public async syncProfileDocument(doc: CloudflareProfilePayload): Promise<boolean> {
    try {
      const resp = await fetch(`${this.endpoint}/api/profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(doc),
      });
      const data = (await resp.json()) as any;
      return !!data?.success;
    } catch (err) {
      console.warn('[CloudflareService] syncProfileDocument failed:', err);
      return false;
    }
  }

  /**
   * Fetch a profile document from Cloudflare D1
   */
  public async fetchProfileDocument(docType: string, userId: string = 'local'): Promise<any | null> {
    try {
      const resp = await fetch(`${this.endpoint}/api/profile/${encodeURIComponent(docType)}?userId=${encodeURIComponent(userId)}`);
      const data = (await resp.json()) as any;
      return data?.document || null;
    } catch (err) {
      console.warn('[CloudflareService] fetchProfileDocument failed:', err);
      return null;
    }
  }
}

