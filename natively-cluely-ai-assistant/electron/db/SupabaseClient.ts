import { createClient, SupabaseClient } from '@supabase/supabase-js';

export class SupabaseManager {
  private static instance: SupabaseManager;
  private client: SupabaseClient | null = null;
  private isConnected: boolean = false;

  private constructor() {
    this.initClient();
  }

  public static getInstance(): SupabaseManager {
    if (!SupabaseManager.instance) {
      SupabaseManager.instance = new SupabaseManager();
    }
    return SupabaseManager.instance;
  }

  public initClient(url?: string, anonKey?: string): boolean {
    const supabaseUrl = url || process.env.SUPABASE_URL;
    const supabaseKey = anonKey || process.env.SUPABASE_ANON_KEY;

    if (
      supabaseUrl &&
      supabaseKey &&
      supabaseUrl !== 'https://your-project.supabase.co' &&
      supabaseKey !== 'your_supabase_anon_key_here'
    ) {
      try {
        this.client = createClient(supabaseUrl, supabaseKey);
        this.isConnected = true;
        console.log('[SupabaseManager] Connected to Supabase Cloud Database:', supabaseUrl);
        return true;
      } catch (err) {
        console.error('[SupabaseManager] Failed to initialize Supabase client:', err);
        this.client = null;
        this.isConnected = false;
        return false;
      }
    }

    this.client = null;
    this.isConnected = false;
    return false;
  }

  public isConfigured(): boolean {
    return this.isConnected && this.client !== null;
  }

  public getClient(): SupabaseClient | null {
    return this.client;
  }

  // Cloud Sync Helpers
  public async syncMeeting(meeting: {
    id?: string;
    title: string;
    mode?: string;
    durationSeconds?: number;
  }) {
    if (!this.client) return null;
    try {
      const { data, error } = await this.client
        .from('meetings')
        .upsert({
          id: meeting.id,
          title: meeting.title,
          mode: meeting.mode || 'general',
          duration_seconds: meeting.durationSeconds || 0,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('[SupabaseManager] Error syncing meeting:', err);
      return null;
    }
  }

  public async syncTranscript(transcript: {
    meetingId: string;
    speaker: string;
    text: string;
    timestampMs?: number;
  }) {
    if (!this.client) return null;
    try {
      const { data, error } = await this.client
        .from('transcripts')
        .insert({
          meeting_id: transcript.meetingId,
          speaker: transcript.speaker,
          text: transcript.text,
          timestamp_ms: transcript.timestampMs || 0,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('[SupabaseManager] Error syncing transcript:', err);
      return null;
    }
  }

  public async syncNotes(notes: {
    meetingId: string;
    summary: string;
    actionItems?: any[];
    keyDecisions?: any[];
    rawAiResponse?: string;
  }) {
    if (!this.client) return null;
    try {
      const { data, error } = await this.client
        .from('meeting_notes')
        .upsert({
          meeting_id: notes.meetingId,
          summary: notes.summary,
          action_items: notes.actionItems || [],
          key_decisions: notes.keyDecisions || [],
          raw_ai_response: notes.rawAiResponse || '',
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('[SupabaseManager] Error syncing meeting notes:', err);
      return null;
    }
  }
}
