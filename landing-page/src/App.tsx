import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Hero } from './components/sections/Hero';
import { Features } from './components/sections/Features';
import { Events } from './components/sections/Events';
import { Pricing } from './components/sections/Pricing';
import { DownloadSection } from './components/sections/DownloadSection';
import { Footer } from './components/layout/Footer';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'home' | 'events'>('home');

  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash === '#events') {
        setCurrentView('events');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setCurrentView('home');
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const navigateTo = (view: 'home' | 'events', hash?: string) => {
    setCurrentView(view);
    if (view === 'events') {
      window.location.hash = '#events';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      if (hash) {
        window.location.hash = hash;
        setTimeout(() => {
          const el = document.querySelector(hash);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }, 50);
      } else {
        if (window.location.hash) {
          history.pushState(null, '', window.location.pathname);
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="landing-app">
      <Navbar currentView={currentView} onNavigate={navigateTo} />
      <main>
        {currentView === 'home' ? (
          <>
            <Hero />
            <Features />
            <Pricing />
            <DownloadSection />
          </>
        ) : (
          <Events onBack={() => navigateTo('home')} />
        )}
      </main>
      <Footer currentView={currentView} onNavigate={navigateTo} />
    </div>
  );
};

export default App;
