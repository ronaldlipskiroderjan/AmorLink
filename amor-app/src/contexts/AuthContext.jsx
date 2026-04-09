import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken]     = useState(() => localStorage.getItem('amor_token') || null);
  const [role, setRole]       = useState(() => localStorage.getItem('amor_role') || null);
  const [username, setUsername] = useState(() => localStorage.getItem('amor_username') || null);

  const login = ({ token, role, username }) => {
    localStorage.setItem('amor_token',    token);
    localStorage.setItem('amor_role',     role);
    localStorage.setItem('amor_username', username);
    setToken(token);
    setRole(role);
    setUsername(username);
  };

  const logout = () => {
    localStorage.removeItem('amor_token');
    localStorage.removeItem('amor_role');
    localStorage.removeItem('amor_username');
    setToken(null);
    setRole(null);
    setUsername(null);
  };

  const isAdmin = role === 'ROLE_ADMIN';
  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ token, role, username, isAdmin, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
