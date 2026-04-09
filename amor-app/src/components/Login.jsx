import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { loginUser } from '../api';

export default function Login() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await loginUser({ username, password });
      login(data);
    } catch {
      setError('Usuário ou senha incorretos. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100dvh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(ellipse at 50% 0%, rgba(29,78,216,0.25) 0%, #080f1e 65%)',
      padding: '20px',
      fontFamily: "'Inter', sans-serif",
    }}>
      <div style={{
        width: '100%',
        maxWidth: '380px',
        animation: 'fadeIn 0.6s ease-out',
      }}>
        {/* Logo / Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ fontSize: '52px', marginBottom: '16px' }}>💙</div>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '28px',
            color: '#f8fafc',
            fontWeight: '700',
            marginBottom: '8px',
          }}>
            Nosso Espaço
          </h1>
          <p style={{ color: 'rgba(148,163,184,0.8)', fontSize: '14px' }}>
            Entre para abrir o nosso cantinho especial
          </p>
        </div>

        {/* Card de Login */}
        <div style={{
          background: 'rgba(13,26,53,0.8)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(59,130,246,0.2)',
          borderRadius: '24px',
          padding: '32px 28px',
          boxShadow: '0 8px 48px rgba(0,0,0,0.4), 0 0 0 1px rgba(59,130,246,0.08)',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Linha topo decorativa */}
          <div style={{
            position: 'absolute', top: 0, left: '20%', right: '20%', height: '1px',
            background: 'linear-gradient(to right, transparent, rgba(59,130,246,0.5), transparent)',
          }} />

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1', fontSize: '13px', fontWeight: '600', letterSpacing: '0.05em' }}>
                USUÁRIO
              </label>
              <input
                type="text"
                id="login-username"
                required
                autoComplete="username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="seu usuário"
                style={{
                  width: '100%',
                  padding: '13px 16px',
                  borderRadius: '12px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(59,130,246,0.2)',
                  color: '#f8fafc',
                  fontSize: '15px',
                  fontFamily: "'Inter', sans-serif",
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box',
                }}
                onFocus={e => e.target.style.borderColor = 'rgba(96,165,250,0.6)'}
                onBlur={e => e.target.style.borderColor = 'rgba(59,130,246,0.2)'}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1', fontSize: '13px', fontWeight: '600', letterSpacing: '0.05em' }}>
                SENHA
              </label>
              <input
                type="password"
                id="login-password"
                required
                autoComplete="current-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: '100%',
                  padding: '13px 16px',
                  borderRadius: '12px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(59,130,246,0.2)',
                  color: '#f8fafc',
                  fontSize: '15px',
                  fontFamily: "'Inter', sans-serif",
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box',
                }}
                onFocus={e => e.target.style.borderColor = 'rgba(96,165,250,0.6)'}
                onBlur={e => e.target.style.borderColor = 'rgba(59,130,246,0.2)'}
              />
            </div>

            {error && (
              <div style={{
                padding: '12px 16px',
                borderRadius: '10px',
                background: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.2)',
                color: '#fca5a5',
                fontSize: '13px',
                textAlign: 'center',
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              id="btn-login"
              disabled={loading}
              style={{
                width: '100%',
                padding: '15px',
                borderRadius: '14px',
                border: '1px solid rgba(96,165,250,0.22)',
                background: loading
                  ? 'linear-gradient(135deg, #1e3a8a, #2563eb)'
                  : 'linear-gradient(135deg, #1d4ed8, #3b82f6)',
                color: '#ffffff',
                fontSize: '16px',
                fontWeight: '700',
                fontFamily: "'Inter', sans-serif",
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                boxShadow: '0 6px 24px rgba(59,130,246,0.35)',
                transition: 'all 0.2s ease',
                letterSpacing: '0.03em',
                marginTop: '4px',
              }}
            >
              {loading ? '⏳ Entrando...' : '💙 Entrar'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', color: 'rgba(96,165,250,0.25)', fontSize: '12px', marginTop: '24px' }}>
          Feito com amor, só para nós dois 💙
        </p>
      </div>
    </div>
  );
}
