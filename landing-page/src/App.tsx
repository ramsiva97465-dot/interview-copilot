import React from 'react';
import { Navbar } from './components/layout/Navbar';
import { Hero } from './components/sections/Hero';
import { Features } from './components/sections/Features';
import { Pricing } from './components/sections/Pricing';
import { DownloadSection } from './components/sections/DownloadSection';
import { Footer } from './components/layout/Footer';

const App: React.FC = () => {
  return (
    <div className="landing-app">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Pricing />
        <DownloadSection />
      </main>
      <Footer />
    </div>
  );
};

export default App;
