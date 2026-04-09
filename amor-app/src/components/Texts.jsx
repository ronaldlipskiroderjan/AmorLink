import React, { useState, useEffect } from 'react';
import { getTexts, addText, deleteTexto } from '../api';
import { useAuth } from '../contexts/AuthContext';

export default function Texts() {
  const { isAdmin } = useAuth();
  const [texts, setTexts]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newText, setNewText]     = useState({ title: '', content: '', author: '' });
  const [selectedText, setSelectedText] = useState(null);
  const [deleting, setDeleting]   = useState(null);

  useEffect(() => { fetchTexts(); }, []);

  const fetchTexts = () => {
    setLoading(true);
    getTexts()
      .then(data => { setTexts(data); setLoading(false); })
      .catch(() => {
        setTexts([{ id: 1, title: "Para o meu amor", content: "Você é a melhor coisa que me aconteceu. Te amo infinitamente!", author: "Eu", createdAt: "2025-02-14" }]);
        setLoading(false);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newText.title.trim() || !newText.content.trim()) return;
    addText(newText)
      .then(() => { setIsModalOpen(false); setNewText({ title: '', content: '', author: '' }); fetchTexts(); })
      .catch(() => {
        setTexts([{ ...newText, id: Date.now(), createdAt: new Date().toISOString().split('T')[0] }, ...texts]);
        setIsModalOpen(false); setNewText({ title: '', content: '', author: '' });
      });
  };

  const handleDelete = async (id) => {
    if (!confirm('Excluir esta carta?')) return;
    setDeleting(id);
    try {
      await deleteTexto(id);
      setTexts(ts => ts.filter(t => t.id !== id));
      if (selectedText?.id === id) setSelectedText(null);
    } catch (e) { console.error(e); }
    finally { setDeleting(null); }
  };

  const formatDate = (d) => {
    if (!d) return '';
    try { return new Date(d + 'T00:00:00').toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' }); }
    catch { return d; }
  };

  return (
    <div className="section-container" style={{ animation: 'fadeIn 0.6s ease-out' }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#f8fafc', marginBottom: '8px' }}>Cantinho das Cartas</h2>
        <p style={{ color: 'rgba(148, 163, 184, 0.9)', fontSize: '15px' }}>Palavras que o tempo não apaga.</p>
      </div>

      {!selectedText ? (
        <>
          <button className="action-button" onClick={() => setIsModalOpen(true)}
            style={{ marginBottom: '24px', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
            <span>✍️</span> Escrever uma carta
          </button>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}><div className="loader" style={{ margin: '0 auto' }}></div></div>
          ) : texts.length === 0 ? (
            <div className="glass-card" style={{ textAlign: 'center', padding: '40px 20px', opacity: 0.8 }}>
              <span style={{ fontSize: '40px', display: 'block', marginBottom: '16px' }}>📭</span>
              <p style={{ color: '#e2e8f0' }}>Nenhuma carta ainda... Seja o primeiro!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {texts.map(text => (
                <div key={text.id} className="glass-card" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '10px', position: 'relative' }}>
                  {/* Delete button */}
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(text.id); }}
                    disabled={deleting === text.id}
                    title="Excluir carta"
                    style={{
                      position: 'absolute', top: '12px', right: '12px',
                      background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
                      color: 'rgba(252,165,165,0.8)', borderRadius: '8px', padding: '4px 8px',
                      cursor: 'pointer', fontSize: '12px', opacity: deleting === text.id ? 0.5 : 1,
                    }}
                  >
                    🗑
                  </button>

                  <div onClick={() => setSelectedText(text)}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingRight: '48px' }}>
                      <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#f8fafc', margin: 0 }}>{text.title}</h3>
                      <span style={{ fontSize: '12px', color: 'rgba(148,163,184,0.8)', whiteSpace: 'nowrap', marginLeft: '8px' }}>{formatDate(text.createdAt)}</span>
                    </div>
                    <p style={{ color: 'rgba(226,232,240,0.85)', fontSize: '14px', lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {text.content}
                    </p>
                    {text.author && <div style={{ textAlign: 'right', fontSize: '13px', color: 'rgba(148,163,184,0.9)', fontStyle: 'italic' }}>Por: {text.author}</div>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <div style={{ animation: 'slideUp 0.4s ease-out' }}>
          <button onClick={() => setSelectedText(null)}
            style={{ padding: '8px 16px', marginBottom: '20px', borderRadius: '20px', backgroundColor: 'rgba(59,130,246,0.1)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.2)', cursor: 'pointer' }}>
            ← Voltar
          </button>
          <div className="glass-card" style={{ padding: '32px 24px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -10, right: -10, fontSize: '80px', opacity: 0.03 }}>💌</div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '32px', textAlign: 'center' }}>
              <span style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '2px', color: '#60a5fa', marginBottom: '12px' }}>{formatDate(selectedText.createdAt)}</span>
              <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#f8fafc', margin: 0 }}>{selectedText.title}</h2>
            </div>
            <div style={{ color: '#e2e8f0', fontSize: '16px', lineHeight: '1.8', whiteSpace: 'pre-wrap' }}>{selectedText.content}</div>
            {selectedText.author && (
              <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px dashed rgba(148,163,184,0.2)', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <span style={{ color: 'rgba(148,163,184,0.7)', fontSize: '14px' }}>Com carinho,</span>
                <span style={{ color: '#94a3b8', fontWeight: '500', fontStyle: 'italic', fontSize: '15px' }}>{selectedText.author}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15,23,42,0.8)', backdropFilter: 'blur(8px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px', animation: 'fadeIn 0.3s ease-out' }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '500px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#f8fafc', margin: 0 }}>Nova Carta</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '24px', cursor: 'pointer' }}>×</button>
            </div>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1', fontSize: '14px', fontWeight: '500' }}>Título *</label>
                <input type="text" required value={newText.title} onChange={e => setNewText({ ...newText, title: e.target.value })} className="input-field" placeholder="Ex: Feliz 1 ano de namoro!" />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1', fontSize: '14px', fontWeight: '500' }}>Mensagem *</label>
                <textarea required rows="6" value={newText.content} onChange={e => setNewText({ ...newText, content: e.target.value })} className="input-field" placeholder="Escreva algo especial..." style={{ resize: 'vertical' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1', fontSize: '14px', fontWeight: '500' }}>De quem (Opcional)</label>
                <input type="text" value={newText.author} onChange={e => setNewText({ ...newText, author: e.target.value })} className="input-field" placeholder="Ex: Seu amor" />
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ flex: 1, padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', color: '#e2e8f0', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', fontWeight: '600' }}>Cancelar</button>
                <button type="submit" className="action-button" style={{ flex: 2 }}>Guardar Carta 💌</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}} />
    </div>
  );
}
