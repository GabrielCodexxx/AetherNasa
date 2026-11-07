import React, { useRef, useEffect, useState, useCallback } from 'react';
import { X, Wrench, Wind, CheckCircle2, RotateCcw } from 'lucide-react';
import { soundManager } from '../utils/soundEffects';

interface EvaMiniGameProps {
  onClose: () => void;
  onSuccess: () => void;
}

interface RepairTarget {
  x: number;
  y: number;
  radius: number;
  repaired: boolean;
  name: string;
}

export const EvaMiniGame: React.FC<EvaMiniGameProps> = ({ onClose, onSuccess }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Astronaut state in microgravity using Ref for smooth 60fps loop
  const playerRef = useRef({
    x: 100,
    y: 200,
    vx: 0,
    vy: 0,
  });

  const [suitO2, setSuitO2] = useState(100);
  const [gameOver, setGameOver] = useState(false);
  const [isWon, setIsWon] = useState(false);

  // 3 Target repairs on the habitat exterior
  const targetsRef = useRef<RepairTarget[]>([
    { x: 450, y: 120, radius: 24, repaired: false, name: 'Solar Wing Joint' },
    { x: 520, y: 320, radius: 24, repaired: false, name: 'Sabatier Exhaust Vent' },
    { x: 280, y: 360, radius: 24, repaired: false, name: 'Deep Space Comm Dish' },
  ]);

  const [repairedCount, setRepairedCount] = useState(0);

  // Thrust input
  const applyThrust = useCallback((dx: number, dy: number) => {
    soundManager.playBeep(440, 0.04, 'triangle');
    const p = playerRef.current;
    p.vx = Math.max(-4, Math.min(4, p.vx + dx * 0.8));
    p.vy = Math.max(-4, Math.min(4, p.vy + dy * 0.8));
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver || isWon) return;
      if (e.key === 'ArrowUp' || e.key === 'w') applyThrust(0, -1);
      if (e.key === 'ArrowDown' || e.key === 's') applyThrust(0, 1);
      if (e.key === 'ArrowLeft' || e.key === 'a') applyThrust(-1, 0);
      if (e.key === 'ArrowRight' || e.key === 'd') applyThrust(1, 0);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [applyThrust, gameOver, isWon]);

  // Main Canvas Render & Physics Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Deep space starry backdrop
      ctx.fillStyle = '#050814';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Star particles
      ctx.fillStyle = '#ffffff';
      for (let i = 0; i < 40; i++) {
        const sx = (i * 37) % canvas.width;
        const sy = (i * 61) % canvas.height;
        ctx.fillRect(sx, sy, 1.5, 1.5);
      }

      // Draw Habitat Exterior Hull Outline
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 4;
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.roundRect(180, 80, 400, 280, 20);
      ctx.fill();
      ctx.stroke();

      // Habitat label
      ctx.fillStyle = '#64748b';
      ctx.font = '12px monospace';
      ctx.fillText('OUTPOST HABITAT CORE - EXTERIOR HULL', 210, 110);

      // Draw Targets
      targetsRef.current.forEach((t) => {
        ctx.beginPath();
        ctx.arc(t.x, t.y, t.radius, 0, Math.PI * 2);
        if (t.repaired) {
          ctx.fillStyle = '#065f46';
          ctx.strokeStyle = '#10b981';
        } else {
          ctx.fillStyle = '#7f1d1d';
          ctx.strokeStyle = '#ef4444';
        }
        ctx.lineWidth = 2;
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = '10px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(t.repaired ? '✓ OK' : 'REPAIR', t.x, t.y + 3);
        ctx.fillText(t.name, t.x, t.y + 35);
      });

      // Update Player Physics in microgravity
      const p = playerRef.current;
      p.x += p.vx;
      p.y += p.vy;

      // Friction / drag in space
      p.vx *= 0.98;
      p.vy *= 0.98;

      // Canvas bounds bounce
      if (p.x < 20 || p.x > canvas.width - 20) p.x = Math.max(20, Math.min(canvas.width - 20, p.x));
      if (p.y < 20 || p.y > canvas.height - 20) p.y = Math.max(20, Math.min(canvas.height - 20, p.y));

      // Check target collision & repair
      targetsRef.current.forEach((t) => {
        if (!t.repaired) {
          const dist = Math.hypot(p.x - t.x, p.y - t.y);
          if (dist < t.radius + 15) {
            t.repaired = true;
            soundManager.playSuccessChime();
            setRepairedCount((prev) => {
              const updated = prev + 1;
              if (updated === targetsRef.current.length) {
                setIsWon(true);
                onSuccess();
              }
              return updated;
            });
          }
        }
      });

      // Draw Astronaut
      ctx.save();
      ctx.translate(p.x, p.y);

      // Safety Tether Line to airlock
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(80 - p.x, 180 - p.y);
      ctx.stroke();

      // Helmet & Suit
      ctx.fillStyle = '#e2e8f0';
      ctx.beginPath();
      ctx.arc(0, 0, 14, 0, Math.PI * 2);
      ctx.fill();

      // Gold Visor
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(4, 0, 8, -Math.PI / 2, Math.PI / 2);
      ctx.fill();

      // MMU Backpack
      ctx.fillStyle = '#475569';
      ctx.fillRect(-18, -10, 8, 20);

      ctx.restore();

      if (!gameOver && !isWon) {
        animId = requestAnimationFrame(render);
      }
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [gameOver, isWon, onSuccess]);

  // Suit O2 consumption countdown
  useEffect(() => {
    if (gameOver || isWon) return;
    const timer = setInterval(() => {
      setSuitO2((prev) => {
        if (prev <= 1) {
          setGameOver(true);
          soundManager.playAlertSiren();
          return 0;
        }
        return prev - 1;
      });
    }, 400);

    return () => clearInterval(timer);
  }, [gameOver, isWon]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-3xl bg-slate-900 border border-cyan-500/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-slate-950 px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">EVA Spacewalk Repair Simulator</h2>
              <p className="text-xs text-slate-400">
                Maneuver using thrusters to inspect and repair habitat hull sensors.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Suit O2 Bar */}
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-xs font-mono">
              <Wind className="w-4 h-4 text-cyan-400" />
              <span className="text-slate-300">Suit O₂:</span>
              <span className={`font-bold ${suitO2 < 25 ? 'text-red-400 animate-pulse' : 'text-cyan-300'}`}>
                {suitO2}%
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="relative bg-slate-950 flex justify-center items-center">
          <canvas
            ref={canvasRef}
            width={720}
            height={440}
            className="w-full h-auto max-h-[460px] cursor-crosshair"
          />

          {/* Win Overlay */}
          {isWon && (
            <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center text-center p-6 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mb-3 text-emerald-400">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">EVA Drill Complete!</h3>
              <p className="text-sm text-slate-300 max-w-md mb-5">
                All 3 exterior hull systems have been restored to 100% nominal. NASA Spacewalk Specialist badge unlocked!
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/20 transition-all"
              >
                Return to Cockpit
              </button>
            </div>
          )}

          {/* Fail Overlay */}
          {gameOver && !isWon && (
            <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center text-center p-6 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center mb-3 text-red-400">
                <Wind className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">Suit O₂ Depleted!</h3>
              <p className="text-sm text-slate-300 max-w-md mb-5">
                Emergency tether retraction engaged to pull cadet back into the airlock.
              </p>
              <button
                onClick={() => {
                  setSuitO2(100);
                  setGameOver(false);
                  setRepairedCount(0);
                  playerRef.current = { x: 100, y: 200, vx: 0, vy: 0 };
                  targetsRef.current.forEach((t) => (t.repaired = false));
                }}
                className="flex items-center gap-2 px-6 py-2.5 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-xl shadow-lg transition-all"
              >
                <RotateCcw className="w-4 h-4" /> Try Drill Again
              </button>
            </div>
          )}
        </div>

        {/* Thruster Controls & Instructions Footer */}
        <div className="bg-slate-950 p-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="text-xs text-slate-400 font-mono">
            Repairs completed: <span className="text-cyan-300 font-bold">{repairedCount}/3</span> &bull; Use Arrow Keys / WASD
          </div>

          {/* D-Pad Buttons for Touch / Mouse */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => applyThrust(-1, 0)}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs rounded border border-slate-700"
            >
              ← Left
            </button>
            <div className="flex flex-col gap-1">
              <button
                onClick={() => applyThrust(0, -1)}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs rounded border border-slate-700"
              >
                ↑ Up
              </button>
              <button
                onClick={() => applyThrust(0, 1)}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs rounded border border-slate-700"
              >
                ↓ Down
              </button>
            </div>
            <button
              onClick={() => applyThrust(1, 0)}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs rounded border border-slate-700"
            >
              → Right
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EvaMiniGame;
