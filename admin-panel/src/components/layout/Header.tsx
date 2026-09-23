import React from 'react';
import { LogOut, User } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const Header: React.FC = () => { 
  const { logout } = useAuth();

  return (
    <header className="header">
      <div className="header-left">
        <h2 className="header-title">Management Console</h2>
      </div>

      <div className="header-right">
        <div className="admin-profile">
          <div className="avatar">
            <User size={16} />
          </div>
          <span className="admin-name">Administrator</span>
        </div>

        <button onClick={logout} className="btn-icon" title="Logout">
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
};
