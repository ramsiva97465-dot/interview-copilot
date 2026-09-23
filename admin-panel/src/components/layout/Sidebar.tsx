import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, CreditCard, Key, Shield } from 'lucide-react';

export const Sidebar: React.FC = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-logo">
          <Shield size={22} />
        </div>
        <div className="brand-text">
          <span className="brand-title">MeetFloo</span>
          <span className="brand-subtitle">Admin Control Panel</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <NavLink
          to="/"
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          end
        >
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/users"
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <Users size={18} />
          <span>Users & Credits</span>
        </NavLink>

        <NavLink
          to="/payments"
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <CreditCard size={18} />
          <span>Payments</span>
        </NavLink>

        <NavLink
          to="/licenses"
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <Key size={18} />
          <span>Licenses</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <span className="version-badge">v2.9.2 Admin</span>
      </div>
    </aside>
  );
};
