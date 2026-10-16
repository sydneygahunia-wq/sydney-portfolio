import { cn } from "@/lib/utils";

function Reel({ spinning, wound }: { spinning: boolean; wound: number }) {
  return (
    <div className="relative grid aspect-square w-[30%] place-items-center">
      {/* wound tape */}
      <div className="absolute rounded-full bg-[#7a6a96]" style={{ width: `${wound}%`, height: `${wound}%` }} />
      <div
        className={cn(
          "relative h-[52%] w-[52%] rounded-full bg-[repeating-conic-gradient(#f2f2f2_0_22deg,#8a8a8a_22deg_60deg)] shadow-[0_0_0_2px_hsl(var(--ink))]",
          spinning ? "animate-spin-slow" : "group-hover/tape:animate-spin-slow",
        )}
      >
        <div className="absolute inset-[34%] rounded-full bg-ink" />
      </div>
    </div>
  );
}

// Mixtape: CSS-drawn cassette with a handwritten label. Reels turn on hover and while playing.
export function Cassette({
  title,
  side = "A",
  subtitle,
  color,
  spinning = false,
  className,
}: {
  title: string;
  side?: string;
  subtitle?: string;
  color: string;
  spinning?: boolean;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={cn("group/tape relative aspect-[1.58] rounded-[7px] p-[5%] shadow-[0_8px_20px_rgba(74,59,107,.35)] [container-type:inline-size]", className)}
      style={{ background: `linear-gradient(160deg, ${color}, color-mix(in srgb, ${color} 55%, hsl(var(--p-purple))))` }}
    >
      {/* screws */}
      {["left-[3%] top-[5%]", "right-[3%] top-[5%]", "bottom-[5%] left-[3%]", "bottom-[5%] right-[3%]"].map((p) => (
        <span key={p} className={cn("absolute h-[3.5cqw] w-[3.5cqw] rounded-full bg-[radial-gradient(circle,#bbb_30%,#555_70%)]", p)} />
      ))}

      {/* label */}
      <div className="relative h-[68%] rounded-[3px] bg-paper px-[4%] pt-[3%] text-ink">
        <div className="flex items-center gap-[3%]">
          <span className="font-display text-[7cqw] leading-none">{side}</span>
          <span className="truncate font-hand text-[6.2cqw] font-bold leading-tight">{title}</span>
        </div>
        <div className="mt-[1.5%] h-[1.4cqw]" style={{ background: color }} />
        {subtitle && <p className="mt-[1%] truncate font-hand text-[3.8cqw] text-ink/70">{subtitle}</p>}

        {/* tape window */}
        <div className="absolute inset-x-[16%] bottom-[8%] flex h-[42%] items-center justify-between rounded-full bg-[#4a3d66] px-[6%] shadow-[inset_0_2px_6px_rgba(0,0,0,.5)]">
          <Reel spinning={spinning} wound={92} />
          <div className="mx-[2%] h-[38%] flex-1 rounded-sm bg-white/20" />
          <Reel spinning={spinning} wound={62} />
        </div>
      </div>

      {/* head opening */}
      <div className="mx-auto mt-[3%] h-[16%] w-[62%] bg-ink/25 [clip-path:polygon(8%_0,92%_0,100%_100%,0_100%)]" />
    </div>
  );
}
