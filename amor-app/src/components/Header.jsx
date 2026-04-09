import React from 'react';

/**
 * Cabeçalho do site.
 * 💡 PERSONALIZE:
 * - Nome do casal: application.properties → app.couple.names
 * - Frase do <p> abaixo do divisor
 */
export default function Header({ coupleNames }) {
  return (
    <header
      style={{
        textAlign: 'center',
        paddingTop: 'calc(env(safe-area-inset-top) + 44px)',
        paddingBottom: '40px',
        paddingLeft: 'var(--page-px)',
        paddingRight: 'var(--page-px)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Orb de luz central */}
      <div style={{
        position: 'absolute',
        top: '-40px', left: '50%',
        transform: 'translateX(-50%)',
        width: '340px', height: '220px',
        background: 'radial-gradient(ellipse, rgba(29,78,216,0.26) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Orbs laterais */}
      <div style={{
        position: 'absolute', top: '20px', right: '-20px',
        width: '160px', height: '160px',
        background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '0', left: '-20px',
        width: '120px', height: '120px',
        background: 'radial-gradient(circle, rgba(96,165,250,0.08) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none',
      }} />

      {/* Estrelas decorativas */}
      <div style={{ position:'absolute', inset:0, pointerEvents:'none', userSelect:'none', opacity:0.12 }}>
        <span className="float-anim" style={{ position:'absolute', top:'14px', left:'24px', fontSize:'20px', animationDelay:'0s' }}>✦</span>
        <span className="float-anim" style={{ position:'absolute', top:'22px', right:'28px', fontSize:'14px', animationDelay:'1.2s' }}>⋆</span>
        <span className="float-anim" style={{ position:'absolute', bottom:'12px', left:'18%', fontSize:'16px', animationDelay:'2s' }}>✦</span>
        <span className="float-anim" style={{ position:'absolute', bottom:'18px', right:'20%', fontSize:'12px', animationDelay:'0.6s' }}>⋆</span>
      </div>

      {/* Conteúdo */}
      <div style={{ position:'relative', zIndex:1 }}>
        <p className="eyebrow" style={{ marginBottom: '16px' }}>
          ✦ Uma história de amor ✦
        </p>

        <h1
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(36px, 10vw, 64px)',
            fontWeight: 700,
            color: '#ffffff',
            lineHeight: 1.1,
            textShadow: '0 0 50px rgba(59,130,246,0.3)',
            marginBottom: '16px',
          }}
        >
          {/* 💡 Vem de application.properties → app.couple.names */}
          {coupleNames || '♡'}
        </h1>

        {/* Divisor */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'12px', margin:'18px 0' }}>
          <div style={{ width:'48px', height:'1px', background:'linear-gradient(to right, transparent, #3b82f6)' }} />
          <span style={{ color:'#60a5fa', fontSize:'16px' }}>✦</span>
          <div style={{ width:'48px', height:'1px', background:'linear-gradient(to left, transparent, #3b82f6)' }} />
        </div>

        {/* 💡 Mude essa frase! */}
        <p style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 'clamp(15px, 4vw, 18px)',
          fontStyle: 'italic',
          color: '#93c5fd',
          maxWidth: '320px',
          margin: '0 auto',
          lineHeight: 1.5,
        }}>
          "Você é o meu lar favorito no mundo."
        </p>
      </div>
    </header>
  );
}
