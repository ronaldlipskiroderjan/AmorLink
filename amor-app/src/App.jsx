import React, { useState, useEffect } from 'react';
import './index.css';
import { getCoupleInfo } from './api';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Header from './components/Header';
import LoveCounter from './components/LoveCounter';
import Timeline from './components/Timeline';
import LoveJar from './components/LoveJar';
import Coupons from './components/Coupons';
import Texts from './components/Texts';
import Login from './components/Login';

const SECTIONS = [
  { id: 'counter',  icon: '⏱',  label: 'Contador' },
  { id: 'jar',      icon: '💙',  label: 'Potinho'  },
  { id: 'timeline', icon: '📅', label: 'Timeline'  },
  { id: 'coupons',  icon: '🎁',  label: 'Cupons'   },
  { id: 'textos',   icon: '📝',  label: 'Textos'   },
];

function AppContent() {
  const { isAuthenticated, logout, username, isAdmin } = useAuth();
  const [coupleInfo, setCoupleInfo] = useState({ startDate: null, names: '' });
  const [activeSection, setActiveSection] = useState('counter');

  useEffect(() => {
    if (!isAuthenticated) return;
    getCoupleInfo()
      .then(data => setCoupleInfo({ startDate: data.startDate, names: data.names }))
      .catch(() => {
        setCoupleInfo({ startDate: '2025-02-15', names: 'Você & Eu' });
      });
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <div style={{ minHeight: '100dvh', position: 'relative' }}>

      {/* Header com botão de logout */}
      <Header coupleNames={coupleInfo.names} />

      {/* Badge do usuário + Logout */}
      <div style={{
        position: 'fixed', top: '12px', right: '16px', zIndex: 200,
        display: 'flex', alignItems: 'center', gap: '8px',
      }}>
        <span style={{
          fontSize: '11px', color: 'rgba(148,163,184,0.7)',
          background: 'rgba(13,26,53,0.8)', padding: '4px 10px',
          borderRadius: '20px', border: '1px solid rgba(59,130,246,0.15)',
        }}>
          {isAdmin ? '👑' : '💙'} {username}
        </span>
        <button
          onClick={logout}
          title="Sair"
          style={{
            background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
            color: 'rgba(252,165,165,0.8)', borderRadius: '20px', padding: '4px 12px',
            fontSize: '11px', cursor: 'pointer', fontFamily: "'Inter', sans-serif",
          }}
        >
          Sair
        </button>
      </div>

      {/* Conteúdo */}
      <main style={{ paddingBottom: 'calc(68px + env(safe-area-inset-bottom) + 12px)' }}>
        {activeSection === 'counter'  && <LoveCounter startDate={coupleInfo.startDate} />}
        {activeSection === 'jar'      && <LoveJar />}
        {activeSection === 'timeline' && <Timeline />}
        {activeSection === 'coupons'  && <Coupons />}
        {activeSection === 'textos'   && <Texts />}
      </main>

      {/* Bottom Tab Bar */}
      <nav className="tab-bar">
        {SECTIONS.map(s => (
          <button
            key={s.id}
            id={`tab-${s.id}`}
            className={`tab-item${activeSection === s.id ? ' active' : ''}`}
            onClick={() => setActiveSection(s.id)}
            aria-label={s.label}
          >
            <span className="tab-icon">{s.icon}</span>
            <span className="tab-label">{s.label}</span>
          </button>
        ))}
      </nav>

      <footer style={{ textAlign: 'center', padding: '24px 20px 8px', borderTop: '1px solid rgba(59,130,246,0.08)' }}>
        <p style={{ color: 'rgba(96,165,250,0.3)', fontSize: '12px', fontFamily: "'Inter', sans-serif" }}>
          Feito com 💙 para você, meu amor.
        </p>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
