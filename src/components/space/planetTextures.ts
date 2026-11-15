import { createGasGiantTextureMap } from './gasPlanetTextures';

/**
 * Shared 2D canvas factory and terrestrial planet procedural surface textures.
 */
export function createCanvas2D(
  width: number,
  height: number
): { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D } {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  return { canvas, ctx };
}

export function fillLinearGradient(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  width: number,
  height: number,
  stops: ReadonlyArray<readonly [number, string]>
): void {
  const grad = ctx.createLinearGradient(x1, y1, x2, y2);
  for (const [offset, color] of stops) {
    grad.addColorStop(offset, color);
  }
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);
}

function generateMercuryCanvas(): HTMLCanvasElement {
  const { canvas, ctx } = createCanvas2D(1024, 512);
  ctx.fillStyle = '#64748b';
  ctx.fillRect(0, 0, 1024, 512);

  for (let i = 0; i < 280; i++) {
    const x = (i * 173) % 1024;
    const y = (i * 97) % 512;
    const r = (i % 9) + 2;

    ctx.fillStyle = '#334155';
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI);
    ctx.stroke();
  }

  ctx.fillStyle = '#475569';
  ctx.beginPath();
  ctx.arc(420, 260, 65, 0, Math.PI * 2);
  ctx.fill();
  return canvas;
}

function generateVenusCanvas(): HTMLCanvasElement {
  const { canvas, ctx } = createCanvas2D(1024, 512);
  fillLinearGradient(ctx, 0, 0, 0, 512, 1024, 512, [
    [0, '#fef08a'],
    [0.2, '#fde047'],
    [0.5, '#eab308'],
    [0.8, '#facc15'],
    [1, '#fef08a'],
  ]);

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.28)';
  ctx.lineWidth = 12;
  for (let i = 0; i < 24; i++) {
    const y = i * 22;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.bezierCurveTo(340, y + 25, 680, y - 25, 1024, y);
    ctx.stroke();
  }
  return canvas;
}

function generateMarsCanvas(): HTMLCanvasElement {
  const { canvas, ctx } = createCanvas2D(1024, 512);
  ctx.fillStyle = '#c2410c';
  ctx.fillRect(0, 0, 1024, 512);

  ctx.fillStyle = '#7c2d12';
  ctx.beginPath();
  ctx.ellipse(450, 260, 140, 75, 0.2, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.ellipse(750, 310, 200, 45, -0.1, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 1024, 32);
  ctx.fillRect(0, 480, 1024, 32);
  return canvas;
}

export function createPlanetTextureMap(): Record<string, HTMLCanvasElement> {
  return {
    mercury: generateMercuryCanvas(),
    venus: generateVenusCanvas(),
    mars: generateMarsCanvas(),
    ...createGasGiantTextureMap(),
  };
}
