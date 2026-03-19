import React, { useState, useEffect, useCallback } from 'react';
import { Zap } from 'lucide-react';
import Header from './components/Header';
import SpaceCanvas from './components/SpaceCanvas';
import StatsSidebar from './components/StatsSidebar';
import ControlPanel from './components/ControlPanel';
import ConsoleLog from './components/ConsoleLog';
import { SYSTEMS } from './systems';

export default function App() {
  const [mode, setMode] = useState('qnet');            // 'qnet' | 'classic'
  const [targetKey, setTargetKey] = useState('MARS');  // key in SYSTEMS
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [logTrigger, setLogTrigger] = useState(null);  // { mode, targetKey, type: 'warp'|'tcp' }

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
    <div className="flex flex-col" style={{ height: '100dvh', overflow: 'hidden', background: 'var(--dark-bg)' }}>

      {/* HEADER */}
      <Header target={target} />

      {/* MAIN BODY */}
      <div className="flex flex-1 overflow-hidden" style={{ minHeight: 0 }}>

        {/* CENTER: canvas + controls + console */}
        <div className="flex flex-col flex-1 overflow-hidden" style={{ minWidth: 0 }}>

          {/* Canvas visualization */}
          <div className="relative panel flex-1"
            style={{ margin: '8px 4px 4px 8px', minHeight: 0, overflow: 'hidden' }}>
            <div className="absolute top-2 left-5 text-xs tracking-widest z-10"
              style={{ color: 'rgba(0,245,255,0.4)', fontFamily: 'Orbitron, monospace' }}>
              ENTANGLEMENT FABRIC // LIVE VIEW
            </div>
            <div className="absolute top-2 right-5 text-xs z-10"
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

          {/* Bottom row */}
          <div className="flex" style={{ height: 210, flexShrink: 0 }}>
            <div style={{ width: 340, flexShrink: 0, margin: '4px 2px 8px 8px' }}>
              <ControlPanel
                mode={mode} setMode={setMode}
                targetKey={targetKey} setTargetKey={setTargetKey}
                isTransmitting={isTransmitting}
                onExecute={runTransmission}
              />
            </div>
            <div className="flex-1" style={{ margin: '4px 4px 8px 2px', minWidth: 0 }}>
              <ConsoleLog logTrigger={logTrigger} />
            </div>
          </div>
        </div>

        {/* RIGHT sidebar */}
        <div className="flex flex-col gap-2 overflow-y-auto"
          style={{ width: 290, flexShrink: 0, padding: '8px 8px 8px 4px' }}>
          <StatsSidebar mode={mode} target={target} isTransmitting={isTransmitting} />
        </div>
      </div>
    </div>
  );
}
