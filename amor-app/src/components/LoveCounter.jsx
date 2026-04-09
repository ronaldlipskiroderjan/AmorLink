import React, { useState, useEffect } from 'react';

function calcTime(startDateStr) {
  const start = new Date(startDateStr + 'T00:00:00');
  const diff  = new Date() - start;
  if (diff < 0) return { days:0, hours:0, minutes:0, seconds:0 };
  const s = Math.floor(diff / 1000);
  return {
    days:    Math.floor(s / 86400),
    hours:   Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  };
}

function TimeUnit({ value, label }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'8px' }}>
      <div style={{
        width:  'clamp(68px, 18vw, 112px)',
        height: 'clamp(68px, 18vw, 112px)',
        borderRadius: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 'clamp(24px, 7vw, 40px)',
        fontWeight: 700,
        color: '#ffffff',
        fontFamily: "'Inter', sans-serif",
        fontVariantNumeric: 'tabular-nums',
        background: 'linear-gradient(145deg, #1d4ed8 0%, #2563eb 50%, #3b82f6 100%)',
        boxShadow: '0 6px 24px rgba(59,130,246,0.35), inset 0 1px 0 rgba(255,255,255,0.12)',
        border: '1px solid rgba(96,165,250,0.18)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Reflexo superior */}
        <div style={{
          position:'absolute', top:0, left:0, right:0,
          height:'42%',
          background:'linear-gradient(to bottom, rgba(255,255,255,0.13), transparent)',
          borderRadius:'15px 15px 0 0',
        }} />
        <span style={{ position:'relative', zIndex:1 }}>{String(value).padStart(2, '0')}</span>
      </div>
      <span style={{
        fontSize: '10px',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.18em',
        color: '#60a5fa',
      }}>
        {label}
      </span>
    </div>
  );
}

export default function LoveCounter({ startDate }) {
  const [time, setTime] = useState(null);

  useEffect(() => {
    if (!startDate) return;
    setTime(calcTime(startDate));
    const t = setInterval(() => setTime(calcTime(startDate)), 1000);
    return () => clearInterval(t);
  }, [startDate]);

  if (!startDate || !time) {
    return (
      <div style={{ textAlign:'center', padding:'40px 20px', color:'#60a5fa' }}
        className="animate-pulse">
        Carregando o contador...
      </div>
    );
  }

  return (
    <section style={{ padding:'32px var(--page-px) 24px' }}>
      <div style={{ maxWidth:'480px', margin:'0 auto', textAlign:'center' }}>
        <p className="eyebrow" style={{ marginBottom:'12px' }}>✦ Contador de amor ✦</p>
        <h2 style={{
          fontFamily:"'Playfair Display', serif",
          fontSize:'clamp(24px, 7vw, 34px)',
          color:'#ffffff', marginBottom:'8px',
        }}>
          Juntos há...
        </h2>
        <p style={{ fontSize:'13px', color:'#93c5fd', marginBottom:'28px' }}>
          Cada segundo ao seu lado é precioso 💙
        </p>

        {/* Glassmorphism container */}
        <div
          className="glow-card"
          style={{
            background:'rgba(13,26,53,0.72)',
            backdropFilter:'blur(24px)',
            WebkitBackdropFilter:'blur(24px)',
            border:'1px solid rgba(59,130,246,0.2)',
            borderRadius:'24px',
            padding:'28px 20px',
          }}
        >
          {/* Linha topo */}
          <div style={{
            position:'absolute', top:0, left:'15%', right:'15%', height:'1px',
            background:'linear-gradient(to right, transparent, rgba(59,130,246,0.45), transparent)',
            borderRadius:'1px',
          }} />

          <div style={{
            display:'flex',
            justifyContent:'center',
            gap:'clamp(10px, 3vw, 28px)',
            flexWrap:'wrap',
            position:'relative',
          }}>
            <TimeUnit value={time.days}    label="dias"     />
            <TimeUnit value={time.hours}   label="horas"    />
            <TimeUnit value={time.minutes} label="minutos"  />
            <TimeUnit value={time.seconds} label="segundos" />
          </div>
        </div>

        <p style={{ marginTop:'20px', fontSize:'13px', fontStyle:'italic', color:'rgba(148,163,184,0.55)' }}>
          {/* 💡 Mude essa frase! */}
          E cada momento é perfeito!!...
        </p>
      </div>
    </section>
  );
}
