import React from 'react';
import { Download, Sparkles, Bot, CheckCircle2 } from 'lucide-react';
import { DOWNLOAD_URLS } from '../../constants';

export const Hero: React.FC = () => {
  return (
    <section className="hero-section">
      <div className="hero-container">
        <div className="hero-badge">
          <Sparkles size={14} />
          <span>Meet ARIA: Your AI Sales Manager</span>
        </div>

        <h1 className="hero-title">
          Empower Your Sales Team in Every Customer Call <br />
          <span className="text-gradient">With ARIA AI Sales Manager</span>
        </h1>

        <p className="hero-subtitle">
          ARIA equips your sales team with live objection battlecards, real-time guidance during customer calls, and automated CRM follow-ups.
        </p>

        <div className="hero-highlights" style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '640px', margin: '0 auto 24px', textAlign: 'left', fontSize: '13px', color: '#cbd5e1' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={16} color="#c084fc" />
            <span><strong>Live In-Call Guidance:</strong> Sub-400ms battlecards for competitor &amp; pricing objections.</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={16} color="#818cf8" />
            <span><strong>Automated CRM Sync:</strong> Auto-logs notes &amp; drafts follow-up emails into your CRM.</span>
          </div>
        </div>

        <div className="hero-actions">
          <a href={DOWNLOAD_URLS.WINDOWS} className="btn-hero-primary">
            <Download size={18} />
            <span>Download for Windows (.exe)</span>
          </a>
          <a href="#features" className="btn-hero-secondary">
            <span>Explore Platform</span>
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
              <span className="preview-title">MeetFloo — ARIA AI Sales Manager</span>
            </div>
            <div className="preview-body">
              <div className="mock-chat">
                <div className="chat-bubble user">
                  <strong>Prospect:</strong> "How does Meetfloo compare against other sales recording and CRM tools?"
                </div>
                <div className="chat-bubble ai">
                  <div className="ai-tag"><Bot size={12} /> ARIA Live Battlecard (Real-Time)</div>
                  <p>Highlight 3x faster deal conversion, sub-400ms real-time conversational guidance, and zero-effort automated CRM sync that fits right into existing workflows...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
