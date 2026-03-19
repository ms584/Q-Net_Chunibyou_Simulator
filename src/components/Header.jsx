import React, { useState, useEffect } from 'react';
import { Zap, Wifi } from 'lucide-react';

export default function Header({ target }) {
  const [time, setTime] = useState(new Date());
  useEffect(() => { const t = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(t); }, []);
  const fmt = n => String(n).padStart(2, '0');
  const ts = `${fmt(time.getHours())}:${fmt(time.getMinutes())}:${fmt(time.getSeconds())}`;

  return (
    <header className="relative flex items-center justify-between px-5 py-2.5"
      style={{ borderBottom: '1px solid rgba(0,245,255,0.18)', background: 'rgba(0,245,255,0.025)', flexShrink: 0 }}>

      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Zap size={22} style={{ color: '#ff00ff', filter: 'drop-shadow(0 0 6px #ff00ff)' }} />
          <div>
            <div className="text-2xl font-black tracking-widest text-glow-cyan italic"
              style={{ color: '#00f5ff', fontFamily: 'Orbitron, monospace', lineHeight: 1 }}>
              Q-NET
            </div>
            <div className="text-xs tracking-[0.28em]"
              style={{ color: 'rgba(0,245,255,0.45)', fontFamily: 'Orbitron, monospace' }}>
              INTERPLANETARY SIMULATOR
            </div>
          </div>
        </div>
        <div className="w-px h-9 mx-1" style={{ background: 'rgba(0,245,255,0.18)' }} />
        <div className="text-xs" style={{ color: 'rgba(0,245,255,0.4)' }}>
          <div>VER 4.0.1 // IBN-MARRAKESH</div>
          <div>SPRINT-4 · MARCH 2026</div>
        </div>
      </div>

      {/* Center — active target indicator */}
      <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-1 rounded-sm"
        style={{ border: `1px solid ${target.colorHex}44`, background: `${target.colorHex}0d` }}>
        <span className="text-xs" style={{ color: 'rgba(0,245,255,0.4)' }}>TARGET:</span>
        <span className="text-sm font-bold" style={{
          color: target.colorHex,
          textShadow: `0 0 8px ${target.colorHex}`,
          fontFamily: 'Orbitron, monospace',
        }}>
          {target.name.toUpperCase()}
        </span>
        <span className="text-xs" style={{ color: `${target.colorHex}88` }}>{target.dist}</span>
      </div>

      {/* Right — status */}
      <div className="flex items-center gap-4">
        <div className="text-right">
          <div className="text-xs" style={{ color: 'rgba(0,245,255,0.4)' }}>UTC</div>
          <div className="text-lg font-mono text-glow-cyan"
            style={{ color: '#00f5ff', fontFamily: 'Orbitron, monospace' }}>{ts}</div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-sm"
          style={{ border: '1px solid rgba(0,245,255,0.28)', background: 'rgba(0,245,255,0.07)' }}>
          <Wifi size={12} style={{ color: '#00f5ff' }} />
          <span className="pulse-dot" />
          <span className="text-xs font-bold tracking-widest text-glow-cyan"
            style={{ color: '#00f5ff', fontFamily: 'Orbitron, monospace' }}>
            SYSTEM ONLINE
          </span>
        </div>
      </div>
    </header>
  );
}
