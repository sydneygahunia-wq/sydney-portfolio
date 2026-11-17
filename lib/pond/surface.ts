// Things floating on the surface (not refracted by the water): lily pads, lotus flowers and drifting petals.
import { rand } from "./koi";

export type Pad = { x: number; y: number; r: number; notch: number; lotus?: number; drops: number[][] };
export type Petal = { x: number; y: number; vx: number; vy: number; rot: number; vrot: number; size: number; flip: number };

// A few water beads per pad: [x, y, size] in pad-radius units.
const beads = (seed: number): number[][] => {
  const out: number[][] = [];
  const count = 3 + (seed % 4);
  for (let i = 0; i < count; i++) {
    const a = seed * 1.7 + i * 2.3;
    const d = 0.2 + ((seed * 7 + i * 13) % 10) / 16;
    out.push([Math.cos(a) * d, Math.sin(a) * d, 0.035 + ((seed + i * 3) % 5) * 0.012]);
  }
  return out;
};

// Placed in fractions of the viewport so they frame the title instead of covering it.
// `lotus` is the flower's angle around the pad's rim.
export const HOME_PADS: Pad[] = [
  { x: 0.13, y: 0.22, r: 0.11, notch: 1.9, lotus: 3.6, drops: beads(1) },
  { x: 0.24, y: 0.03, r: 0.08, notch: 0.6, lotus: 2.4, drops: beads(2) },
  { x: 0.32, y: 0.2, r: 0.08, notch: 3.0, drops: beads(3) },
  { x: 0.59, y: 0.16, r: 0.11, notch: 3.9, lotus: 2.0, drops: beads(4) },
  { x: 0.96, y: 0.09, r: 0.1, notch: 2.6, drops: beads(5) },
  { x: 0.84, y: 0.58, r: 0.095, notch: 0.4, drops: beads(6) },
  { x: 0.83, y: 0.82, r: 0.09, notch: 5.1, lotus: 3.3, drops: beads(7) },
  { x: 0.04, y: 0.86, r: 0.075, notch: 4.4, drops: beads(8) },
];

// Inner pages keep pads to the edges so they never sit under the cards.
export const EDGE_PADS: Pad[] = [
  { x: 0.03, y: 0.28, r: 0.1, notch: 0.8, lotus: 0.2, drops: beads(9) },
  { x: 0.05, y: 0.86, r: 0.08, notch: 2.2, drops: beads(10) },
  { x: 0.97, y: 0.16, r: 0.085, notch: 3.6, drops: beads(11) },
  { x: 0.96, y: 0.72, r: 0.1, notch: 5.0, lotus: 3.4, drops: beads(12) },
];

export function drawPad(ctx: CanvasRenderingContext2D, pad: Pad, w: number, h: number, scale: number) {
  const x = pad.x * w;
  const y = pad.y * h;
  const r = pad.r * scale;

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(pad.notch);

  const leaf = new Path2D();
  leaf.moveTo(0, 0);
  leaf.lineTo(Math.cos(0.09) * r, Math.sin(0.09) * r);
  leaf.arc(0, 0, r, 0.09, Math.PI * 2 - 0.09);
  leaf.closePath();

  // Soft shadow on the water
  ctx.save();
  ctx.shadowColor = "rgba(0, 12, 10, 0.45)";
  ctx.shadowBlur = r * 0.3;
  ctx.shadowOffsetX = r * 0.06;
  ctx.shadowOffsetY = r * 0.12;
  ctx.fillStyle = "#4a8f57";
  ctx.fill(leaf);
  ctx.restore();

  ctx.save();
  ctx.clip(leaf);
  const g = ctx.createRadialGradient(-r * 0.25, -r * 0.3, 0, 0, 0, r);
  g.addColorStop(0, "#6aae72");
  g.addColorStop(0.6, "#559c61");
  g.addColorStop(1, "#468a53");
  ctx.fillStyle = g;
  ctx.fillRect(-r, -r, r * 2, r * 2);

  // Thin pale veins radiating from the centre
  ctx.strokeStyle = "rgba(200, 238, 190, 0.28)";
  ctx.lineWidth = Math.max(0.6, r * 0.007);
  for (let i = 0; i < 20; i++) {
    const a = 0.15 + (i / 19) * (Math.PI * 2 - 0.3);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
    ctx.stroke();
  }
  // Slightly darker rim, lighter centre spot
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.99, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(40, 95, 50, 0.55)";
  ctx.lineWidth = r * 0.025;
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.05, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(200, 240, 180, 0.5)";
  ctx.fill();
  ctx.restore();

  // Water beads: dark lens, bright rim on the far side, white glint
  for (const [dx, dy, s] of pad.drops) {
    const bx = dx * r;
    const by = dy * r;
    const br = s * r;
    ctx.beginPath();
    ctx.arc(bx + br * 0.25, by + br * 0.3, br, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(10, 40, 20, 0.35)";
    ctx.fill();
    const bg = ctx.createRadialGradient(bx - br * 0.3, by - br * 0.3, 0, bx, by, br);
    bg.addColorStop(0, "rgba(120, 190, 120, 0.6)");
    bg.addColorStop(0.75, "rgba(70, 140, 80, 0.55)");
    bg.addColorStop(1, "rgba(200, 245, 210, 0.85)");
    ctx.beginPath();
    ctx.arc(bx, by, br, 0, Math.PI * 2);
    ctx.fillStyle = bg;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(bx - br * 0.35, by - br * 0.35, br * 0.28, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
    ctx.fill();
  }
  ctx.restore();

  if (pad.lotus !== undefined) {
    const a = pad.lotus;
    drawLotus(ctx, x + Math.cos(a) * r * 0.7, y + Math.sin(a) * r * 0.7, r * 0.5);
  }
}

// Pointed petal from the origin to (len, 0) with a soft centre crease.
function petal(ctx: CanvasRenderingContext2D, len: number, wid: number, base: string, tip: string) {
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(len * 0.2, -wid, len * 0.95, -wid * 1.0, len, 0);
  ctx.bezierCurveTo(len * 0.95, wid * 1.0, len * 0.2, wid, 0, 0);
  const g = ctx.createLinearGradient(0, 0, len, 0);
  g.addColorStop(0, base);
  g.addColorStop(1, tip);
  ctx.fillStyle = g;
  ctx.fill();
  ctx.strokeStyle = "rgba(225, 120, 160, 0.35)";
  ctx.lineWidth = 0.8;
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(len * 0.1, 0);
  ctx.lineTo(len * 0.85, 0);
  ctx.strokeStyle = "rgba(215, 110, 150, 0.3)";
  ctx.stroke();
}

function drawLotus(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  const ring = (count: number, len: number, wid: number, offset: number, base: string, tip: string) => {
    for (let i = 0; i < count; i++) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(offset + (i / count) * Math.PI * 2);
      petal(ctx, len, wid, base, tip);
      ctx.restore();
    }
  };
  ctx.save();
  ctx.shadowColor = "rgba(30, 0, 15, 0.4)";
  ctx.shadowBlur = size * 0.35;
  ctx.shadowOffsetX = size * 0.08;
  ctx.shadowOffsetY = size * 0.14;
  ring(8, size, size * 0.3, 0, "#fbe2eb", "#f0a8c3");
  ctx.restore();
  ring(8, size * 0.78, size * 0.27, Math.PI / 8, "#fde9f0", "#f3b4cb");
  ring(6, size * 0.52, size * 0.22, 0.3, "#fff1f5", "#f6c3d5");

  // Seed pod: soft yellow-green disc ringed with stamens
  ctx.beginPath();
  ctx.arc(x, y, size * 0.2, 0, Math.PI * 2);
  ctx.fillStyle = "#f3d35f";
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x, y, size * 0.12, 0, Math.PI * 2);
  ctx.fillStyle = "#cfd36a";
  ctx.fill();
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2;
    ctx.beginPath();
    ctx.arc(x + Math.cos(a) * size * 0.165, y + Math.sin(a) * size * 0.165, size * 0.022, 0, Math.PI * 2);
    ctx.fillStyle = "#e0a53a";
    ctx.fill();
  }
}

export function makePetal(w: number, h: number, anywhere: boolean): Petal {
  return {
    x: rand(-0.1, 1) * w,
    y: anywhere ? rand(0, h) : rand(-60, -10),
    vx: rand(0.003, 0.012),
    vy: rand(0.007, 0.015),
    rot: rand(0, Math.PI * 2),
    vrot: rand(-0.001, 0.001),
    size: rand(6, 9.5),
    flip: rand(0, Math.PI * 2),
  };
}

// Cherry-blossom petal: rounded with a notch at the outer edge, tumbling as it drifts (scaleX flip).
export function drawPetal(ctx: CanvasRenderingContext2D, p: Petal, t: number) {
  const s = p.size;
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(p.rot);
  ctx.scale(0.35 + 0.65 * Math.abs(Math.cos(t * 0.0012 + p.flip)), 1);
  const shape = new Path2D();
  shape.moveTo(0, s * 0.95);
  shape.bezierCurveTo(-s * 0.95, s * 0.35, -s * 0.8, -s * 0.85, -s * 0.22, -s * 0.9);
  shape.lineTo(0, -s * 0.62);
  shape.lineTo(s * 0.22, -s * 0.9);
  shape.bezierCurveTo(s * 0.8, -s * 0.85, s * 0.95, s * 0.35, 0, s * 0.95);
  ctx.save();
  ctx.translate(s * 0.25, s * 0.4);
  ctx.fillStyle = "rgba(0, 15, 12, 0.22)";
  ctx.fill(shape);
  ctx.restore();
  const g = ctx.createLinearGradient(0, s, 0, -s);
  g.addColorStop(0, "#f2b3c6");
  g.addColorStop(1, "#fde3ea");
  ctx.fillStyle = g;
  ctx.fill(shape);
  ctx.restore();
}
