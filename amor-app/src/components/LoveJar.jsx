import React, { useState, useEffect } from 'react';
import { getRandomLoveReason, getAllLoveReasons, addLoveReason, deleteLoveReason } from '../api';
import { useAuth } from '../contexts/AuthContext';

export default function LoveJar() {
  const { isAdmin } = useAuth();
  const [reason, setReason]       = useState(null);
  const [loading, setLoading]     = useState(false);
  const [showList, setShowList]   = useState(false);
  const [reasons, setReasons]     = useState([]);
  const [listLoading, setListLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newReason, setNewReason] = useState('');

  // Carrega lista de razões (apenas para admin)
  const loadReasons = () => {
    if (!isAdmin) return;
    setListLoading(true);
    getAllLoveReasons()
      .then(data => { setReasons(data); setListLoading(false); })
      .catch(() => setListLoading(false));
  };

  const handleClick = async () => {
    setLoading(true);
    try {
      const data = await getRandomLoveReason();
      await new Promise(r => setTimeout(r, 380));
      setReason(data.reason);
    } catch (err) {
      console.error('Erro ao buscar razão:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newReason.trim()) return;
    await addLoveReason({ reason: newReason }).catch(console.error);
    setNewReason('');
    setIsModalOpen(false);
    loadReasons();
  };

  const handleDelete = async (id) => {
    if (!confirm('Excluir esta razão?')) return;
    await deleteLoveReason(id).catch(console.error);
    setReasons(rs => rs.filter(r => r.id !== id));
  };

  return (
    <section style={{ padding: '32px var(--page-px) 24px' }}>
      <div style={{ maxWidth: '480px', margin: '0 auto', textAlign: 'center' }}>
        <p className="eyebrow" style={{ marginBottom: '12px' }}>✦ Potinho Virtual ✦</p>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(24px,7vw,34px)', color: '#ffffff', marginBottom: '8px' }}>
          Por que te amo?
        </h2>
        <p style={{ fontSize: '13px', color: '#93c5fd', marginBottom: '28px' }}>
          Clique e descubra uma razão especial 💙
        </p>

        {reason && (
          <div className="fade-in-up" style={{ marginBottom: '20px', padding: '28px 24px', borderRadius: '20px', background: 'rgba(13,26,53,0.72)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(59,130,246,0.22)', boxShadow: '0 0 48px rgba(59,130,246,0.1)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: '20%', right: '20%', height: '1px', background: 'linear-gradient(to right, transparent, rgba(59,130,246,0.45), transparent)' }} />
            <div style={{ position: 'absolute', top: '12px', left: '16px', fontSize: '28px', color: 'rgba(59,130,246,0.2)', userSelect: 'none' }}>❝</div>
            <div style={{ position: 'absolute', bottom: '12px', right: '16px', fontSize: '28px', color: 'rgba(59,130,246,0.2)', userSelect: 'none' }}>❞</div>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(15px,4.2vw,19px)', lineHeight: 1.65, fontStyle: 'italic', color: '#bae6fd', position: 'relative', zIndex: 1 }}>
              {reason}
            </p>
          </div>
        )}

        <button id="btn-potinho" onClick={handleClick} disabled={loading} style={{
          width: '100%', maxWidth: '360px', padding: '16px 0', borderRadius: '16px',
          border: '1px solid rgba(96,165,250,0.22)',
          background: loading ? 'linear-gradient(135deg, #1e3a8a, #2563eb)' : 'linear-gradient(135deg, #1d4ed8, #3b82f6)',
          color: '#ffffff', fontSize: '16px', fontWeight: 600, fontFamily: "'Inter', sans-serif",
          cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1,
          boxShadow: '0 8px 32px rgba(59,130,246,0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
          transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', margin: '0 auto',
        }}
          onMouseEnter={e => { if (!loading) e.currentTarget.style.boxShadow = '0 12px 48px rgba(59,130,246,0.6), inset 0 1px 0 rgba(255,255,255,0.1)'; }}
          onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 8px 32px rgba(59,130,246,0.4), inset 0 1px 0 rgba(255,255,255,0.1)'; }}
        >
          <span className={loading ? 'animate-spin' : 'heart-beat'} style={{ display: 'inline-block', fontSize: '20px' }}>
            {loading ? '⏳' : '💙'}
          </span>
          {loading ? 'Abrindo o potinho...' : reason ? 'Outra razão!' : 'Abrir o Potinho'}
        </button>

        {/* Admin controls */}
        {isAdmin && (
          <div style={{ marginTop: '32px', display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => setIsModalOpen(true)} style={{ padding: '10px 18px', borderRadius: '12px', background: 'rgba(29,78,216,0.15)', border: '1px dashed rgba(59,130,246,0.3)', color: '#60a5fa', fontSize: '13px', cursor: 'pointer', fontFamily: "'Inter', sans-serif" }}>
              + Adicionar Razão
            </button>
            <button onClick={() => { setShowList(!showList); if (!showList) loadReasons(); }} style={{ padding: '10px 18px', borderRadius: '12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', fontSize: '13px', cursor: 'pointer', fontFamily: "'Inter', sans-serif" }}>
              {showList ? 'Ocultar Lista' : '📋 Ver Todas'}
            </button>
          </div>
        )}

        {/* Lista de razões (admin) */}
        {isAdmin && showList && (
          <div style={{ marginTop: '20px', textAlign: 'left' }}>
            <h4 style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Todas as Razões</h4>
            {listLoading ? (
              <p style={{ color: '#60a5fa', textAlign: 'center' }}>Carregando...</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {reasons.map(r => (
                  <div key={r.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '12px 16px', borderRadius: '12px', background: 'rgba(13,26,53,0.6)', border: '1px solid rgba(59,130,246,0.1)' }}>
                    <p style={{ flex: 1, fontSize: '13px', color: '#e2e8f0', lineHeight: 1.5, margin: 0 }}>{r.reason}</p>
                    <button onClick={() => handleDelete(r.id)} title="Excluir" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: 'rgba(252,165,165,0.8)', borderRadius: '6px', padding: '3px 7px', cursor: 'pointer', fontSize: '11px', flexShrink: 0 }}>🗑</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal Adicionar Razão */}
      {isAdmin && isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15,23,42,0.85)', backdropFilter: 'blur(8px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: 'rgba(13,26,53,0.95)', border: '1px solid rgba(59,130,246,0.25)', borderRadius: '24px', padding: '28px', width: '100%', maxWidth: '400px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ color: '#f8fafc', fontSize: '20px', fontWeight: '700', margin: 0 }}>Nova Razão</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '24px', cursor: 'pointer' }}>×</button>
            </div>
            <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', color: '#cbd5e1', fontSize: '13px', fontWeight: '500' }}>Por que você a/o ama? *</label>
                <textarea required rows="4" value={newReason} onChange={e => setNewReason(e.target.value)} placeholder="Porque ela ri de um jeito que ilumina qualquer lugar." style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(59,130,246,0.2)', color: '#f8fafc', fontSize: '14px', fontFamily: "'Inter', sans-serif", boxSizing: 'border-box', outline: 'none', resize: 'vertical' }} />
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ flex: 1, padding: '12px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', color: '#e2e8f0', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', fontWeight: '600' }}>Cancelar</button>
                <button type="submit" style={{ flex: 2, padding: '12px', borderRadius: '10px', background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: '700' }}>Guardar 💙</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
