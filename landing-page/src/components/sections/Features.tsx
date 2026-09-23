import React from 'react';
import { Headphones, EyeOff, Cpu, Zap, Code, Shield } from 'lucide-react';

export const Features: React.FC = () => {
  const featureList = [
    {
      icon: Headphones,
      title: 'Real-Time Audio STT',
      description: 'Ultra-low latency speech transcription using local Whisper models and high-precision cloud fallback engines.'
    },
    {
      icon: EyeOff,
      title: 'Stealth Overlay Window',
      description: 'Stays completely invisible to screen sharing during Zoom, Teams, Google Meet, and coding assessments.'
    },
    {
      icon: Cpu,
      title: 'Multi-LLM Intelligence',
      description: 'Switch seamlessly between DeepSeek R1, Claude 3.5 Sonnet, GPT-4o, and local ONNX models for rapid answers.'
    },
    {
      icon: Zap,
      title: 'Automated Meeting Summaries',
      description: 'Generates structured meeting notes, action items, key decisions, and follow-up email drafts instantly.'
    },
    {
      icon: Code,
      title: 'Coding Task Assistant',
      description: 'Understands screen context, extracts code problems, and provides step-by-step algorithms and solutions.'
    },
    {
      icon: Shield,
      title: 'Privacy-First Architecture',
      description: 'Your meeting data remains local and encrypted. No training on your private conversation data.'
    }
  ];

  return (
    <section id="features" className="features-section">
      <div className="section-header">
        <h2>Engineered for High-Stakes Meetings</h2>
        <p>Everything you need to perform with confidence during interviews, sales calls, and technical meetings.</p>
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
