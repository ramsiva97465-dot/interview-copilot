import React, { useState } from 'react';
import { Lock, ShieldCheck, AlertCircle } from 'lucide-react';

interface LoginPageProps {
  onLogin: (passcode: string) => boolean;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = onLogin(passcode);
    if (!success) {
      setError(true);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-icon-badge">
            <ShieldCheck size={32} />
          </div>
          <h1>MeetFloo Admin</h1>
          <p>Enter administrative passcode to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <Lock className="input-icon" size={18} />
            <input
              type="password"
              placeholder="Passcode"
              value={passcode}
              onChange={(e) => {
                setPasscode(e.target.value);
                setError(false);
              }}
              autoFocus
            />
          </div>

          {error && (
            <div className="error-banner">
              <AlertCircle size={16} />
              <span>Invalid passcode. Please try again.</span>
            </div>
          )}

          <button type="submit" className="btn-primary login-btn">
            Unlock Dashboard
          </button>
        </form>
      </div>
    </div>
  );
};
