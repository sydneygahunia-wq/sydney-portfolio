// Adapted from 21st.dev "Marquee" (Magic UI): content is duplicated and translated on a CSS loop, so it's GPU-only.
import { cn } from "@/lib/utils";

export function Marquee({
  children,
  duration = "18s",
  gap = "2rem",
  paused = false,
  className,
}: {
  children: React.ReactNode;
  duration?: string;
  gap?: string;
  paused?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn("flex overflow-hidden [gap:var(--gap)]", className)}
      style={{ "--duration": duration, "--gap": gap } as React.CSSProperties}
    >
      {[0, 1].map((i) => (
        <div
          key={i}
          aria-hidden={i === 1}
          className={cn("flex shrink-0 animate-marquee items-center [gap:var(--gap)]", paused && "[animation-play-state:paused]")}
        >
          {children}
        </div>
      ))}
    </div>
  );
}
