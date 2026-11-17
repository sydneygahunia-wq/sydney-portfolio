// Koi: a chain of spine points pulled along by the head, so bodies bend naturally when they turn.

export type Vec = { x: number; y: number };
export type Rect = { x: number; y: number; w: number; h: number };

export type Variety = "kohaku" | "sanke" | "gold" | "white" | "blue" | "pink" | "tancho";

export type Koi = {
  spine: Vec[];
  angle: number;
  turn: number;
  speed: number;
  seg: number; // distance between spine points
  width: number; // half-width at the widest point
  base: string;
  edge: string; // darker tone for the body's rounded edges
  accent: string; // colour used to tint a pill riding on this koi
  patches: { at: number; side: number; r: number; color: string }[];
  scales: number; // how visible the scale texture is
  phase: number;
  carrier: boolean; // carries a link pill, so it keeps to open water and stays on screen
  deep: boolean; // swims far below the surface: drawn faint and blurred
};

const SEGMENTS = 16;
const RED = "#e25a3a";
const RED_DEEP = "#cf4630";
const INK = "#2a2626";

export const rand = (a: number, b: number) => a + Math.random() * (b - a);
const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

const COLORS: Record<Variety, { base: string; edge: string; accent: string; scales: number }> = {
  kohaku: { base: "#fbf8f5", edge: "#ddd3cf", accent: RED, scales: 0 },
  sanke: { base: "#fbf8f5", edge: "#ddd3cf", accent: RED, scales: 0 },
  tancho: { base: "#fbf8f5", edge: "#ddd3cf", accent: RED, scales: 0 },
  white: { base: "#f7f5f2", edge: "#d6d2ce", accent: "#e9e6e1", scales: 0 },
  gold: { base: "#f4c25e", edge: "#d99a38", accent: "#e8b55a", scales: 0.45 },
  blue: { base: "#c2dbf5", edge: "#93b3d9", accent: "#9fc0e6", scales: 0.3 },
  pink: { base: "#fbeff3", edge: "#e8c3d0", accent: "#f0a3be", scales: 0 },
};

export function makeKoi(
  w: number,
  h: number,
  scale: number,
  opts: { variety?: Variety; carrier?: boolean; deep?: boolean } = {},
): Koi {
  const angle = rand(0, Math.PI * 2);
  const carrier = !!opts.carrier;
  const deep = !!opts.deep;
  const head = carrier
    ? { x: rand(0.2, 0.8) * w, y: pick([rand(0.18, 0.3), rand(0.7, 0.82)]) * h }
    : { x: rand(0.1, 0.9) * w, y: rand(0.1, 0.9) * h };
  const size = deep ? rand(0.95, 1.1) : rand(0.9, 1.1);
  const seg = scale * 0.0152 * size;
  const spine = Array.from({ length: SEGMENTS }, (_, i) => ({
    x: head.x - Math.cos(angle) * seg * i,
    y: head.y - Math.sin(angle) * seg * i,
  }));

  // Mostly kohaku, like a real pond; the gold and blue koi are carried by link pills already
  const variety = opts.variety ?? pick<Variety>(["kohaku", "kohaku", "kohaku", "sanke", "sanke", "tancho", "white", "pink"]);
  const c = COLORS[variety];
  const patches: Koi["patches"] = [];
  if (variety === "kohaku" || variety === "sanke") {
    // Red saddles from head to tail, like a classic kohaku pattern
    // Separate red saddles on a white body, like a classic kohaku pattern
    // Big irregular red blotches: two overlapping shapes per saddle so they run together
    for (let at = Math.floor(rand(1, 3)); at < 11; at += Math.floor(rand(4, 6))) {
      const color = pick([RED, RED_DEEP]);
      patches.push({ at, side: rand(-0.3, 0.3), r: rand(0.55, 0.72), color });
      patches.push({ at: Math.min(12, at + 1), side: rand(-0.4, 0.4), r: rand(0.4, 0.55), color });
    }
  }
  if (variety === "sanke") {
    for (let i = 0; i < 3; i++) patches.push({ at: Math.floor(rand(4, 12)), side: rand(-0.7, 0.7), r: rand(0.16, 0.28), color: INK });
  }
  if (variety === "tancho") patches.push({ at: 1, side: 0, r: 0.55, color: RED });
  if (variety === "pink") patches.push({ at: 0, side: 0, r: 0.75, color: "#ee9ab6" }, { at: 2, side: 0.2, r: 0.6, color: "#f2b0c6" });
  if (variety === "gold") patches.push({ at: 1, side: 0, r: 0.7, color: "#eaa53d" });
  if (variety === "blue") {
    for (let i = 0; i < 2; i++) patches.push({ at: Math.floor(rand(4, 11)), side: rand(-0.4, 0.4), r: rand(0.5, 0.8), color: "#9cbde4" });
  }

  return {
    spine,
    angle,
    turn: 0,
    speed: scale * (carrier ? rand(0.00005, 0.00007) : deep ? rand(0.00003, 0.00005) : rand(0.00005, 0.00009)), // px per ms
    seg,
    width: scale * 0.038 * size,
    base: c.base,
    edge: c.edge,
    accent: c.accent,
    patches,
    scales: c.scales,
    phase: rand(0, Math.PI * 2),
    carrier,
    deep,
  };
}

// Body half-width along the spine (u: 0 = nose, 1 = tail root): round head, full shoulders, long taper.
function bodyProfile(u: number) {
  if (u < 0.22) return 0.8 + 0.2 * Math.sin((u / 0.22) * (Math.PI / 2));
  return 1 - 0.8 * Math.pow((u - 0.22) / 0.78, 1.9);
}

export function updateKoi(
  k: Koi,
  dt: number,
  t: number,
  w: number,
  h: number,
  pointer: Vec | null,
  avoid: Rect | null,
  crowd: Vec | null = null, // nearest other carrier's head, so link pills never pile up
) {
  k.turn += (Math.random() - 0.5) * 0.00002 * dt;
  k.turn = Math.max(-0.0005, Math.min(0.0005, k.turn * 0.997));
  k.angle += k.turn * dt;

  const head = k.spine[0];
  const steerTo = (target: number, strength: number) => {
    let diff = target - k.angle;
    diff = Math.atan2(Math.sin(diff), Math.cos(diff));
    k.angle += Math.max(-0.0009 * dt, Math.min(0.0009 * dt, diff * strength * dt)); // turn in wide, lazy arcs
  };

  // Stay in the pond. Carriers keep further from the edges so their pill is always readable.
  const margin = Math.min(w, h) * (k.carrier ? 0.16 : k.deep ? 0 : 0.06);
  if (head.x < margin || head.x > w - margin || head.y < margin || head.y > h - margin) {
    steerTo(Math.atan2(h / 2 - head.y, w / 2 - head.x), k.carrier ? 0.004 : 0.002);
  }
  if (k.carrier && avoid) {
    const cx = avoid.x + avoid.w / 2;
    const cy = avoid.y + avoid.h / 2;
    const inside = Math.abs(head.x - cx) < avoid.w / 2 + 40 && Math.abs(head.y - cy) < avoid.h / 2 + 50;
    if (inside) steerTo(Math.atan2(head.y - cy, head.x - cx), 0.006);
  }
  if (k.carrier && crowd) {
    const d = Math.hypot(head.x - crowd.x, head.y - crowd.y);
    if (d < 230) steerTo(Math.atan2(head.y - crowd.y, head.x - crowd.x), 0.005 * (1 - d / 230));
  }
  if (pointer && !k.carrier && !k.deep) {
    const dx = head.x - pointer.x;
    const dy = head.y - pointer.y;
    const d = Math.hypot(dx, dy);
    if (d < 150) steerTo(Math.atan2(dy, dx), 0.004 * (1 - d / 150));
  }

  // A gentle side-to-side sway makes the body undulate as the spine follows
  const heading = k.angle + Math.sin(t * 0.003 + k.phase) * 0.1;
  head.x += Math.cos(heading) * k.speed * dt;
  head.y += Math.sin(heading) * k.speed * dt;

  // Each segment follows the one in front, but can only bend a little: koi stay gently curved, never coiled
  const MAX_BEND = 0.11;
  let prevDir = heading;
  for (let i = 1; i < k.spine.length; i++) {
    const prev = k.spine[i - 1];
    const p = k.spine[i];
    let dir = Math.atan2(prev.y - p.y, prev.x - p.x);
    const bend = Math.atan2(Math.sin(dir - prevDir), Math.cos(dir - prevDir));
    if (Math.abs(bend) > MAX_BEND) dir = prevDir + Math.sign(bend) * MAX_BEND;
    p.x = prev.x - Math.cos(dir) * k.seg;
    p.y = prev.y - Math.sin(dir) * k.seg;
    prevDir = dir;
  }
}

// True if a point is on (or very near) the koi's body: used to make carrier koi clickable.
export function hitsKoi(k: Koi, p: Vec) {
  return k.spine.some((s, i) => i < 13 && Math.hypot(s.x - p.x, s.y - p.y) < k.width * 1.5);
}

type Frame = { pts: Vec[]; dirs: number[]; width: number; body: Path2D };

// Body outline at `wf` × the normal width (smaller copies are used for the rounded shading).
function frameOf(k: Koi, s: number, wf = 1): Frame {
  const n = k.spine.length;
  const width = k.width * s;
  const pts = k.spine.map((p) => ({ x: p.x * s, y: p.y * s }));
  const left: Vec[] = [];
  const right: Vec[] = [];
  const dirs: number[] = [];
  for (let i = 0; i < n; i++) {
    const a = pts[Math.max(0, i - 1)];
    const b = pts[Math.min(n - 1, i + 1)];
    const dir = Math.atan2(a.y - b.y, a.x - b.x);
    dirs.push(dir);
    const hw = width * wf * bodyProfile(i / (n - 1));
    const nx = Math.cos(dir + Math.PI / 2);
    const ny = Math.sin(dir + Math.PI / 2);
    left.push({ x: pts[i].x + nx * hw, y: pts[i].y + ny * hw });
    right.push({ x: pts[i].x - nx * hw, y: pts[i].y - ny * hw });
  }

  const body = new Path2D();
  body.moveTo(left[n - 1].x, left[n - 1].y);
  for (let i = n - 2; i >= 0; i--) {
    body.quadraticCurveTo(left[i + 1].x, left[i + 1].y, (left[i].x + left[i + 1].x) / 2, (left[i].y + left[i + 1].y) / 2);
  }
  const fwd = { x: Math.cos(dirs[0]), y: Math.sin(dirs[0]) };
  const side = { x: Math.cos(dirs[0] + Math.PI / 2), y: Math.sin(dirs[0] + Math.PI / 2) };
  const r = width * wf;
  // Broad, blunt, rounded head
  const tip = { x: pts[0].x + fwd.x * r * 0.7, y: pts[0].y + fwd.y * r * 0.7 };
  body.quadraticCurveTo(left[0].x, left[0].y, left[0].x, left[0].y);
  body.bezierCurveTo(left[0].x + fwd.x * r * 0.55, left[0].y + fwd.y * r * 0.55, tip.x + side.x * r * 0.62, tip.y + side.y * r * 0.62, tip.x, tip.y);
  body.bezierCurveTo(tip.x - side.x * r * 0.62, tip.y - side.y * r * 0.62, right[0].x + fwd.x * r * 0.55, right[0].y + fwd.y * r * 0.55, right[0].x, right[0].y);
  for (let i = 1; i < n; i++) {
    body.quadraticCurveTo(right[i - 1].x, right[i - 1].y, (right[i].x + right[i - 1].x) / 2, (right[i].y + right[i - 1].y) / 2);
  }
  body.lineTo(right[n - 1].x, right[n - 1].y);
  body.closePath();
  return { pts, dirs, width, body };
}

// A fin: one smooth, translucent shape that fades toward its edge (no hard lines), in the koi's local frame.
function fin(ctx: CanvasRenderingContext2D, len: number, spread: number, alpha: number) {
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(len * 0.25, -spread * 0.9, len * 0.8, -spread * 1.0, len, -spread * 0.15);
  ctx.bezierCurveTo(len * 1.05, spread * 0.4, len * 0.6, spread * 0.85, len * 0.35, spread * 0.6);
  ctx.quadraticCurveTo(len * 0.12, spread * 0.3, 0, 0);
  const g = ctx.createLinearGradient(0, 0, len, 0);
  g.addColorStop(0, `rgba(238, 242, 240, ${alpha})`);
  g.addColorStop(0.6, `rgba(225, 233, 232, ${alpha * 0.75})`);
  g.addColorStop(1, `rgba(215, 226, 226, ${alpha * 0.35})`);
  ctx.fillStyle = g;
  ctx.fill();
}

// Faint shadow on the pond floor, drawn into the low-resolution layer so it comes out soft.
export function drawKoiShadow(ctx: CanvasRenderingContext2D, k: Koi, s: number) {
  const f = frameOf(k, s);
  ctx.save();
  ctx.translate(f.width * 0.6, f.width * 0.9);
  ctx.fill(f.body);
  ctx.restore();
}

// `s` scales the drawing to the layer's resolution; `detail` adds eyes and whiskers.
export function drawKoi(ctx: CanvasRenderingContext2D, k: Koi, t: number, s = 1, detail = true) {
  const { pts, dirs, width, body } = frameOf(k, s);
  const n = pts.length;
  const fwd = { x: Math.cos(dirs[0]), y: Math.sin(dirs[0]) };
  const side = { x: Math.cos(dirs[0] + Math.PI / 2), y: Math.sin(dirs[0] + Math.PI / 2) };

  // Long veil tail: two big flowing lobes that trail and ripple behind the body
  const root = pts[n - 1];
  const flutter = Math.sin(t * 0.0045 + k.phase);
  const tailDir = dirs[n - 1] + Math.PI + flutter * 0.12;
  const tailLen = k.seg * s * 8.5;
  for (const sgn of [1, -1]) {
    ctx.save();
    ctx.translate(root.x, root.y);
    ctx.rotate(tailDir + sgn * (0.3 + flutter * 0.08 * sgn));
    ctx.scale(1, sgn);
    fin(ctx, tailLen, width * 1.45, 0.28);
    ctx.restore();
  }

  // Pectoral fins: large and translucent, gently rowing
  const rowing = Math.sin(t * 0.0035 + k.phase) * 0.16;
  for (const sgn of [1, -1]) {
    const p = pts[3];
    const out = dirs[3] + (sgn * Math.PI) / 2;
    ctx.save();
    ctx.translate(p.x + Math.cos(out) * width * 0.7, p.y + Math.sin(out) * width * 0.7);
    ctx.rotate(dirs[3] + Math.PI - sgn * (0.85 + rowing));
    ctx.scale(1, sgn);
    fin(ctx, width * 2.3, width * 0.9, 0.2);
    ctx.restore();
  }
  // Small pelvic fins
  for (const sgn of [1, -1]) {
    const p = pts[9];
    const out = dirs[9] + (sgn * Math.PI) / 2;
    ctx.save();
    ctx.translate(p.x + Math.cos(out) * width * 0.4, p.y + Math.sin(out) * width * 0.4);
    ctx.rotate(dirs[9] + Math.PI - sgn * 0.8);
    ctx.scale(1, sgn);
    fin(ctx, width * 1.1, width * 0.45, 0.18);
    ctx.restore();
  }

  // Rounded body: edge tone, then progressively lighter, narrower copies toward the spine
  ctx.fillStyle = k.edge;
  ctx.fill(body);
  ctx.fillStyle = k.base;
  ctx.fill(frameOf(k, s, 0.86).body);

  ctx.save();
  ctx.clip(body);
  for (const patch of k.patches) {
    const p = pts[patch.at];
    const dir = dirs[patch.at];
    const cx = p.x + Math.cos(dir + Math.PI / 2) * patch.side * width;
    const cy = p.y + Math.sin(dir + Math.PI / 2) * patch.side * width;
    const rx = width * patch.r * 1.5;
    const ry = width * patch.r * 1.05;
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, dir, 0, Math.PI * 2);
    ctx.fillStyle = patch.color;
    ctx.fill();
    // Scales show as soft lighter dots along the saddle's edge
    if (detail && patch.r > 0.4) {
      ctx.fillStyle = "rgba(255, 225, 215, 0.18)";
      for (let a = 0; a < Math.PI * 2; a += 0.42) {
        const ex = Math.cos(a) * rx * 0.92;
        const ey = Math.sin(a) * ry * 0.92;
        ctx.beginPath();
        ctx.arc(cx + ex * Math.cos(dir) - ey * Math.sin(dir), cy + ex * Math.sin(dir) + ey * Math.cos(dir), width * 0.11, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
  // Scaled koi (gold, blue) get a fine net pattern
  if (detail && k.scales > 0.2) {
    ctx.strokeStyle = `rgba(255, 245, 225, ${k.scales * 0.6})`;
    ctx.lineWidth = Math.max(0.5, width * 0.03);
    for (let i = 3; i < n - 2; i++) {
      const hw = width * bodyProfile(i / (n - 1)) * 0.75;
      for (let j = -2; j <= 2; j++) {
        const off = (j + (i % 2 ? 0.5 : 0)) * hw * 0.42;
        if (Math.abs(off) > hw) continue;
        ctx.beginPath();
        ctx.arc(
          pts[i].x + Math.cos(dirs[i] + Math.PI / 2) * off,
          pts[i].y + Math.sin(dirs[i] + Math.PI / 2) * off,
          width * 0.17,
          dirs[i] + Math.PI - 1,
          dirs[i] + Math.PI + 1,
        );
        ctx.stroke();
      }
    }
  }
  ctx.restore();

  // Soft sheen down the back
  ctx.globalAlpha = 0.22;
  ctx.fillStyle = "#ffffff";
  ctx.fill(frameOf(k, s, 0.42).body);
  ctx.globalAlpha = 1;

  if (!detail) return;

  // Whiskers (barbels) at the mouth
  const mouth = { x: pts[0].x + fwd.x * width * 0.78, y: pts[0].y + fwd.y * width * 0.78 };
  ctx.strokeStyle = "rgba(240, 222, 214, 0.7)";
  ctx.lineWidth = Math.max(0.6, width * 0.045);
  ctx.lineCap = "round";
  for (const sgn of [1, -1]) {
    ctx.beginPath();
    ctx.moveTo(mouth.x + side.x * sgn * width * 0.2, mouth.y + side.y * sgn * width * 0.2);
    ctx.quadraticCurveTo(
      mouth.x + fwd.x * width * 0.3 + side.x * sgn * width * 0.4,
      mouth.y + fwd.y * width * 0.3 + side.y * sgn * width * 0.4,
      mouth.x + fwd.x * width * 0.15 + side.x * sgn * width * 0.7,
      mouth.y + fwd.y * width * 0.15 + side.y * sgn * width * 0.7,
    );
    ctx.stroke();
  }

  // Small dark eyes on the sides of the head
  for (const sgn of [1, -1]) {
    const ex = pts[0].x + fwd.x * width * 0.22 + side.x * sgn * width * 0.5;
    const ey = pts[0].y + fwd.y * width * 0.22 + side.y * sgn * width * 0.5;
    ctx.beginPath();
    ctx.arc(ex, ey, width * 0.1, 0, Math.PI * 2);
    ctx.fillStyle = "#141212";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(ex - width * 0.03, ey - width * 0.03, width * 0.035, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
    ctx.fill();
  }
}
