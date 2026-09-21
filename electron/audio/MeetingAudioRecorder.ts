import * as fs from 'fs';
import * as path from 'path';
import { app } from 'electron';

export class MeetingAudioRecorder {
  private static instance: MeetingAudioRecorder | null = null;
  private writeStream: fs.WriteStream | null = null;
  private currentFilePath: string | null = null;
  private totalBytesWritten: number = 0;
  private sampleRate: number = 16000;
  private isRecording: boolean = false;

  public static getInstance(): MeetingAudioRecorder {
    if (!MeetingAudioRecorder.instance) {
      MeetingAudioRecorder.instance = new MeetingAudioRecorder();
    }
    return MeetingAudioRecorder.instance;
  }

  /**
   * Starts recording meeting audio to a .wav file in the app recordings folder.
   */
  public start(meetingId: string = 'meeting', sampleRate: number = 16000): string {
    try {
      this.sampleRate = sampleRate;
      this.totalBytesWritten = 0;

      // Ensure recordings directory exists in userData
      const userDataPath = app?.getPath ? app.getPath('userData') : process.cwd();
      const recordingsDir = path.join(userDataPath, 'recordings');
      if (!fs.existsSync(recordingsDir)) {
        fs.mkdirSync(recordingsDir, { recursive: true });
      }

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const safeId = String(meetingId).replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 10);
      const filename = `MeetFloo_Recording_${timestamp}_${safeId || 'meeting'}.wav`;
      this.currentFilePath = path.join(recordingsDir, filename);

      this.writeStream = fs.createWriteStream(this.currentFilePath);

      // Standard 44-byte RIFF WAV header (placeholder lengths, updated on stop)
      const header = Buffer.alloc(44);
      header.write('RIFF', 0); // ChunkID
      header.writeUInt32LE(0, 4); // ChunkSize (placeholder)
      header.write('WAVE', 8); // Format
      header.write('fmt ', 12); // Subchunk1ID
      header.writeUInt32LE(16, 16); // Subchunk1Size
      header.writeUInt16LE(1, 20); // AudioFormat (1 = PCM)
      header.writeUInt16LE(1, 22); // NumChannels (1 = Mono)
      header.writeUInt32LE(this.sampleRate, 24); // SampleRate
      header.writeUInt32LE(this.sampleRate * 2, 28); // ByteRate (SampleRate * NumChannels * 2 bytes)
      header.writeUInt16LE(2, 32); // BlockAlign (NumChannels * 2 bytes)
      header.writeUInt16LE(16, 34); // BitsPerSample
      header.write('data', 36); // Subchunk2ID
      header.writeUInt32LE(0, 40); // Subchunk2Size (placeholder)

      this.writeStream.write(header);
      this.isRecording = true;
      console.log(`[MeetingAudioRecorder] Started recording to: ${this.currentFilePath}`);
      return this.currentFilePath;
    } catch (err) {
      console.error('[MeetingAudioRecorder] Failed to start recording:', err);
      this.isRecording = false;
      this.writeStream = null;
      this.currentFilePath = null;
      return '';
    }
  }

  /**
   * Writes a raw 16-bit PCM chunk to the active audio file.
   */
  public writeChunk(chunk: Buffer): void {
    if (!this.isRecording || !this.writeStream || !chunk || chunk.length === 0) return;
    try {
      this.writeStream.write(chunk);
      this.totalBytesWritten += chunk.length;
    } catch (err) {
      console.warn('[MeetingAudioRecorder] Error writing chunk:', err);
    }
  }

  /**
   * Stops recording, updates WAV header with final size, and returns the file path.
   */
  public async stop(): Promise<string | null> {
    if (!this.isRecording && !this.writeStream) return this.currentFilePath;
    this.isRecording = false;
    const filePath = this.currentFilePath;
    const bytesWritten = this.totalBytesWritten;

    return new Promise<string | null>((resolve) => {
      if (!this.writeStream || !filePath) {
        resolve(null);
        return;
      }

      const stream = this.writeStream;
      this.writeStream = null;

      stream.end(() => {
        try {
          if (fs.existsSync(filePath) && bytesWritten > 0) {
            // Open file in read/write mode to fix RIFF and data chunk sizes
            const fd = fs.openSync(filePath, 'r+');
            const sizeBuffer = Buffer.alloc(4);

            // ChunkSize = 36 + Subchunk2Size
            sizeBuffer.writeUInt32LE(bytesWritten + 36, 0);
            fs.writeSync(fd, sizeBuffer, 0, 4, 4);

            // Subchunk2Size = bytesWritten
            sizeBuffer.writeUInt32LE(bytesWritten, 0);
            fs.writeSync(fd, sizeBuffer, 0, 4, 40);

            fs.closeSync(fd);
            console.log(`[MeetingAudioRecorder] Finalized recording (${bytesWritten} bytes): ${filePath}`);
          }
          resolve(filePath);
        } catch (err) {
          console.error('[MeetingAudioRecorder] Failed to update WAV header:', err);
          resolve(filePath);
        }
      });
    });
  }

  public getCurrentRecordingPath(): string | null {
    return this.currentFilePath;
  }

  public getIsRecording(): boolean {
    return this.isRecording;
  }
}
