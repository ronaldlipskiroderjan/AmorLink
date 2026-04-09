import React, { useState, useEffect } from 'react';
import { getCoupons, redeemCoupon, unredeemCoupon, addCoupon, deleteCoupon } from '../api';
import { useAuth } from '../contexts/AuthContext';

function CouponCard({ coupon, onRedeem, onUnredeem, onDelete, isAdmin }) {
  const [loading, setLoading] = useState(false);
  const r = coupon.redeemed;

  const handle = async () => {
    setLoading(true);
    try { r ? await onUnredeem(coupon.id) : await onRedeem(coupon.id); }
    finally { setLoading(false); }
  };

  return (
    <div style={{
      borderRadius: '20px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px',
      background: r ? 'rgba(10,18,35,0.5)' : 'rgba(13,26,53,0.72)',
      backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
      border: r ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(59,130,246,0.2)',
      boxShadow: r ? 'none' : '0 4px 24px rgba(29,78,216,0.14)',
      opacity: r ? 0.6 : 1, position: 'relative', overflow: 'hidden',
      transition: 'transform 0.25s ease, opacity 0.3s ease',
    }}
      onMouseEnter={e => { if (!r) e.currentTarget.style.transform = 'translateY(-3px)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
    >
      {!r && <div style={{ position: 'absolute', top: 0, left: '20%', right: '20%', height: '1px', background: 'linear-gradient(to right, transparent, rgba(59,130,246,0.4), transparent)' }} />}

      {/* Badge Resgatado */}
      {r && <div style={{ position: 'absolute', top: '14px', right: isAdmin ? '52px' : '14px', background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.32)', fontSize: '11px', fontWeight: 600, padding: '4px 10px', borderRadius: '20px', letterSpacing: '0.06em' }}>✓ Resgatado</div>}

      {/* Delete (ADMIN only) */}
      {isAdmin && (
        <button onClick={() => onDelete(coupon.id)} title="Excluir cupom"
          style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: 'rgba(252,165,165,0.8)', borderRadius: '8px', padding: '4px 8px', cursor: 'pointer', fontSize: '12px' }}>
          🗑
        </button>
      )}

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
        <span style={{ fontSize: '36px', flexShrink: 0, lineHeight: 1.1 }} role="img" aria-label={coupon.title}>{coupon.emoji || '🎁'}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(16px,4.5vw,18px)', color: '#ffffff', fontWeight: 600, marginBottom: '6px', lineHeight: 1.3 }}>{coupon.title}</h3>
          <p style={{ fontSize: '13px', color: 'rgba(148,163,184,0.72)', lineHeight: 1.55 }}>{coupon.description}</p>
        </div>
      </div>

      <button onClick={handle} disabled={loading} style={{
        width: '100%', padding: '13px 0', borderRadius: '12px',
        border: r ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(96,165,250,0.18)',
        background: r ? 'rgba(255,255,255,0.05)' : 'linear-gradient(135deg, #1d4ed8, #3b82f6)',
        color: r ? 'rgba(255,255,255,0.32)' : '#ffffff', fontSize: '14px', fontWeight: 600,
        fontFamily: "'Inter', sans-serif", cursor: loading ? 'not-allowed' : 'pointer',
        boxShadow: r ? 'none' : '0 4px 16px rgba(59,130,246,0.32), inset 0 1px 0 rgba(255,255,255,0.1)',
        opacity: loading ? 0.55 : 1, transition: 'all 0.2s ease', letterSpacing: '0.02em',
      }}>
        {loading ? '⏳ Aguarde...' : r ? 'Desfazer resgate' : '✨ Resgatar'}
      </button>
    </div>
  );
}

export default function Coupons() {
  const { isAdmin } = useAuth();
  const [coupons, setCoupons]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCoupon, setNewCoupon] = useState({ title: '', description: '', emoji: '🎁' });

  useEffect(() => {
    getCoupons().then(setCoupons).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleRedeem   = async (id) => { const u = await redeemCoupon(id);   setCoupons(p => p.map(c => c.id === id ? u : c)); };
  const handleUnredeem = async (id) => { const u = await unredeemCoupon(id); setCoupons(p => p.map(c => c.id === id ? u : c)); };
  const handleDelete   = async (id) => {
    if (!confirm('Excluir este cupom?')) return;
    await deleteCoupon(id);
    setCoupons(cs => cs.filter(c => c.id !== id));
  };
  const handleAdd = async (e) => {
    e.preventDefault();
    const created = await addCoupon(newCoupon).catch(() => ({ ...newCoupon, id: Date.now(), redeemed: false }));
    setCoupons(cs => [...cs, created]);
    setIsModalOpen(false);
    setNewCoupon({ title: '', description: '', emoji: '🎁' });
  };

  const available = coupons.filter(c => !c.redeemed).length;

  return (
    <section style={{ padding: '32px var(--page-px) 24px' }}>
      <div style={{ maxWidth: '520px', margin: '0 auto' }}>

        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <p className="eyebrow" style={{ marginBottom: '12px' }}>✦ Presentes de amor ✦</p>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(24px,7vw,34px)', color: '#ffffff', marginBottom: '8px' }}>Cupons Românticos 🎁</h2>
          <p style={{ fontSize: '13px', color: '#93c5fd' }}>
            {available > 0 ? `${available} cupom${available !== 1 ? 's' : ''} disponível${available !== 1 ? 'is' : ''} para resgatar` : 'Todos os cupons foram resgatados! 💙'}
          </p>
        </div>

        {/* Add button — ADMIN only */}
        {isAdmin && (
          <button onClick={() => setIsModalOpen(true)}
            style={{ width: '100%', marginBottom: '20px', padding: '13px', borderRadius: '14px', background: 'rgba(29,78,216,0.15)', border: '1px dashed rgba(59,130,246,0.3)', color: '#60a5fa', fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: "'Inter', sans-serif" }}>
            + Novo Cupom
          </button>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#60a5fa' }} className="animate-pulse">Carregando seus presentes...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '14px' }}>
            {coupons.map((coupon, i) => (
              <div key={coupon.id} className="fade-in-up" style={{ animationDelay: `${i * 0.07}s` }}>
                <CouponCard coupon={coupon} onRedeem={handleRedeem} onUnredeem={handleUnredeem} onDelete={handleDelete} isAdmin={isAdmin} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Adicionar Cupom */}
      {isAdmin && isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15,23,42,0.85)', backdropFilter: 'blur(8px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: 'rgba(13,26,53,0.95)', border: '1px solid rgba(59,130,246,0.25)', borderRadius: '24px', padding: '28px', width: '100%', maxWidth: '420px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ color: '#f8fafc', fontSize: '20px', fontWeight: '700', margin: 0 }}>Novo Cupom</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '24px', cursor: 'pointer' }}>×</button>
            </div>
            <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', color: '#cbd5e1', fontSize: '13px', fontWeight: '500' }}>Emoji</label>
                <input type="text" value={newCoupon.emoji} onChange={e => setNewCoupon({ ...newCoupon, emoji: e.target.value })} style={{ width: '80px', padding: '10px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(59,130,246,0.2)', color: '#f8fafc', fontSize: '20px', textAlign: 'center', boxSizing: 'border-box', outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', color: '#cbd5e1', fontSize: '13px', fontWeight: '500' }}>Título *</label>
                <input type="text" required value={newCoupon.title} onChange={e => setNewCoupon({ ...newCoupon, title: e.target.value })} placeholder="Ex: Vale-Jantar Romântico" style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(59,130,246,0.2)', color: '#f8fafc', fontSize: '14px', fontFamily: "'Inter', sans-serif", boxSizing: 'border-box', outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', color: '#cbd5e1', fontSize: '13px', fontWeight: '500' }}>Descrição</label>
                <textarea rows="3" value={newCoupon.description} onChange={e => setNewCoupon({ ...newCoupon, description: e.target.value })} placeholder="O que este cupom dá direito..." style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(59,130,246,0.2)', color: '#f8fafc', fontSize: '14px', fontFamily: "'Inter', sans-serif", boxSizing: 'border-box', outline: 'none', resize: 'vertical' }} />
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ flex: 1, padding: '12px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', color: '#e2e8f0', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', fontWeight: '600' }}>Cancelar</button>
                <button type="submit" style={{ flex: 2, padding: '12px', borderRadius: '10px', background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: '700' }}>Criar Cupom 🎁</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
