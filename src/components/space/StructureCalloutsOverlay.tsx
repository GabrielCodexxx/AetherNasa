import React from 'react';
import type { StructureCallout } from './types';

interface StructureCalloutsOverlayProps {
  callouts: StructureCallout[];
}

/**
 * SVG leader lines and glassmorphic callout cards for planetary interior cutaway mode.
 */
export const StructureCalloutsOverlay: React.FC<StructureCalloutsOverlayProps> = ({
  callouts,
}) => {
  if (callouts.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-20">
      <svg className="w-full h-full">
        {callouts.map((c, i) => (
          <g key={i}>
            <rect
              x={c.startX - 3.5}
              y={c.startY - 3.5}
              width={7}
              height={7}
              fill={c.color}
              transform={`rotate(45 ${c.startX} ${c.startY})`}
            />
            <polyline
              points={`${c.startX},${c.startY} ${c.startX + 26},${c.endY} ${c.endX},${c.endY}`}
              fill="none"
              stroke={c.color}
              strokeWidth={1.8}
              strokeDasharray="4,2"
              opacity={0.9}
            />
            <rect
              x={c.endX - 2}
              y={c.endY - 2}
              width={4}
              height={4}
              fill={c.color}
            />
          </g>
        ))}
      </svg>

      {callouts.map((c, i) => (
        <div
          key={i}
          className="absolute pointer-events-none font-sans select-none"
          style={{
            left: `${c.endX + 10}px`,
            top: `${c.endY - 26}px`,
            maxWidth: '240px',
          }}
        >
          <div className="bg-white/92 backdrop-blur-md border border-slate-200/90 rounded-2xl px-3.5 py-2 shadow-lg shadow-slate-200/60 max-w-[240px]">
            <div className="flex items-center gap-2">
              <span
                className="w-2 h-2 rotate-45 shrink-0"
                style={{ backgroundColor: c.color }}
              />
              <span className="text-xs font-orbitron font-extrabold tracking-tight text-slate-900 uppercase truncate">
                {c.name}
              </span>
            </div>
            <div className="text-[10px] font-orbitron font-bold uppercase tracking-wider text-[#0369A1] mt-0.5">
              {c.subtitle}
            </div>
            <div className="text-[9px] font-space text-slate-500 truncate">
              {c.composition}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
