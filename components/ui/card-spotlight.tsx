"use client";

// Adapted from 21st.dev "Card Spotlight" (Aceternity UI): a radial glow that tracks the cursor.
import { m, useMotionTemplate, useMotionValue } from "framer-motion";
import { cn } from "@/lib/utils";

export function CardSpotlight({
  color,
  radius = 280,
  className,
  children,
}: {
  color: string;
  radius?: number;
  className?: string;
  children: React.ReactNode;
}) {
  const x = useMotionValue(-radius);
  const y = useMotionValue(-radius);
  const background = useMotionTemplate`radial-gradient(${radius}px circle at ${x}px ${y}px, ${color}2e, transparent 75%)`;

  return (
    <div
      onPointerMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        x.set(e.clientX - rect.left);
        y.set(e.clientY - rect.top);
      }}
      onPointerLeave={() => {
        x.set(-radius);
        y.set(-radius);
      }}
      className={cn("group/spot relative overflow-hidden", className)}
    >
      <m.div aria-hidden className="pointer-events-none absolute inset-0 z-0" style={{ background }} />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
