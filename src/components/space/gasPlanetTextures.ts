import { createCanvas2D, fillLinearGradient } from './planetTextures';

function generateJupiterCanvas(): HTMLCanvasElement {
  const { canvas, ctx } = createCanvas2D(1024, 512);
  const bandColors = [
    '#78350f', '#d97706', '#fef3c7', '#92400e', '#fed7aa',
    '#b45309', '#fef3c7', '#7c2d12', '#ea580c', '#fef3c7',
    '#9a3412', '#fdba74', '#78350f',
  ];

  const bandH = 512 / bandColors.length;
  bandColors.forEach((color, i) => {
    ctx.fillStyle = color;
    ctx.fillRect(0, i * bandH, 1024, bandH + 2);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, i * bandH);
    for (let x = 0; x < 1024; x += 30) {
      ctx.lineTo(x, i * bandH + Math.sin(x * 0.05 + i) * 6);
    }
    ctx.stroke();
  });

  ctx.fillStyle = '#b91c1c';
  ctx.beginPath();
  ctx.ellipse(620, 340, 42, 26, 0.1, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#fef08a';
  ctx.lineWidth = 2.5;
  ctx.stroke();
  return canvas;
}

function generateSaturnCanvas(): HTMLCanvasElement {
  const { canvas, ctx } = createCanvas2D(1024, 512);
  fillLinearGradient(ctx, 0, 0, 0, 512, 1024, 512, [
    [0, '#fef08a'],
    [0.3, '#fde047'],
    [0.5, '#eab308'],
    [0.7, '#fde047'],
    [1, '#fef08a'],
  ]);

  ctx.strokeStyle = 'rgba(161, 98, 7, 0.35)';
  ctx.lineWidth = 8;
  for (let y = 30; y < 512; y += 45) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(1024, y);
    ctx.stroke();
  }
  return canvas;
}

export function generateSaturnRingCanvas(): HTMLCanvasElement {
  const { canvas, ctx } = createCanvas2D(1024, 64);
  fillLinearGradient(ctx, 0, 0, 1024, 0, 1024, 64, [
    [0, 'rgba(254, 240, 138, 0)'],
    [0.15, 'rgba(254, 240, 138, 0.85)'],
    [0.45, 'rgba(250, 204, 21, 0.95)'],
    [0.58, 'rgba(10, 10, 15, 0.05)'],
    [0.68, 'rgba(253, 224, 71, 0.88)'],
    [0.92, 'rgba(254, 240, 138, 0.55)'],
    [1, 'rgba(254, 240, 138, 0)'],
  ]);
  return canvas;
}

function generateUranusCanvas(): HTMLCanvasElement {
  const { canvas, ctx } = createCanvas2D(512, 256);
  fillLinearGradient(ctx, 0, 0, 0, 256, 512, 256, [
    [0, '#7dd3fc'],
    [0.5, '#38bdf8'],
    [1, '#0284c7'],
  ]);
  return canvas;
}

function generateNeptuneCanvas(): HTMLCanvasElement {
  const { canvas, ctx } = createCanvas2D(512, 256);
  fillLinearGradient(ctx, 0, 0, 0, 256, 512, 256, [
    [0, '#1d4ed8'],
    [0.4, '#2563eb'],
    [0.8, '#1e40af'],
    [1, '#172554'],
  ]);

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(120, 140);
  ctx.lineTo(240, 145);
  ctx.stroke();

  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.ellipse(320, 110, 28, 16, -0.1, 0, Math.PI * 2);
  ctx.fill();
  return canvas;
}

export function createGasGiantTextureMap(): Record<string, HTMLCanvasElement> {
  return {
    jupiter: generateJupiterCanvas(),
    saturn: generateSaturnCanvas(),
    uranus: generateUranusCanvas(),
    neptune: generateNeptuneCanvas(),
  };
}
