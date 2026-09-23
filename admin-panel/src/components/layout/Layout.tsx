import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="admin-app">
      <Sidebar />
      <div className="main-wrapper">
        <Header />
        <main className="content-container">{children}</main>
      </div>
    </div>
  );
};
