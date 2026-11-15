import { type FC, useEffect, useRef } from 'react';
import type { EarthSystemTrend, TrendDataPoint } from '../../types/earthSystem';
import { getCurrentTrendIndex, getDomainColor } from './inspectorMath';

interface TrendSparklineCanvasProps {
  trend: EarthSystemTrend;
  currentYear: number;
  compareTrend?: EarthSystemTrend;
}

interface SeriesGeometry {
  minVal: number;
  range: number;
  denom: number;
}

function traceSeriesPath(
  ctx: CanvasRenderingContext2D,
  series: TrendDataPoint[],
  width: number,
  height: number
): SeriesGeometry {
  const first = series[0];
  let minVal = first ? first.value : 0;
  let maxVal = first ? first.value : 0;
  for (let i = 1; i < series.length; i++) {
    const pt = series[i];
    if (!pt) continue;
    if (pt.value < minVal) minVal = pt.value;
    if (pt.value > maxVal) maxVal = pt.value;
  }

  const range = Math.max(0.1, maxVal - minVal);
  const denom = Math.max(1, series.length - 1);

  ctx.beginPath();
  series.forEach((pt, idx) => {
    const x = (idx / denom) * width;
    const y = height - 14 - ((pt.value - minVal) / range) * (height - 28);
    if (idx === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });

  return { minVal, range, denom };
}

/** Renders the 1980-2026 trend sparkline canvas with crosshair and optional comparison overlay. */
export const TrendSparklineCanvas: FC<TrendSparklineCanvasProps> = ({
  trend,
  currentYear,
  compareTrend,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    // Clean crisp slate background
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, w, h);

    // Metric grid
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    for (let y = 14; y < h; y += 22) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    const series = trend.timeSeries;
    if (series.length === 0) return;

    const domainColor = getDomainColor(trend.domain);

    // Area gradient fill
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, `${domainColor}24`);
    grad.addColorStop(1, '#f8fafc00');

    traceSeriesPath(ctx, series, w, h);
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // Secondary cross-correlation curve when provided
    if (compareTrend && compareTrend.timeSeries.length > 0) {
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1.8;
      ctx.setLineDash([4, 3]);
      traceSeriesPath(ctx, compareTrend.timeSeries, w, h);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Main trend curve
    ctx.strokeStyle = domainColor;
    ctx.lineWidth = 2.4;
    const { minVal, range, denom } = traceSeriesPath(ctx, series, w, h);
    ctx.stroke();

    // Precision vertical crosshair cursor
    const curIdx = getCurrentTrendIndex(series.length, currentYear);
    const curPoint = series[curIdx] ?? series[series.length - 1];
    if (!curPoint) return;
    const curX = (curIdx / denom) * w;
    const curY = h - 14 - ((curPoint.value - minVal) / range) * (h - 28);

    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1.2;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(curX, 0);
    ctx.lineTo(curX, h);
    ctx.stroke();
    ctx.setLineDash([]);

    // Diamond crosshair reticle (no circular markers)
    ctx.fillStyle = domainColor;
    ctx.beginPath();
    ctx.moveTo(curX, curY - 5);
    ctx.lineTo(curX + 5, curY);
    ctx.lineTo(curX, curY + 5);
    ctx.lineTo(curX - 5, curY);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }, [trend, currentYear, compareTrend]);

  return (
    <canvas
      ref={canvasRef}
      width={320}
      height={95}
      className="w-full h-24 rounded-xl bg-slate-50 border border-slate-200/60"
    />
  );
};
