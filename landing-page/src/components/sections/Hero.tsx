import React from 'react';
import { Download, Sparkles } from 'lucide-react';
import { DOWNLOAD_URLS } from '../../constants';

export const Hero: React.FC = () => {
  return (
    <section className="hero-section">
      <div className="hero-container">
        <div className="hero-badge">
          <Sparkles size={14} />
          <span>MeetFloo AI Co-Pilot v2.9.2</span>
        </div>

        <h1 className="hero-title">
          Your Invisible <span className="text-gradient">AI Co-Pilot</span> for Every Meeting & Interview
        </h1>

        <p className="hero-subtitle">
          Real-time speech-to-text transcription, context-aware AI answers, automatic meeting notes, and stealth overlay modes designed to help you ace your calls.
        </p>

        <div className="hero-actions">
          <a href={DOWNLOAD_URLS.WINDOWS} className="btn-hero-primary">
            <Download size={18} />
            <span>Download for Windows</span>
          </a>
          <a href="#features" className="btn-hero-secondary">
            <span>Explore Features</span>
          </a>
        </div>

        <div className="hero-preview-wrapper">
          <div className="hero-preview-card">
            <div className="preview-header">
              <div className="preview-dots">
                <span className="dot red"></span>
                <span className="dot yellow"></span>
                <span className="dot green"></span>
              </div>
              <span className="preview-title">MeetFloo Desktop Assistant</span>
            </div>
            <div className="preview-body">
              <div className="mock-chat">
                <div className="chat-bubble user">
                  <strong>Interviewer:</strong> Can you explain how you handle database locks in high-throughput applications?
                </div>
                <div className="chat-bubble ai">
                  <div className="ai-tag"><Sparkles size={12} /> AI Answer (Instant)</div>
                  <p>In high-throughput environments, I prefer optimistic locking with version columns for low contention. For heavy writes, row-level pessimistic locks (`SELECT ... FOR UPDATE`) prevent race conditions...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
