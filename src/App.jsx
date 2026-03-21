import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import SpaceCanvas from './components/SpaceCanvas';
import StatsSidebar from './components/StatsSidebar';
import ControlPanel from './components/ControlPanel';
import ConsoleLog from './components/ConsoleLog';
import { SYSTEMS } from './systems';

export default function App() {
  const [mode, setMode] = useState('qnet');
  const [targetKey, setTargetKey] = useState('MARS');
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [logTrigger, setLogTrigger] = useState(null);

  const target = SYSTEMS[targetKey];

  const runTransmission = useCallback(() => {
    if (isTransmitting) return;
    setIsTransmitting(true);
    const type = mode === 'qnet' ? 'warp' : 'tcp';
    setLogTrigger({ mode, targetKey, type, stamp: Date.now() });
    const delay = mode === 'qnet' ? 1600 : 3200;
    setTimeout(() => setIsTransmitting(false), delay);
  }, [mode, targetKey, isTransmitting]);

  return (
    <div className="app-root">
      <Header target={target} />

      <div className="app-body">

        {/* ── CENTER COLUMN (desktop only wrapper) ── */}
        <div className="app-center">

          {/* Canvas */}
          <div className="canvas-wrap panel">
            <div className="canvas-badge-left absolute top-2 left-5 text-xs tracking-widest z-10"
              style={{ color: 'rgba(0,245,255,0.4)', fontFamily: 'Orbitron, monospace' }}>
              ENTANGLEMENT FABRIC // LIVE VIEW
            </div>
            <div className="canvas-badge-right absolute top-2 right-5 text-xs z-10"
              style={{ color: 'rgba(0,245,255,0.3)' }}>
              {target.isInterstellar ? 'INTERSTELLAR' : 'INTERPLANETARY'} · SPRINT-4
            </div>
            {/* Corner brackets */}
            {[['top-0 left-0','border-t-2 border-l-2'],['top-0 right-0','border-t-2 border-r-2'],
              ['bottom-0 left-0','border-b-2 border-l-2'],['bottom-0 right-0','border-b-2 border-r-2']]
              .map(([pos, bdr]) => (
                <div key={pos} className={`absolute w-4 h-4 ${pos} ${bdr}`}
                  style={{ borderColor: '#00f5ff' }} />
              ))}
            <SpaceCanvas mode={mode} targetKey={targetKey} isTransmitting={isTransmitting} />
          </div>

          {/* Bottom row: Control + Console */}
          <div className="bottom-row">
            <div className="control-wrap">
              <ControlPanel
                mode={mode} setMode={setMode}
                targetKey={targetKey} setTargetKey={setTargetKey}
                isTransmitting={isTransmitting}
                onExecute={runTransmission}
              />
            </div>
            <div className="console-wrap">
              <ConsoleLog logTrigger={logTrigger} />
            </div>
          </div>
        </div>

        {/* ── RIGHT SIDEBAR ── */}
        <div className="app-sidebar">
          <StatsSidebar mode={mode} target={target} isTransmitting={isTransmitting} />
        </div>

      </div>
    </div>
  );
}
