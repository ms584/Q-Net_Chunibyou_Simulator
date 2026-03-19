import React, { useEffect, useRef } from 'react';
import { SYSTEMS } from '../systems';

/*
  SpaceCanvas - renders Earth on the left and the selected target (Mars/star) on the right.
  Mode 'classic' → slow yellow TCP packets bounce back and forth.
  Mode 'qnet'   → magenta warp burst fires toward the target.
  isTransmitting flag triggers an immediate "Execute Warp" burst animation.
*/
export default function SpaceCanvas({ mode, targetKey, isTransmitting }) {
  const canvasRef = useRef(null);
  const animRef   = useRef(null);
  const stateRef  = useRef({
    frame: 0,
    stars: [],
    classicPackets: [],
    warpPacket: null,
    executeBurst: false,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener('resize', resize);

    // Generate star field once
    const s = stateRef.current;
    s.stars = Array.from({ length: 200 }, () => ({
      x: Math.random(), y: Math.random(),
      r: Math.random() * 1.6 + 0.2,
      a: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.004 + 0.001,
    }));
    s.classicPackets = [];
    s.warpPacket = null;
    s.frame = 0;

    const getLayout = () => {
      const W = canvas.width, H = canvas.height;
      return { W, H, ex: W * 0.20, ey: H * 0.50, tx: W * 0.80, ty: H * 0.50 };
    };

    // Spawn idle animation loops
    const spawnClassic = () => {
      const { ex, ey, tx, ty } = getLayout();
      for (let i = 0; i < 3; i++) {
        setTimeout(() => {
          s.classicPackets.push({ t: 0, dir: 1, speed: 0.0014, ex, ey, tx, ty });
        }, i * 2400);
      }
    };
    const spawnWarp = () => {
      const { ex, ey, tx } = getLayout();
      s.warpPacket = { t: 0, speed: 0.03, ex, ey, tx, arrived: false };
    };

    if (mode === 'classic') spawnClassic(); else spawnWarp();

    const tgt = SYSTEMS[targetKey];

    const drawPlanet = (ctx, x, y, radius, gradColors, glowColor, label, sublabel, rings = false) => {
      const g = ctx.createRadialGradient(x - radius * 0.3, y - radius * 0.3, radius * 0.05, x, y, radius);
      gradColors.forEach(([stop, col]) => g.addColorStop(stop, col));
      ctx.shadowColor = glowColor; ctx.shadowBlur = 30;
      ctx.beginPath(); ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = g; ctx.fill();
      ctx.shadowBlur = 0;
      // Glow ring
      ctx.beginPath(); ctx.arc(x, y, radius + 8, 0, Math.PI * 2);
      ctx.strokeStyle = glowColor + '55'; ctx.lineWidth = 3; ctx.stroke();
      // Saturn-style rings for interstellar targets
      if (rings) {
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(1, 0.25);
        ctx.beginPath();
        ctx.arc(0, 0, radius + 20, 0, Math.PI * 2);
        ctx.strokeStyle = glowColor + '44'; ctx.lineWidth = 6; ctx.stroke();
        ctx.restore();
      }
      // Label
      ctx.shadowColor = glowColor; ctx.shadowBlur = 8;
      ctx.fillStyle = glowColor; ctx.font = 'bold 12px Orbitron, monospace';
      ctx.textAlign = 'center';
      ctx.fillText(label, x, y + radius + 22);
      ctx.font = '9px Share Tech Mono, monospace';
      ctx.fillStyle = glowColor + 'aa';
      ctx.fillText(sublabel, x, y + radius + 35);
      ctx.shadowBlur = 0;
    };

    const draw = () => {
      const { W, H, ex, ey, tx, ty } = getLayout();
      ctx.clearRect(0, 0, W, H);

      // Deep space gradient bg
      const bg = ctx.createRadialGradient(W * 0.5, H * 0.5, 0, W * 0.5, H * 0.5, Math.max(W, H) * 0.8);
      bg.addColorStop(0, '#060d1e'); bg.addColorStop(1, '#030710');
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

      s.frame++;

      // Stars
      s.stars.forEach(st => {
        st.a += st.speed;
        const alpha = Math.sin(st.a) * 0.45 + 0.55;
        ctx.beginPath(); ctx.arc(st.x * W, st.y * H, st.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200,230,255,${alpha * 0.85})`; ctx.fill();
      });

      // Entanglement fabric (ambient bezier lines)
      for (let i = 0; i < 5; i++) {
        const angle = (i / 5) * Math.PI + s.frame * 0.002;
        const ox = Math.cos(angle) * 45, oy = Math.sin(angle) * 20;
        const grad = ctx.createLinearGradient(ex + ox, ey + oy, tx - ox, ty - oy);
        const a1 = (Math.sin(s.frame * 0.015 + i) * 0.08 + 0.06);
        grad.addColorStop(0,   `rgba(0,245,255,${a1})`);
        grad.addColorStop(0.5, `rgba(${tgt.isInterstellar ? '255,0,255' : '0,200,255'},${a1 * 0.5})`);
        grad.addColorStop(1,   `rgba(0,245,255,${a1})`);
        ctx.strokeStyle = grad; ctx.lineWidth = 1;
        const cy = (ey + ty) / 2 + Math.sin(s.frame * 0.012 + i * 1.3) * 35;
        ctx.beginPath();
        ctx.moveTo(ex + ox, ey + oy);
        ctx.bezierCurveTo(ex + (tx - ex) * 0.35, cy - 15, ex + (tx - ex) * 0.65, cy + 15, tx - ox, ty - oy);
        ctx.stroke();
      }

      // EARTH — always on the left
      drawPlanet(ctx, ex, ey, 50, [
        [0, '#1a8fe0'], [0.45, '#0a5ca8'], [0.85, '#083870'], [1, '#020d22']
      ], '#00aaff', 'EARTH', 'NODE-A // ORIGIN');

      // TARGET — right side, colored per system
      const isInterstellar = tgt.isInterstellar;
      const targetRadius = isInterstellar ? 36 : 40;
      const [r1, r2, r3] = isInterstellar
        ? [tgt.colorHex + 'ee', tgt.colorHex + '88', tgt.colorHex + '22']
        : ['#e04a1a', '#b03010', '#300800'];
      drawPlanet(ctx, tx, ty, targetRadius, [
        [0, r1], [0.5, r2], [1, r3]
      ], tgt.colorHex, tgt.name.toUpperCase(), tgt.subtitle, isInterstellar);

      // For interstellar: draw "light years" distance text on the link
      if (isInterstellar) {
        ctx.font = '9px Share Tech Mono, monospace';
        ctx.textAlign = 'center';
        ctx.fillStyle = 'rgba(0,245,255,0.35)';
        ctx.fillText(`◈ ${tgt.dist} ◈`, (ex + tx) / 2, ey - 28);
      }

      //--- CLASSIC packets ---
      if (mode === 'classic') {
        s.classicPackets = s.classicPackets.filter(p => {
          p.t += p.speed;
          const x = p.dir === 1
            ? p.ex + (p.tx - p.ex) * p.t
            : p.tx + (p.ex - p.tx) * p.t;
          // packet dot
          ctx.beginPath(); ctx.arc(x, p.ey, 5, 0, Math.PI * 2);
          ctx.fillStyle = '#fbbf24'; ctx.shadowColor = '#fbbf24'; ctx.shadowBlur = 14; ctx.fill(); ctx.shadowBlur = 0;
          // trail
          for (let i = 1; i <= 7; i++) {
            const tx2 = p.dir === 1
              ? p.ex + (p.tx - p.ex) * Math.max(0, p.t - i * p.speed * 9)
              : p.tx + (p.ex - p.tx) * Math.max(0, p.t - i * p.speed * 9);
            ctx.beginPath(); ctx.arc(tx2, p.ey, 3 - i * 0.35, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(251,191,36,${0.35 - i * 0.045})`; ctx.fill();
          }
          if (p.t >= 1) { p.t = 0; p.dir *= -1; }
          return true;
        });
      }

      //--- Q-Net warp packet ---
      if (mode === 'qnet' && s.warpPacket) {
        const p = s.warpPacket;
        p.t += p.speed;
        if (p.t < 1) {
          const x = p.ex + (p.tx - p.ex) * p.t;
          // warp packet
          ctx.beginPath(); ctx.arc(x, p.ey, 7, 0, Math.PI * 2);
          ctx.fillStyle = '#ff00ff'; ctx.shadowColor = '#ff00ff'; ctx.shadowBlur = 28; ctx.fill(); ctx.shadowBlur = 0;
          // warp trail
          const trailW = ctx.createLinearGradient(Math.max(p.ex, x - 80), p.ey, x, p.ey);
          trailW.addColorStop(0, 'rgba(255,0,255,0)'); trailW.addColorStop(1, 'rgba(255,0,255,0.55)');
          ctx.strokeStyle = trailW; ctx.lineWidth = 3;
          ctx.beginPath(); ctx.moveTo(Math.max(p.ex, x - 80), p.ey); ctx.lineTo(x, p.ey); ctx.stroke();
        } else {
          // Arrival burst
          const age = p.t - 1;
          for (let i = 0; i < 14; i++) {
            const ang = (i / 14) * Math.PI * 2;
            const r = Math.min(age * 55, 50);
            const alpha = Math.max(0, 1 - age * 1.8);
            ctx.beginPath(); ctx.moveTo(p.tx, p.ey);
            ctx.lineTo(p.tx + Math.cos(ang) * r, p.ey + Math.sin(ang) * r);
            ctx.strokeStyle = `rgba(255,0,255,${alpha})`; ctx.lineWidth = 1.5; ctx.stroke();
          }
          if (age > 1.6) s.warpPacket = { t: 0, speed: 0.03, ex: p.ex, ey: p.ey, tx: p.tx };
        }
      }

      //--- Execute Warp burst (extra bright flash on isTransmitting) ---
      if (isTransmitting && mode === 'qnet') {
        const flash = Math.sin(s.frame * 0.4) * 0.3 + 0.25;
        ctx.beginPath(); ctx.arc(tx, ty, targetRadius + 18, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255,0,255,${flash})`; ctx.lineWidth = 4; ctx.stroke();
      }

      // Mode banner
      ctx.textAlign = 'center';
      ctx.font = 'bold 10px Orbitron, monospace';
      if (mode === 'classic') {
        ctx.fillStyle = '#fbbf24'; ctx.shadowColor = '#fbbf24'; ctx.shadowBlur = 6;
        ctx.fillText(`▶ CLASSIC TCP/IP  —  HANDSHAKE RTT: ${tgt.handshake.toUpperCase()}`, W * 0.5, H * 0.10);
      } else {
        ctx.fillStyle = '#ff00ff'; ctx.shadowColor = '#ff00ff'; ctx.shadowBlur = 6;
        ctx.fillText(`⚡ Q-NET WARP ACTIVE  —  TO: ${tgt.name.toUpperCase()}  —  SETUP: < 0.001 ms`, W * 0.5, H * 0.10);
      }
      ctx.shadowBlur = 0;

      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => { window.removeEventListener('resize', resize); cancelAnimationFrame(animRef.current); };
  }, [mode, targetKey, isTransmitting]);

  return <canvas ref={canvasRef} className="w-full h-full" style={{ display: 'block' }} />;
}
