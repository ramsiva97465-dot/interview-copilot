import React from 'react';
import { Download, Monitor, ShieldCheck } from 'lucide-react';
import { DOWNLOAD_URLS } from '../../../../shared/constants';

export const DownloadSection: React.FC = () => {
  return (
    <section id="download" className="download-section">
      <div className="download-card">
        <div className="download-content">
          <h2>Ready to Supercharge Your Next Meeting?</h2>
          <p>Download MeetFloo AI Assistant for Windows today and experience real-time co-pilot intelligence.</p>

          <div className="download-buttons">
            <a href={DOWNLOAD_URLS.WINDOWS} className="btn-hero-primary">
              <Download size={20} />
              <span>Download MeetFloo for Windows (.exe)</span>
            </a>
          </div>

          <div className="system-requirements">
            <div className="req-item">
              <Monitor size={16} />
              <span>Windows 10 / 11 (64-bit)</span>
            </div>
            <div className="req-item">
              <ShieldCheck size={16} />
              <span>VirusTotal Clean & Signed Package</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
