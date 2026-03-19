import React, { useEffect, useState } from 'react';
import { ShieldCheck, Zap, Activity } from 'lucide-react';

function AnimCount({ target, duration = 1200, decimals = 0, suffix = '' }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let cur = 0;
    const step = (target / duration) * 16;
    const id = setInterval(() => {
      cur = Math.min(cur + step, target);
      setVal(parseFloat(cur.toFixed(decimals)));
      if (cur >= target) clearInterval(id);
    }, 16);
    return () => clearInterval(id);
  }, [target]);
  return <>{val}{suffix}</>;
}

function Bar({ value, color, label, delay = 0 }) {
  const [w, setW] = useState(0);
  useEffect(() => { const t = setTimeout(() => setW(value), delay + 200); return () => clearTimeout(t); }, [value]);
  return (
    <div className="mb-1.5">
      <div className="flex justify-between text-xs mb-0.5" style={{ color: 'rgba(0,245,255,0.55)' }}>
        <span>{label}</span>
        <span style={{ color }}><AnimCount target={value} suffix="%" /></span>
      </div>
      <div className="h-1.5 rounded-sm" style={{ background: 'rgba(0,245,255,0.08)', border: '1px solid rgba(0,245,255,0.12)' }}>
        <div style={{
          width: `${w}%`, height: '100%', borderRadius: '2px',
          background: `linear-gradient(to right, ${color}66, ${color})`,
          boxShadow: `0 0 8px ${color}`,
          transition: 'width 1.4s cubic-bezier(0.22,1,0.36,1)',
        }} />
      </div>
    </div>
  );
}

export default function StatsSidebar({ mode, target, isTransmitting }) {
  const isQ = mode === 'qnet';

  const fidelity     = isQ ? 99.09 : 72.4;
  const entanglement = isQ ? 97    : 44;
  const coherence    = isQ ? 94    : 31;

  return (
    <aside className="flex flex-col gap-3">

      {/* Quantum Fidelity */}
      <div className="panel p-3">
        <div className="text-xs tracking-widest font-bold mb-2 flex items-center gap-1.5"
          style={{ color: '#00f5ff', fontFamily: 'Orbitron, monospace' }}>
          <ShieldCheck size={12} /> QUANTUM FIDELITY
        </div>
        <Bar value={fidelity}     color="#00f5ff"  label="Channel Fidelity"  delay={0}   />
        <Bar value={entanglement} color="#00ccff"  label="Entanglement Purity" delay={200} />
        <Bar value={coherence}    color="#0088ff"  label="Bell State Coherence" delay={400} />
        <div className="mt-2 text-center">
          <div className="text-3xl font-black text-glow-cyan" style={{ color: '#00f5ff', fontFamily: 'Orbitron, monospace' }}>
            <AnimCount target={fidelity} decimals={2} suffix="%" />
          </div>
          <div className="text-xs mt-0.5" style={{ color: 'rgba(0,245,255,0.4)' }}>OVERALL SCORE</div>
          <div className="text-xs mt-0.5" style={{ color: 'rgba(0,245,255,0.3)' }}>Error: {isQ ? '0.91' : '27.6'}%</div>
        </div>
      </div>

      {/* Latency Savings — dynamically changes per target */}
      <div className="panel panel-magenta p-3">
        <div className="text-xs tracking-widest font-bold mb-2 flex items-center gap-1.5"
          style={{ color: '#ff00ff', fontFamily: 'Orbitron, monospace' }}>
          <Zap size={12} /> LATENCY SAVINGS
        </div>
        <div className="text-center py-1">
          <div className="font-black leading-tight" style={{
            color: '#ff00ff', fontFamily: 'Orbitron, monospace',
            textShadow: '0 0 20px #ff00ff',
            fontSize: target.isInterstellar ? '1.4rem' : '2.4rem',
          }}>
            {isQ ? target.handshake.toUpperCase() : '---'}
          </div>
          <div className="text-xs mt-1" style={{ color: 'rgba(255,0,255,0.65)' }}>
            {isQ ? 'CONNECTION SETUP ELIMINATED' : 'NO SAVINGS IN CLASSIC MODE'}
          </div>
        </div>
        <div className="mt-2 pt-2" style={{ borderTop: '1px solid rgba(255,0,255,0.12)' }}>
          {[
            ['Classic RTT', target.handshake, '#ff00ff'],
            ['Q-Net RTT',   '< 0.001 ms',    '#ff6aff'],
            ['Improvement', isQ ? (target.isInterstellar ? '×∞' : '×2,640,000') : '×0', '#ff00ff'],
          ].map(([lbl, val, c]) => (
            <div key={lbl} className="flex justify-between items-center py-1"
              style={{ borderBottom: '1px solid rgba(255,0,255,0.07)' }}>
              <span className="text-xs" style={{ color: 'rgba(255,0,255,0.5)' }}>{lbl}</span>
              <span className="text-xs font-bold" style={{ color: c }}>{val}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Connection Layer */}
      <div className="panel p-3">
        <div className="text-xs tracking-widest font-bold mb-2 flex items-center gap-1.5"
          style={{ color: '#00f5ff', fontFamily: 'Orbitron, monospace' }}>
          <Activity size={12} /> CONNECTION LAYER
        </div>
        <div className="text-center py-1 mb-1.5 rounded-sm"
          style={{ background: 'rgba(0,245,255,0.05)', border: '1px solid rgba(0,245,255,0.18)' }}>
          <div className="text-xs" style={{ color: 'rgba(0,245,255,0.45)' }}>SPRINT 4 BACKEND</div>
          <div className="font-bold text-glow-cyan mt-0.5"
            style={{ color: '#00f5ff', fontFamily: 'Orbitron, monospace', fontSize: '1rem' }}>
            ibm_marrakesh
          </div>
        </div>
        {[
          ['Qubits',   '127 active',   '#00f5ff'],
          ['Backend',  'IBM Eagle r3', '#00f5ff'],
          ['Target',   target.name,    target.colorHex],
          ['Dist',     target.dist,    target.colorHex],
          ['Status',   isTransmitting ? 'TX ACTIVE' : 'READY', isTransmitting ? '#ff00ff' : '#00ff88'],
        ].map(([lbl, val, c]) => (
          <div key={lbl} className="flex justify-between items-center py-1"
            style={{ borderBottom: '1px solid rgba(0,245,255,0.07)' }}>
            <span className="text-xs" style={{ color: 'rgba(0,245,255,0.45)' }}>{lbl}</span>
            <span className="text-xs font-bold" style={{ color: c, textShadow: `0 0 6px ${c}` }}>{val}</span>
          </div>
        ))}
      </div>

      {/* Network Telemetry */}
      <div className="panel p-3">
        <div className="text-xs tracking-widest font-bold mb-2"
          style={{ color: '#00f5ff', fontFamily: 'Orbitron, monospace' }}>
          ◈ TELEMETRY
        </div>
        {[
          ['QBER',      isQ ? '0.91%'  : '27.6%',   isQ ? '#00f5ff' : '#ff4400'],
          ['Ebit Rate', isQ ? '1.2k ep/s' : '—',    '#00f5ff'],
          ['Repeaters', isQ && target.isInterstellar ? '12+ nodes' : isQ ? '3 nodes' : '—', '#00f5ff'],
          ['Protocol',  isQ ? 'Q-CAST' : 'TCP/IP',  '#ff00ff'],
        ].map(([lbl, val, c]) => (
          <div key={lbl} className="flex justify-between py-1"
            style={{ borderBottom: '1px solid rgba(0,245,255,0.07)' }}>
            <span className="text-xs" style={{ color: 'rgba(0,245,255,0.45)' }}>{lbl}</span>
            <span className="text-xs font-bold" style={{ color: c }}>{val}</span>
          </div>
        ))}
      </div>

    </aside>
  );
}
