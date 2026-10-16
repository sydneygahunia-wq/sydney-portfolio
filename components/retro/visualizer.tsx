import { cn } from "@/lib/utils";

// Fake spectrum analyzer: CSS-only bars with staggered speeds. Settle low when stopped.
const bars = [0.7, 0.95, 0.6, 1.1, 0.8, 0.65, 1.0, 0.75, 0.9, 0.55, 1.05, 0.7, 0.85, 0.6, 0.95, 0.8];

export function Visualizer({ playing, count = 16, className }: { playing: boolean; count?: number; className?: string }) {
  return (
    <div aria-hidden className={cn("flex h-5 items-end gap-[2px]", className)}>
      {bars.slice(0, count).map((speed, i) => (
        <span
          key={i}
          className={cn(
            "h-full w-[3px] origin-bottom bg-gradient-to-t from-lcd via-[hsl(var(--p-blue))] to-[hsl(var(--p-pink))]",
            playing ? "animate-viz" : "scale-y-[0.12]",
          )}
          style={{ "--viz-speed": `${speed}s`, animationDelay: `${-i * 0.13}s` } as React.CSSProperties}
        />
      ))}
    </div>
  );
}
