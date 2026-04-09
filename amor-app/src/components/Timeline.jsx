import React, { useState, useEffect } from 'react';
import { getTimeline, addMoment, deleteMoment } from '../api';

function formatDate(dateStr) {
  const date = new Date(dateStr + 'T12:00:00');
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
}

export default function Timeline() {
  const [moments, setMoments]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleting, setDeleting]   = useState(null);
  const [newMoment, setNewMoment] = useState({ date: '', title: '', description: '', photoUrl: '' });

  useEffect(() => { fetchTimeline(); }, []);

  const fetchTimeline = () => {
    setLoading(true);
    getTimeline()
      .then(data => { setMoments(data); setLoading(false); })
      .catch(err => { console.error(err); setLoading(false); });
  };

  const handleAdd = (e) => {
    e.preventDefault();
    addMoment({ ...newMoment, photoUrl: newMoment.photoUrl || null })
      .then(() => {
        setIsModalOpen(false);
        setNewMoment({ date: '', title: '', description: '', photoUrl: '' });
        fetchTimeline();
      })
      .catch(err => console.error(err));
  };

  const handleDelete = async (id) => {
    if (!confirm('Excluir este momento?')) return;
    setDeleting(id);
    try {
      await deleteMoment(id);
      setMoments(ms => ms.filter(m => m.id !== id));
    } catch (e) { console.error(e); }
    finally { setDeleting(null); }
  };

  return (
    <section style={{ padding: '32px var(--page-px) 24px' }}>
      <div style={{ maxWidth: '520px', margin: '0 auto' }}>

        {/* Cabeçalho */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <p className="eyebrow" style={{ marginBottom: '12px' }}>✦ Nossa história ✦</p>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(24px,7vw,34px)', color: '#ffffff', marginBottom: '8px' }}>
            Linha do Tempo
          </h2>
          <p style={{ fontSize: '13px', color: '#93c5fd' }}>Os momentos que ficam guardados no coração 💙</p>
        </div>

        {/* Botão Adicionar */}
        <button
          onClick={() => setIsModalOpen(true)}
          style={{
            width: '100%', marginBottom: '24px', padding: '13px',
            borderRadius: '14px', background: 'rgba(29,78,216,0.15)',
            border: '1px dashed rgba(59,130,246,0.3)', color: '#60a5fa',
            fontSize: '14px', fontWeight: '600', cursor: 'pointer',
            fontFamily: "'Inter', sans-serif", transition: 'all 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(29,78,216,0.25)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(29,78,216,0.15)'}
        >
          + Adicionar Momento
        </button>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#60a5fa' }} className="animate-pulse">
            Carregando nossas memórias...
          </div>
        ) : moments.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'rgba(96,165,250,0.5)' }}>
            <p style={{ fontSize: '40px', marginBottom: '12px' }}>📷</p>
            <p style={{ fontSize: '15px' }}>Nenhum momento cadastrado ainda.</p>
          </div>
        ) : (
          <div>
            {moments.map((moment, i) => (
              <div key={moment.id} className="fade-in-up" style={{ animationDelay: `${i * 0.08}s`, marginBottom: '16px', position: 'relative' }}>
                {/* Delete button */}
                <button
                  onClick={() => handleDelete(moment.id)}
                  disabled={deleting === moment.id}
                  title="Excluir momento"
                  style={{
                    position: 'absolute', top: '12px', right: '12px', zIndex: 10,
                    background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)',
                    color: 'rgba(252,165,165,0.85)', borderRadius: '8px', padding: '5px 9px',
                    cursor: 'pointer', fontSize: '12px', opacity: deleting === moment.id ? 0.5 : 1,
                  }}
                >
                  🗑
                </button>

                <div style={{ borderRadius: '20px', overflow: 'hidden', background: 'rgba(13,26,53,0.72)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(59,130,246,0.18)', boxShadow: '0 4px 28px rgba(0,0,0,0.35)', transition: 'transform 0.25s ease' }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <div style={{ height: '1px', background: 'linear-gradient(to right, transparent, rgba(59,130,246,0.38), transparent)' }} />

                  {moment.photoUrl ? (
                    <div style={{ height: '180px', overflow: 'hidden', position: 'relative' }}>
                      <img src={moment.photoUrl} alt={moment.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.5s ease' }}
                        onError={e => { e.target.style.display = 'none'; }}
                        onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
                        onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                      />
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(13,26,53,0.75) 0%, transparent 55%)' }} />
                    </div>
                  ) : (
                    <div style={{ height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #0d1a35, #162447)' }}>
                      <span style={{ fontSize: '24px', opacity: 0.25 }}>✦</span>
                    </div>
                  )}

                  <div style={{ padding: '18px 20px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0, background: 'linear-gradient(135deg, #3b82f6, #60a5fa)', boxShadow: '0 0 10px rgba(59,130,246,0.8)' }} />
                      <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#60a5fa' }}>{formatDate(moment.date)}</p>
                    </div>
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(17px,5vw,20px)', color: '#ffffff', fontWeight: 600, marginBottom: '8px', lineHeight: 1.3 }}>{moment.title}</h3>
                    {moment.description && <p style={{ fontSize: '13px', color: 'rgba(148,163,184,0.75)', lineHeight: 1.6 }}>{moment.description}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Adicionar Momento */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15,23,42,0.85)', backdropFilter: 'blur(8px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: 'rgba(13,26,53,0.95)', border: '1px solid rgba(59,130,246,0.25)', borderRadius: '24px', padding: '28px', width: '100%', maxWidth: '460px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ color: '#f8fafc', fontSize: '20px', fontWeight: '700', margin: 0 }}>Novo Momento</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '24px', cursor: 'pointer' }}>×</button>
            </div>
            <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                { label: 'Data *', type: 'date', key: 'date', required: true },
                { label: 'Título *', type: 'text', key: 'title', placeholder: 'Ex: Nosso primeiro beijo 💋', required: true },
                { label: 'Descrição', type: 'text', key: 'description', placeholder: 'Um resumo especial deste momento...' },
                { label: 'URL da Foto (opcional)', type: 'url', key: 'photoUrl', placeholder: 'https://...' },
              ].map(({ label, type, key, placeholder, required }) => (
                <div key={key}>
                  <label style={{ display: 'block', marginBottom: '6px', color: '#cbd5e1', fontSize: '13px', fontWeight: '500' }}>{label}</label>
                  <input type={type} required={required} value={newMoment[key]} onChange={e => setNewMoment({ ...newMoment, [key]: e.target.value })} placeholder={placeholder}
                    style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(59,130,246,0.2)', color: '#f8fafc', fontSize: '14px', fontFamily: "'Inter', sans-serif", boxSizing: 'border-box', outline: 'none' }}
                  />
                </div>
              ))}
              <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ flex: 1, padding: '12px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', color: '#e2e8f0', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', fontWeight: '600' }}>Cancelar</button>
                <button type="submit" style={{ flex: 2, padding: '12px', borderRadius: '10px', background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: '700', fontSize: '15px' }}>Salvar 📅</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
