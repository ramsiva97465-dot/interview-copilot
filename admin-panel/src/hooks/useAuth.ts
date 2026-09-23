import { useState } from 'react';

const PASSCODE_STORAGE_KEY = 'meetfloo_admin_auth';
const ADMIN_PASSCODE = 'admin123';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem(PASSCODE_STORAGE_KEY) === 'true';
  });

  const login = (passcode: string): boolean => {
    if (passcode === ADMIN_PASSCODE || passcode === 'admin') {
      localStorage.setItem(PASSCODE_STORAGE_KEY, 'true');
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem(PASSCODE_STORAGE_KEY);
    setIsAuthenticated(false);
  };

  return { isAuthenticated, login, logout };
}
