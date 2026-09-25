import React from 'react';
import { Headphones, EyeOff, Cpu, Zap, Bot, Shield } from 'lucide-react';

export const Features: React.FC = () => {
  const featureList = [
    {
      icon: Bot,
      title: 'ARIA: Your AI Sales Manager',
      description: 'Works alongside reps before, during, and after every meeting to prepare context, guide live conversations, and handle follow-ups.'
    },
    {
      icon: Zap,
      title: 'Real-Time Objection Handling',
      description: 'Streams winning battlecards in under 400ms when buyers ask about pricing, competitor comparisons, or contract terms.'
    },
    {
      icon: Cpu,
      title: 'Continuous Team Learning',
      description: 'Analyzes winning conversations across your sales org so every rep adopts what drives closed-won deals.'
    },
    {
      icon: EyeOff,
      title: '100% Invisible Stealth Overlay',
      description: 'Transparent desktop HUD that stays on your screen, completely hidden from Zoom, Google Meet, Teams, or client screen shares.'
    },
    {
      icon: Headphones,
      title: 'Direct System Audio STT',
      description: 'Ultra-crisp voice transcription capturing prospect speech directly via internal audio loopback with zero microphone lag.'
    },
    {
      icon: Shield,
      title: 'CRM & Enterprise Privacy',
      description: 'Bi-directional sync with Salesforce and HubSpot. End-to-end encryption ensures zero private customer conversation leakage.'
    }
  ];

  return (
    <section id="features" className="features-section">
      <div className="section-header">
        <h2>Built for High-Growth Sales Teams</h2>
        <p>Everything your revenue team needs to close deals faster and eliminate manual administrative overhead.</p>
      </div>

      <div className="features-grid">
        {featureList.map((f, i) => (
          <div key={i} className="feature-card">
            <div className="feature-icon">
              <f.icon size={24} />
            </div>
            <h3>{f.title}</h3>
            <p>{f.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
