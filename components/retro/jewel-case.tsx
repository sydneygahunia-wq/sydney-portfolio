import { Cover } from "@/components/cover";
import type { Album } from "@/lib/content";
import { cn } from "@/lib/utils";

// Iridescent CD with a center hole — pure CSS gradients.
export function Disc({ spinning, className }: { spinning?: boolean; className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("aspect-square rounded-full shadow-[0_4px_14px_rgba(74,59,107,.35)]", spinning && "animate-spin-slow", className)}
      style={{
        background: [
          "radial-gradient(circle, #0b0b12 0 9%, #d9d9e3 9.5% 15%, rgba(255,255,255,.25) 15.5% 17%, transparent 17.5%)",
          "conic-gradient(from 20deg, #e6e6ef, #bfe7ff, #f4c6ff, #fff6b8, #c9ffd6, #e6e6ef, #a7c8ff, #ffd1e6, #e6e6ef)",
        ].join(","),
      }}
    >
      <div className="h-full w-full rounded-full bg-[repeating-radial-gradient(circle,rgba(0,0,0,.05)_0_1px,transparent_1px_3px)]" />
    </div>
  );
}

// CD jewel case: spine hinge + glossy plastic over the cover art. The disc slides out on hover / while playing.
export function JewelCase({
  album,
  live = false,
  size = "md",
  className,
}: {
  album: Album;
  live?: boolean;
  size?: "md" | "lg";
  className?: string;
}) {
  return (
    <div className={cn("group/case relative aspect-square", className)}>
      <div
        className={cn(
          "absolute inset-[5%] transition-transform duration-500 ease-out",
          live ? "translate-x-[38%]" : "group-hover/case:translate-x-[30%] group-focus-within/case:translate-x-[30%]",
        )}
      >
        <Disc spinning={live} className="h-full w-full" />
      </div>
      <div className="relative z-10 flex h-full w-full overflow-hidden rounded-[3px] border border-white/40 bg-[#111] shadow-[2px_6px_18px_rgba(74,59,107,.4)]">
        {/* hinge spine */}
        <div
          aria-hidden
          className="w-[8%] shrink-0 border-r border-ink/30 bg-[repeating-linear-gradient(180deg,#d9cef3_0_2px,#b9a9e0_2px_4px)]"
        />
        <Cover album={album} size={size} className="h-full flex-1 rounded-none shadow-none" />
        {/* glossy plastic */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,.38)_0%,rgba(255,255,255,.08)_28%,transparent_45%,transparent_70%,rgba(255,255,255,.12)_100%)]"
        />
      </div>
    </div>
  );
}
