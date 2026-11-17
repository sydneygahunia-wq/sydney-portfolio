"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { ConnectCard } from "@/components/pond/connect-card";
import { drawKoi, drawKoiShadow, hitsKoi, makeKoi, rand, updateKoi, type Koi, type Rect, type Variety, type Vec } from "@/lib/pond/koi";
import { EDGE_PADS, HOME_PADS, drawPad, drawPetal, makePetal, type Petal } from "@/lib/pond/surface";
import { createWater, type Water } from "@/lib/pond/water";
import { cn } from "@/lib/utils";

export type Carrier = { id: string; label: string; href?: string; variety: Variety };

const SOFT_SCALE = 0.25; // low-res layer for deep koi, shadows and light: scaling it up blurs them for free

type Glint = { x: number; y: number; len: number; rot: number; alpha: number; drift: number };

type Layers = { floor: HTMLCanvasElement; soft: HTMLCanvasElement; softCtx: CanvasRenderingContext2D };

// Static pond floor, painted once per resize.
function paintFloor(floor: HTMLCanvasElement, w: number, h: number) {
  floor.width = Math.max(1, Math.round(w));
  floor.height = Math.max(1, Math.round(h));
  const ctx = floor.getContext("2d")!;
  const g = ctx.createRadialGradient(w * 0.45, h * 0.4, 0, w * 0.5, h * 0.5, Math.max(w, h) * 0.8);
  g.addColorStop(0, "#2f4d48");
  g.addColorStop(0.55, "#233d39");
  g.addColorStop(1, "#1a2b29");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  // A greyer, lighter patch low on the right, like open sky reflected in the water
  const sky = ctx.createRadialGradient(w * 0.9, h * 0.95, 0, w * 0.9, h * 0.95, Math.max(w, h) * 0.45);
  sky.addColorStop(0, "rgba(120, 135, 135, 0.28)");
  sky.addColorStop(1, "rgba(120, 135, 135, 0)");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h);
}

// Everything under the surface: floor, soft depth layer (deep koi, shadows, reflected light), near koi, moon.
function drawUnderwater(ctx: CanvasRenderingContext2D, layers: Layers, w: number, h: number, t: number, near: Koi[], deep: Koi[], glints: Glint[]) {
  ctx.drawImage(layers.floor, 0, 0, w, h);

  const { soft, softCtx } = layers;
  const S = SOFT_SCALE;
  softCtx.clearRect(0, 0, soft.width, soft.height);
  // Blurry flecks of reflected light drifting on the water
  for (const g of glints) {
    softCtx.save();
    softCtx.translate((g.x + Math.sin(t * 0.00008 + g.drift) * 0.02) * w * S, (g.y + Math.cos(t * 0.00006 + g.drift) * 0.02) * h * S);
    softCtx.rotate(g.rot);
    softCtx.beginPath();
    softCtx.ellipse(0, 0, g.len * S, g.len * S * 0.8, 0, 0, Math.PI * 2);
    softCtx.fillStyle = `rgba(200, 225, 220, ${g.alpha * (0.6 + 0.4 * Math.sin(t * 0.001 + g.drift * 5))})`;
    softCtx.fill();
    softCtx.restore();
  }
  // Deep koi: faint ghosts far below
  softCtx.globalAlpha = 0.11;
  for (const k of deep) drawKoi(softCtx, k, t, S, false);
  softCtx.globalAlpha = 1;
  // Shadows of the near koi on the pond floor
  softCtx.fillStyle = "rgba(4, 16, 14, 0.2)";
  for (const k of near) drawKoiShadow(softCtx, k, S);
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(soft, 0, 0, w, h);

  // Crescent moon reflected in the water (the waves break it up)
  const mx = w * 0.82;
  const my = h * 0.18;
  const mr = Math.min(w, h) * 0.034;
  ctx.save();
  ctx.beginPath();
  ctx.arc(mx, my, mr, 0, Math.PI * 2);
  ctx.clip();
  ctx.beginPath();
  ctx.rect(mx - mr, my - mr, mr * 2, mr * 2);
  ctx.arc(mx + mr * 0.42, my - mr * 0.28, mr * 0.86, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(232, 242, 240, 0.9)";
  ctx.fill("evenodd");
  ctx.restore();

  for (const k of near) drawKoi(ctx, k, t, 1, true);
}

export function PondScene({
  variant,
  carriers = [],
  avoidRef,
}: {
  variant: "home" | "page";
  carriers?: Carrier[];
  avoidRef?: React.RefObject<HTMLElement>;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const glRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<HTMLCanvasElement>(null);
  const surfaceRef = useRef<HTMLCanvasElement>(null);
  const pillRefs = useRef<(HTMLElement | null)[]>([]);
  const [connectOpen, setConnectOpen] = useState(false);
  const [waterOn, setWaterOn] = useState(false);
  const router = useRouter();
  const carriersRef = useRef(carriers);
  carriersRef.current = carriers;

  useEffect(() => {
    const root = rootRef.current;
    const glCanvas = glRef.current;
    const sceneCanvas = sceneRef.current;
    const surface = surfaceRef.current;
    const sceneCtx = sceneCanvas?.getContext("2d");
    const surfaceCtx = surface?.getContext("2d");
    if (!root || !glCanvas || !sceneCanvas || !surface || !sceneCtx || !surfaceCtx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isHome = variant === "home";
    const pads = isHome ? HOME_PADS : EDGE_PADS;
    const dim = isHome ? 1 : 0.62;
    const padLayer = document.createElement("canvas");
    const padCtx = padLayer.getContext("2d");
    const soft = document.createElement("canvas");
    const layers: Layers = { floor: document.createElement("canvas"), soft, softCtx: soft.getContext("2d")! };

    let w = 0;
    let h = 0;
    let scale = 0;
    let dpr = 1;
    let koi: Koi[] = [];
    let carrierKoi: Koi[] = [];
    let deep: Koi[] = [];
    let glints: Glint[] = [];
    let petals: Petal[] = [];
    let avoid: Rect | null = null;
    let pointer: Vec | null = null;
    let water: Water | null = null;

    const measureAvoid = () => {
      const r = avoidRef?.current?.getBoundingClientRect();
      const box = root.getBoundingClientRect();
      avoid = r ? { x: r.left - box.left, y: r.top - box.top, w: r.width, h: r.height } : null;
    };

    const resize = () => {
      const box = root.getBoundingClientRect();
      w = box.width;
      h = box.height;
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      scale = Math.min(Math.max(Math.min(w, h), 520), 1100);

      // Every canvas is at least 1x1: before layout (or while hidden) the box can
      // be 0x0, and drawing a 0-sized canvas with drawImage throws, which would
      // take down the whole page.
      sceneCanvas.width = Math.max(1, Math.round(w));
      sceneCanvas.height = Math.max(1, Math.round(h));
      soft.width = Math.max(1, Math.round(w * SOFT_SCALE));
      soft.height = Math.max(1, Math.round(h * SOFT_SCALE));
      paintFloor(layers.floor, w, h);
      surface.width = Math.max(1, Math.round(w * dpr));
      surface.height = Math.max(1, Math.round(h * dpr));
      surfaceCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      water?.resize(w, h, Math.min(dpr, 1.25));

      const free = w < 640 ? 2 : 4;
      if (koi.length === 0) {
        carrierKoi = carriersRef.current.map((c) => makeKoi(w, h, scale, { variety: c.variety, carrier: true }));
        koi = [...carrierKoi, ...Array.from({ length: free }, () => makeKoi(w, h, scale))];
        deep = Array.from({ length: w < 640 ? 1 : 2 }, () => makeKoi(w, h, scale, { deep: true }));
        petals = Array.from({ length: w < 640 ? 10 : isHome ? 18 : 12 }, () => makePetal(w, h, true));
        glints = Array.from({ length: 18 }, () => ({
          x: Math.random(),
          y: Math.random(),
          len: rand(10, 26),
          rot: rand(-0.5, 0.5),
          alpha: rand(0.04, 0.1),
          drift: rand(0, 6),
        }));
      }
      if (padCtx) {
        padLayer.width = surface.width;
        padLayer.height = surface.height;
        padCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
        for (const pad of pads) drawPad(padCtx, pad, w, h, scale);
      }
      measureAvoid();
    };
    resize();

    // Pin each pill near the head of its koi, kept fully on screen
    const placePills = () => {
      carrierKoi.forEach((k, i) => {
        const el = pillRefs.current[i];
        if (!el) return;
        const anchor = k.spine[2];
        const pw = el.offsetWidth;
        const ph = el.offsetHeight;
        const x = Math.min(Math.max(anchor.x - pw / 2, 8), w - pw - 8);
        const y = Math.min(Math.max(anchor.y - ph - k.width * 1.1, 8), h - ph - 8);
        el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        el.style.opacity = "1";
      });
    };

    const drawSurface = (dt: number, now: number) => {
      surfaceCtx.clearRect(0, 0, w, h);
      surfaceCtx.drawImage(padLayer, 0, 0, w, h);
      for (const p of petals) {
        if (dt) {
          p.x += p.vx * dt + Math.sin(now * 0.001 + p.rot) * 0.15;
          p.y += p.vy * dt;
          p.rot += p.vrot * dt;
          if (p.y > h + 20 || p.x > w + 20) Object.assign(p, makePetal(w, h, false));
        }
        drawPetal(surfaceCtx, p, now);
      }
    };

    // A still frame straight away (no WebGL yet), so the pond and pills appear instantly
    drawUnderwater(sceneCtx, layers, w, h, 0, koi, deep, glints);
    drawSurface(0, 0);
    placePills();

    const carrierAt = (p: Vec) => carrierKoi.findIndex((k) => hitsKoi(k, p));
    const local = (e: PointerEvent) => {
      const box = root.getBoundingClientRect();
      return { x: e.clientX - box.left, y: e.clientY - box.top };
    };
    const activate = (i: number) => {
      const c = carriersRef.current[i];
      if (c.href) router.push(c.href);
      else setConnectOpen((v) => !v);
    };

    const onMove = (e: PointerEvent) => {
      pointer = local(e);
      if (isHome) glCanvas.style.cursor = carrierAt(pointer) >= 0 ? "pointer" : "default";
    };
    const onLeave = () => (pointer = null);
    const onDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("a, button, article, [role=dialog]")) return;
      const p = local(e);
      const hit = isHome ? carrierAt(p) : -1;
      if (hit >= 0) return activate(hit);
      water?.drop(p.x / w, p.y / h, 0.045, 0.32);
    };
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove);
    document.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointerdown", onDown);

    let raf = 0;
    let startTimer = 0;
    let last = 0;
    let rainClock = rand(800, 2000);

    const frame = (now: number) => {
      const dt = last ? Math.min(now - last, 50) : 16;
      last = now;

      for (const k of deep) updateKoi(k, dt, now, w, h, null, null);
      for (const k of koi) {
        let crowd: Vec | null = null;
        if (k.carrier) {
          let best = Infinity;
          for (const o of carrierKoi) {
            if (o === k) continue;
            const d = Math.hypot(o.spine[0].x - k.spine[0].x, o.spine[0].y - k.spine[0].y);
            if (d < best) [best, crowd] = [d, o.spine[0]];
          }
        }
        updateKoi(k, dt, now, w, h, pointer, k.carrier ? avoid : null, crowd);
      }

      // Now and then something touches the water and sends out a ring
      rainClock -= dt;
      if (rainClock < 0) {
        rainClock = rand(4000, 8000);
        water?.drop(rand(0.1, 0.9), rand(0.1, 0.9), 0.02, 0.08);
      }

      drawUnderwater(sceneCtx, layers, w, h, now, koi, deep, glints);
      if (water) water.frame(sceneCanvas, now, dim);
      drawSurface(dt, now);
      placePills();
      raf = requestAnimationFrame(frame);
    };

    // Start the live water once the page has finished loading, so it never competes with the first render
    const start = () => {
      water = createWater(glCanvas);
      if (water) {
        water.resize(w, h, Math.min(dpr, 1.25));
        setWaterOn(true);
      }
      if (reduceMotion) {
        drawUnderwater(sceneCtx, layers, w, h, 0, koi, deep, glints);
        water?.frame(sceneCanvas, 0, dim);
        return;
      }
      raf = requestAnimationFrame(frame);
    };
    const schedule = () => (startTimer = window.setTimeout(start, 1000));
    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });

    const avoidTimer = window.setInterval(measureAvoid, 1000);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(startTimer);
      window.clearInterval(avoidTimer);
      window.removeEventListener("load", schedule);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
      water?.dispose();
    };
  }, [variant, avoidRef, router]);

  // Dark see-through glass with a thin border tinted to the koi carrying it
  const pill =
    "pointer-events-auto absolute left-0 top-0 inline-flex items-center gap-2 whitespace-nowrap rounded-full border bg-[rgba(14,26,26,0.42)] px-[18px] py-2 text-[13px] tracking-[0.03em] text-cream/95 opacity-0 shadow-[0_6px_20px_rgba(0,0,0,0.25)] backdrop-blur-md transition-[background-color,opacity] duration-300 will-change-transform hover:bg-[rgba(14,26,26,0.6)]";

  return (
    <div ref={rootRef} className={cn("overflow-hidden bg-pond-deep", variant === "home" ? "absolute inset-0" : "fixed inset-0")} aria-hidden={variant === "page" || undefined}>
      {/* Underwater scene: shown directly until the WebGL water takes over */}
      <canvas ref={sceneRef} aria-hidden className={cn("absolute inset-0 h-full w-full", waterOn && "invisible")} />
      <canvas ref={glRef} aria-hidden className={cn("absolute inset-0 h-full w-full", !waterOn && "invisible")} />
      {variant === "page" && <div aria-hidden className="absolute inset-0 bg-night/40" />}
      <canvas ref={surfaceRef} aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" />
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(5,15,15,0.55)_100%)]" />

      {carriers.length > 0 && (
        <nav aria-label="Main" className="pointer-events-none absolute inset-0 z-20">
          {carriers.map((c, i) => {
            const accent = c.variety === "gold" ? "#d9b45e" : c.variety === "blue" ? "#8fb3d9" : c.variety === "pink" ? "#e7a3bb" : "#d98a6e";
            const style = { borderColor: `${accent}b3` };
            return c.href ? (
              <Link key={c.id} href={c.href} ref={(el) => void (pillRefs.current[i] = el)} className={pill} style={style}>
                {c.label} <ArrowUpRight size={13} aria-hidden />
              </Link>
            ) : (
              <button
                key={c.id}
                type="button"
                ref={(el) => void (pillRefs.current[i] = el)}
                onClick={() => setConnectOpen((v) => !v)}
                aria-expanded={connectOpen}
                aria-controls="connect-card"
                className={pill}
                style={style}
              >
                {c.label} <ArrowUpRight size={13} aria-hidden />
              </button>
            );
          })}
        </nav>
      )}
      {carriers.some((c) => !c.href) && <ConnectCard open={connectOpen} onClose={() => setConnectOpen(false)} />}
    </div>
  );
}
