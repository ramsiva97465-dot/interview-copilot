import React from 'react';
import { Bot, Download } from 'lucide-react';

interface NavbarProps {
  currentView?: 'home' | 'events';
  onNavigate?: (view: 'home' | 'events', hash?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView = 'home', onNavigate }) => {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <div
          className="nav-brand"
          style={{ cursor: 'pointer' }}
          onClick={() => onNavigate ? onNavigate('home') : window.location.hash = ''}
        >
          <div className="nav-logo">
            <Bot size={24} />
          </div>
          <span className="brand-name">MeetFloo</span>
        </div>

        <div className="nav-links">
          <button
            type="button"
            className="nav-link-btn"
            style={{ background: 'none', border: 'none', color: 'inherit', font: 'inherit', cursor: 'pointer' }}
            onClick={() => onNavigate ? onNavigate('home', '#features') : window.location.hash = '#features'}
          >
            Features
          </button>
          <button
            type="button"
            className={`nav-link-btn ${currentView === 'events' ? 'active' : ''}`}
            style={{
              background: currentView === 'events' ? 'rgba(124, 58, 237, 0.2)' : 'none',
              border: currentView === 'events' ? '1px solid rgba(124, 58, 237, 0.4)' : 'none',
              borderRadius: '999px',
              padding: '4px 12px',
              color: currentView === 'events' ? '#c084fc' : 'inherit',
              font: 'inherit',
              cursor: 'pointer'
            }}
            onClick={() => onNavigate ? onNavigate('events') : window.location.hash = '#events'}
          >
            Events
          </button>
          <button
            type="button"
            className="nav-link-btn"
            style={{ background: 'none', border: 'none', color: 'inherit', font: 'inherit', cursor: 'pointer' }}
            onClick={() => onNavigate ? onNavigate('home', '#pricing') : window.location.hash = '#pricing'}
          >
            Pricing
          </button>
          <a href="#download" className="nav-btn-download">
            <Download size={16} />
            <span>Download</span>
          </a>
        </div>
      </div>
    </nav>
  );
};
