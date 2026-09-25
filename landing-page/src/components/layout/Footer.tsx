import React from 'react';
import { Bot } from 'lucide-react';

interface FooterProps {
  currentView?: 'home' | 'events';
  onNavigate?: (view: 'home' | 'events', hash?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <div className="flex-center gap-2 mb-2">
            <Bot size={20} className="text-primary" />
            <span className="font-bold">MeetFloo</span>
          </div>
          <p className="text-muted text-sm">
            AI-powered real-time meeting co-pilot & instant answer assistant.
          </p>
        </div>

        <div className="footer-links">
          <div className="link-col">
            <h4>Product</h4>
            <a
              href="#features"
              onClick={(e) => {
                if (onNavigate) {
                  e.preventDefault();
                  onNavigate('home', '#features');
                }
              }}
            >
              Features
            </a>
            <a
              href="#events"
              onClick={(e) => {
                if (onNavigate) {
                  e.preventDefault();
                  onNavigate('events');
                }
              }}
            >
              Events & Hackathons
            </a>
            <a
              href="#pricing"
              onClick={(e) => {
                if (onNavigate) {
                  e.preventDefault();
                  onNavigate('home', '#pricing');
                }
              }}
            >
              Pricing
            </a>
            <a href="#download">Download</a>
          </div>
          <div className="link-col">
            <h4>Resources</h4>
            <a href="#">Documentation</a>
            <a href="#">Changelog</a>
            <a href="#">Privacy Policy</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2024 Meetfloo-AI. All rights reserved.</p>
      </div>
    </footer>
  );
};
