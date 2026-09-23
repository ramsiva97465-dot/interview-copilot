import React from 'react';
import { Bot, Download } from 'lucide-react';

export const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-brand">
          <div className="nav-logo">
            <Bot size={24} />
          </div>
          <span className="brand-name">MeetFloo</span>
        </div>

        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#pricing">Pricing</a>
          <a href="#download" className="nav-btn-download">
            <Download size={16} />
            <span>Download</span>
          </a>
        </div>
      </div>
    </nav>
  );
};
