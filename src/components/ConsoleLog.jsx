import React, { useEffect, useRef, useState } from 'react';
import { Terminal } from 'lucide-react';
import { SYSTEMS } from '../systems';

// Log templates keyed by mode+targetKey
const makeLogs = (mode, targetKey) => {
  const tgt = SYSTEMS[targetKey];
  if (mode === 'qnet') return [
    { t: 'SYS',   txt: `Q-Net subsystem initialized. ibm_marrakesh backend connected.` },
    { t: 'QCAST', txt: `Q-CAST routing table loaded. Destination: ${tgt.name} (${tgt.dist}).` },
    { t: 'MOD',   txt: `Collapse Modulation armed. Bell pair buffer: ${tgt.isInterstellar ? '4096' : '1024'} epr-pairs.` },
    { t: 'MOD',   txt: `Error correction: [SURFACE-17]. Syndrome extraction ready.` },
    { t: 'QCAST', txt: `Entanglement swap chain: EARTH → ${tgt.isInterstellar ? 'L1 → RELAY-A → RELAY-B →' : 'L1 →'} ${tgt.name.toUpperCase()}. Fidelity: 99.09%` },
    { t: 'SYS',   txt: `Teleportation channel locked. Classical side-channel ACK pending.` },
    { t: 'MOD',   txt: `DETECT: bit-flip on qubit [q44]. Pauli-X correction applied.` },
    { t: 'MOD',   txt: `Logical qubit restored. Channel fidelity maintained at 99.09%.` },
    { t: 'QCAST', txt: `Q-CAST TX → ${tgt.name.toUpperCase()}. Warp time: 0.00031 ms. SUCCESS ✓` },
    { t: 'SYS',   txt: `Latency advantage: ${tgt.handshake} vs. classical ${tgt.handshake} RTT.` },
    { t: 'MOD',   txt: `Phase coherence nominal. Decoherence timer: 82 ms remaining.` },
    { t: 'QCAST', txt: `Path entropy: 0.042 bits. Routing optimal.` },
  ];
  return [
    { t: 'TCP',  txt: `SYN → ${tgt.name.toUpperCase()}. EM signal at c. Estimated transit: ${tgt.dist}.` },
    { t: 'TCP',  txt: `Awaiting SYN-ACK. Expected one-way delay: ${tgt.handshake}.` },
    { t: 'WARN', txt: `WARNING: Interplanetary/Interstellar TCP latency is prohibitive.` },
    { t: 'TCP',  txt: `[${tgt.handshake} elapsed] SYN-ACK received — IF EVER.` },
    { t: 'TCP',  txt: `ACK dispatched → ${tgt.name.toUpperCase()}. RTT: ${tgt.handshake}.` },
    { t: 'WARN', txt: `CRITICAL: Effective throughput ≈ 0 bps. Protocol timeout imminent.` },
    { t: 'TCP',  txt: `TCP window exhausted. Congestion backoff. Retransmit unavoidable.` },
    { t: 'WARN', txt: `Handshake FAILED. Latency exceeds all protocol timers.` },
  ];
};

// Warp-specific "Execute" log entries
const makeExecuteLogs = (mode, targetKey) => {
  const tgt = SYSTEMS[targetKey];
  if (mode === 'qnet') return [
    { t: 'MOD',     txt: `⚡ EXECUTE WARP initiated → ${tgt.name.toUpperCase()}.` },
    { t: 'MOD',     txt: `Encoding 256 qubits. Applying Collapse Modulation.` },
    { t: 'QCAST',   txt: `Warp packet dispatched. Entanglement channeled.` },
    { t: 'SUCCESS', txt: `Data teleported to ${tgt.name}. Fidelity: 99.09%. SUCCESS ✓` },
  ];
  return [
    { t: 'TCP',  txt: `SYN → ${tgt.name.toUpperCase()}. Awaiting response for ${tgt.handshake}...` },
    { t: 'WARN', txt: `Timeout after 30s. Handshake FAILED — interstellar latency.` },
  ];
};

const TYPE_COLOR = {
  SYS:     '#00f5ff',
  QCAST:   '#ff00ff',
  MOD:     '#00ff88',
  TCP:     '#fbbf24',
  WARN:    '#f87171',
  SUCCESS: '#a78bfa',
};

export default function ConsoleLog({ logTrigger }) {
  const [entries, setEntries] = useState([]);
  const [modeTarget, setModeTarget] = useState({ mode: 'qnet', targetKey: 'MARS' });
  const [idx, setIdx] = useState(0);
  const scrollRef = useRef(null); // ref on the scroll container, not a bottom sentinel

  // When mode/target changes, drain the new log sequence
  useEffect(() => {
    if (!logTrigger) return;
    const { mode, targetKey, type } = logTrigger;
    if (type === 'warp' || type === 'tcp') {
      // Execute burst — prepend 4 special entries then continue normal
      const burst = makeExecuteLogs(mode, targetKey);
      burst.forEach((entry, i) => {
        setTimeout(() => {
          const ts = new Date();
          const stamp = `${String(ts.getHours()).padStart(2,'0')}:${String(ts.getMinutes()).padStart(2,'0')}:${String(ts.getSeconds()).padStart(2,'0')}.${String(ts.getMilliseconds()).padStart(3,'0')}`;
          setEntries(prev => [...prev, { ...entry, ts: stamp, id: Date.now() + i }]);
        }, i * 380);
      });
    } else {
      // mode/target switch — reset and replay
      setModeTarget({ mode, targetKey });
      setEntries([]);
      setIdx(0);
    }
  }, [logTrigger]);

  // Stream background logs
  useEffect(() => {
    const templates = makeLogs(modeTarget.mode, modeTarget.targetKey);
    if (idx >= templates.length) return;
    const delay = 750 + Math.random() * 550;
    const t = setTimeout(() => {
      const entry = templates[idx];
      const ts = new Date();
      const stamp = `${String(ts.getHours()).padStart(2,'0')}:${String(ts.getMinutes()).padStart(2,'0')}:${String(ts.getSeconds()).padStart(2,'0')}.${String(ts.getMilliseconds()).padStart(3,'0')}`;
      setEntries(prev => [...prev, { ...entry, ts: stamp, id: Date.now() }]);
      setIdx(i => i + 1);
    }, delay);
    return () => clearTimeout(t);
  }, [idx, modeTarget]);

  // Scroll only within the log container — NOT scrollIntoView (which scrolls the whole page on mobile)
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [entries]);

  return (
    <div className="panel flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-1.5"
        style={{ borderBottom: '1px solid rgba(0,245,255,0.13)', flexShrink: 0 }}>
        <div className="flex items-center gap-2">
          <span className="pulse-dot" style={{
            background: modeTarget.mode === 'qnet' ? '#00ff88' : '#fbbf24',
            boxShadow: modeTarget.mode === 'qnet' ? '0 0 8px #00ff88' : '0 0 8px #fbbf24',
          }} />
          <Terminal size={11} style={{ color: '#00f5ff' }} />
          <span className="text-xs font-bold tracking-widest"
            style={{ color: '#00f5ff', fontFamily: 'Orbitron, monospace' }}>
            SYSTEM CONSOLE
          </span>
        </div>
        <div className="text-xs" style={{ color: 'rgba(0,245,255,0.35)' }}>
          {modeTarget.mode === 'qnet' ? 'COLLAPSE MOD · Q-CAST' : 'CLASSIC TCP/IP'}
        </div>
      </div>

      {/* Log stream — ref is on the scrollable container itself */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-2 font-mono text-xs" style={{ lineHeight: 1.75 }}>
        {entries.map(e => (
          <div key={e.id} className="flex gap-2 items-start" style={{ animation: 'fadeIn 0.25s ease' }}>
            <span style={{ color: 'rgba(0,245,255,0.28)', minWidth: 88, flexShrink: 0 }}>[{e.ts}]</span>
            <span className="font-bold" style={{
              color: TYPE_COLOR[e.t] || '#00f5ff',
              textShadow: `0 0 5px ${TYPE_COLOR[e.t] || '#00f5ff'}`,
              minWidth: 52, flexShrink: 0,
            }}>{e.t}</span>
            <span style={{ color: 'rgba(195,235,255,0.82)' }}>{e.txt}</span>
          </div>
        ))}
        <div style={{ display: 'flex', gap: 8 }}>
          <span style={{ minWidth: 88 }} />
          <span style={{ color: '#00f5ff', animation: 'pulse-dot 0.9s ease-in-out infinite' }}>▌</span>
        </div>
      </div>
    </div>
  );
}
