import React from 'react';
import { Check } from 'lucide-react';
import { DOWNLOAD_URLS } from '../../../../shared/constants';

export const Pricing: React.FC = () => {
  const plans = [
    {
      name: 'Starter',
      price: 'Free',
      period: 'forever',
      description: 'Perfect for trying out basic meeting transcription and local assistant capabilities.',
      features: [
        'Local Whisper STT Model',
        'Basic Meeting Summaries',
        'Standard Floating Overlay',
        'Community Support'
      ],
      cta: 'Get Started Free',
      highlighted: false
    },
    {
      name: 'Pro Co-Pilot',
      price: '$19',
      period: 'per month',
      description: 'Full power for active job seekers, engineers, and professionals in daily meetings.',
      features: [
        'Real-time Cloud & Local STT',
        'Unlimited AI Answer Generation',
        'DeepSeek R1 + Claude 3.5 Models',
        'Stealth Mode (Screen Share Proof)',
        'Coding & Algorithm Solver',
        'Priority Email & Discord Support'
      ],
      cta: 'Start Pro Trial',
      highlighted: true
    },
    {
      name: 'Team / Enterprise',
      price: 'Custom',
      period: 'contact sales',
      description: 'Dedicated deployments, shared knowledge bases, and custom API integration.',
      features: [
        'All Pro Features Included',
        'Custom Knowledge Base RAG',
        'Dedicated API Infrastructure',
        'Admin Console & License Keys',
        'SLA & Custom Contracts'
      ],
      cta: 'Contact Sales',
      highlighted: false
    }
  ];

  return (
    <section id="pricing" className="pricing-section">
      <div className="section-header">
        <h2>Simple, Transparent Pricing</h2>
        <p>Choose the plan that fits your meeting frequency and performance needs.</p>
      </div>

      <div className="pricing-grid">
        {plans.map((p, i) => (
          <div key={i} className={`pricing-card ${p.highlighted ? 'highlighted' : ''}`}>
            {p.highlighted && <div className="badge-popular">Most Popular</div>}
            <h3>{p.name}</h3>
            <div className="price-tag">
              <span className="price">{p.price}</span>
              <span className="period">{p.period}</span>
            </div>
            <p className="plan-desc">{p.description}</p>
            <ul className="plan-features">
              {p.features.map((feat, idx) => (
                <li key={idx}>
                  <Check size={16} className="check-icon" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
            <a href={DOWNLOAD_URLS.WINDOWS} className={`btn-plan ${p.highlighted ? 'btn-primary' : 'btn-secondary'}`}>
              {p.cta}
            </a>
          </div>
        ))}
      </div>
    </section>
  );
};
