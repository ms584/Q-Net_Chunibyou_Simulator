import React, { useState, useEffect } from 'react';
import { Zap, Wifi } from 'lucide-react';

export default function Header({ target }) {
  const [time, setTime] = useState(new Date());
  useEffect(() => { const t = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(t); }, []);
  const fmt = n => String(n).padStart(2, '0');
  const ts = `${fmt(time.getHours())}:${fmt(time.getMinutes())}:${fmt(time.getSeconds())}`;

  return (
    <header style={{ borderBottom: '1px solid rgba(0,245,255,0.18)', background: 'rgba(0,245,255,0.025)', flexShrink: 0 }}>

      {/* ── Main row ── */}
      <div className="relative flex items-center justify-between px-4 py-2">

        {/* Logo */}
        <div className="flex items-center gap-2">
          <Zap size={18} style={{ color: '#ff00ff', filter: 'drop-shadow(0 0 5px #ff00ff)', flexShrink: 0 }} />
          <div>
            <div className="font-black tracking-widest text-glow-cyan italic"
              style={{ color: '#00f5ff', fontFamily: 'Orbitron, monospace', fontSize: 'clamp(0.9rem, 3vw, 1.4rem)', lineHeight: 1 }}>
              Q-NET
            </div>
            <div style={{ color: 'rgba(0,245,255,0.45)', fontFamily: 'Orbitron, monospace', fontSize: 'clamp(0.45rem, 1.5vw, 0.65rem)', letterSpacing: '0.22em' }}>
              INTERPLANETARY SIMULATOR
            </div>
          </div>
          {/* Desktop-only build info */}
          <div className="hidden lg:flex flex-col ml-3 pl-3 text-xs"
            style={{ color: 'rgba(0,245,255,0.4)', borderLeft: '1px solid rgba(0,245,255,0.18)' }}>
            <span>VER 4.0.1 // IBN-MARRAKESH</span>
            <span>SPRINT-4 · MARCH 2026</span>
          </div>
        </div>

        {/* Center — active target (desktop only, shown via CSS class) */}
        <div className="header-center-target absolute left-1/2 -translate-x-1/2 items-center gap-2 px-4 py-1 rounded-sm"
          style={{ border: `1px solid ${target.colorHex}44`, background: `${target.colorHex}0d` }}>
          <span className="text-xs" style={{ color: 'rgba(0,245,255,0.4)' }}>TARGET:</span>
          <span className="text-sm font-bold" style={{
            color: target.colorHex, textShadow: `0 0 8px ${target.colorHex}`, fontFamily: 'Orbitron, monospace',
          }}>
            {target.name.toUpperCase()}
          </span>
          <span className="text-xs" style={{ color: `${target.colorHex}88` }}>{target.dist}</span>
        </div>

        {/* Right — clock + status */}
        <div className="flex items-center gap-3">
          {/* Clock (desktop) */}
          <div className="hidden lg:block text-right">
            <div className="text-xs" style={{ color: 'rgba(0,245,255,0.4)' }}>UTC</div>
            <div className="text-lg font-mono text-glow-cyan"
              style={{ color: '#00f5ff', fontFamily: 'Orbitron, monospace' }}>{ts}</div>
          </div>
          {/* Clock (mobile tiny) */}
          <div className="lg:hidden text-xs font-mono text-glow-cyan"
            style={{ color: '#00f5ff', fontFamily: 'Orbitron, monospace' }}>{ts}</div>

          {/* ONLINE badge */}
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-sm"
            style={{ border: '1px solid rgba(0,245,255,0.28)', background: 'rgba(0,245,255,0.07)' }}>
            <Wifi size={11} style={{ color: '#00f5ff' }} />
            <span className="pulse-dot" />
            <span className="hidden lg:inline text-xs font-bold tracking-widest text-glow-cyan"
              style={{ color: '#00f5ff', fontFamily: 'Orbitron, monospace' }}>SYSTEM ONLINE</span>
            <span className="lg:hidden text-xs font-bold text-glow-cyan"
              style={{ color: '#00f5ff', fontFamily: 'Orbitron, monospace' }}>ONLINE</span>
          </div>
        </div>
      </div>

      {/* ── Mobile-only: target pill row ── */}
      <div className="header-mobile-target"
        style={{ borderTop: '1px solid rgba(0,245,255,0.1)', background: `${target.colorHex}0a`, padding: '4px 12px' }}>
        <span className="text-xs" style={{ color: 'rgba(0,245,255,0.45)' }}>TARGET:</span>
        <span className="text-sm font-bold ml-1" style={{
          color: target.colorHex, textShadow: `0 0 8px ${target.colorHex}`, fontFamily: 'Orbitron, monospace',
        }}>
          {target.name.toUpperCase()}
        </span>
        <span className="text-xs ml-2" style={{ color: `${target.colorHex}88` }}>{target.dist}</span>
        <span className="ml-auto text-xs" style={{ color: 'rgba(0,245,255,0.35)' }}>VER 4.0.1 · IBN-MARRAKESH</span>
      </div>
    </header>
  );
}
