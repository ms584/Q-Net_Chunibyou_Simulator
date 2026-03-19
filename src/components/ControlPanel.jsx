import React from 'react';
import { Zap, Radio, Globe } from 'lucide-react';
import { SYSTEMS } from '../systems';

export default function ControlPanel({ mode, setMode, targetKey, setTargetKey, isTransmitting, onExecute }) {
  const target = SYSTEMS[targetKey];

  return (
    <div className="panel flex flex-col h-full overflow-hidden" style={{ padding: '12px' }}>

      {/* Title */}
      <div className="text-xs tracking-widest font-bold mb-2 flex items-center gap-1.5"
        style={{ color: '#00f5ff', fontFamily: 'Orbitron, monospace' }}>
        <Radio size={12} />  TRANSMISSION CONTROL
      </div>

      {/* Mode toggle */}
      <div className="flex gap-2 mb-2">
        <button
          onClick={() => setMode('classic')}
          className="btn-neon flex-1 flex flex-col items-center gap-0.5 py-2"
          style={mode === 'classic' ? {
            borderColor: '#fbbf24', color: '#fbbf24',
            background: 'rgba(251,191,36,0.08)', boxShadow: '0 0 12px rgba(251,191,36,0.35)',
          } : { borderColor: 'rgba(251,191,36,0.3)', color: 'rgba(251,191,36,0.5)' }}>
          <Globe size={14} />
          <span style={{ fontFamily: 'Orbitron, monospace', fontSize: '0.6rem' }}>CLASSIC TCP/IP</span>
          {mode === 'classic' && <span style={{ fontSize: '0.55rem' }}>▶ ACTIVE</span>}
        </button>
        <button
          onClick={() => setMode('qnet')}
          className="btn-neon btn-neon-magenta flex-1 flex flex-col items-center gap-0.5 py-2"
          style={mode === 'qnet' ? {} : { borderColor: 'rgba(255,0,255,0.25)', color: 'rgba(255,0,255,0.4)' }}>
          <Zap size={14} />
          <span style={{ fontFamily: 'Orbitron, monospace', fontSize: '0.6rem' }}>Q-NET WARP</span>
          {mode === 'qnet' && <span style={{ fontSize: '0.55rem' }}>▶ ACTIVE</span>}
        </button>
      </div>

      {/* Destination selector */}
      <div className="text-xs mb-1.5" style={{ color: 'rgba(0,245,255,0.5)', fontFamily: 'Orbitron, monospace', letterSpacing: '0.1em' }}>
        SELECT DESTINATION
      </div>
      <div className="flex gap-1.5 mb-2 flex-wrap">
        {Object.values(SYSTEMS).map(sys => (
          <button
            key={sys.key}
            onClick={() => setTargetKey(sys.key)}
            className="text-xs px-2 py-1 rounded-sm transition-all"
            style={{
              fontFamily: 'Share Tech Mono, monospace',
              border: `1px solid ${targetKey === sys.key ? sys.colorHex : sys.colorHex + '44'}`,
              color: targetKey === sys.key ? sys.colorHex : sys.colorHex + '77',
              background: targetKey === sys.key ? sys.colorHex + '18' : 'transparent',
              boxShadow: targetKey === sys.key ? `0 0 8px ${sys.glowHex}` : 'none',
              fontSize: '0.6rem',
            }}>
            {sys.name === 'Mars' ? '♂ MARS' : sys.name === 'Proxima Centauri' ? 'PROXIMA' : sys.name === 'Alpha Centauri' ? 'α CENTAURI' : '★ SIRIUS'}
          </button>
        ))}
      </div>

      {/* Target info */}
      <div className="text-xs mb-2 py-1.5 px-2 rounded-sm flex gap-4"
        style={{ background: 'rgba(0,245,255,0.04)', border: '1px solid rgba(0,245,255,0.1)', color: 'rgba(0,245,255,0.5)' }}>
        <span>DIST: <span style={{ color: target.colorHex }}>{target.dist}</span></span>
        <span>RTT: <span style={{ color: '#ff00ff' }}>{target.handshake}</span></span>
      </div>

      {/* Execute Warp button */}
      <button
        disabled={isTransmitting}
        onClick={onExecute}
        className="mt-auto w-full py-2 rounded-sm font-bold tracking-widest text-xs uppercase transition-all"
        style={{
          fontFamily: 'Orbitron, monospace',
          background: isTransmitting
            ? 'rgba(255,0,255,0.15)'
            : mode === 'qnet'
              ? 'linear-gradient(135deg, rgba(255,0,255,0.18), rgba(0,245,255,0.1))'
              : 'rgba(251,191,36,0.12)',
          border: `1px solid ${isTransmitting ? 'rgba(255,0,255,0.3)' : mode === 'qnet' ? '#ff00ff' : '#fbbf24'}`,
          color: isTransmitting ? 'rgba(255,0,255,0.5)' : mode === 'qnet' ? '#ff00ff' : '#fbbf24',
          boxShadow: isTransmitting ? 'none'
            : mode === 'qnet' ? '0 0 14px rgba(255,0,255,0.3)' : '0 0 10px rgba(251,191,36,0.25)',
          animation: isTransmitting ? 'pulse-dot 0.8s ease-in-out infinite' : 'none',
          cursor: isTransmitting ? 'not-allowed' : 'pointer',
        }}>
        {isTransmitting
          ? (mode === 'qnet' ? '⚡ TRANSMITTING...' : '📡 HANDSHAKING...')
          : (mode === 'qnet' ? '⚡ EXECUTE WARP' : '📡 SEND TCP SYN')}
      </button>
    </div>
  );
}
