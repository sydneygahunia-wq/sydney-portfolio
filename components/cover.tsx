// Generated "album art": gradient + icon + type, so there are zero image requests.
import { Bot, Heart, HeartPulse, Smartphone, Sparkles, Stethoscope, Users } from "lucide-react";
import { kindLabel, type Album, type CoverIcon } from "@/lib/content";
import { cn } from "@/lib/utils";

const icons: Record<CoverIcon, typeof Heart> = {
  sparkles: Sparkles,
  stethoscope: Stethoscope,
  smartphone: Smartphone,
  "heart-pulse": HeartPulse,
  users: Users,
  heart: Heart,
  bot: Bot,
};

export function Cover({
  album,
  size = "md",
  className,
}: {
  album: Album;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const Icon = icons[album.icon];
  const [from, to] = album.colors;
  return (
    <div
      aria-hidden
      className={cn("relative aspect-square shrink-0 overflow-hidden rounded-sm shadow-[0_8px_24px_rgba(0,0,0,.5)] [container-type:inline-size]", className)}
      style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
    >
      {size === "sm" ? (
        <Icon className="absolute inset-0 m-auto h-1/2 w-1/2 text-ink/80" fill={album.icon === "heart" ? "currentColor" : "none"} />
      ) : (
        <>
          <Icon
            className="absolute -bottom-[12%] -right-[12%] h-[70%] w-[70%] text-white/70"
            strokeWidth={1.25}
            fill={album.icon === "heart" ? "rgba(255,255,255,.4)" : "none"}
          />
          <div className="absolute inset-0 flex flex-col justify-between p-[8%]">
            <span className="font-ui text-[max(7px,5.5cqw)] font-bold uppercase tracking-widest text-ink/75">
              {kindLabel[album.kind]}
            </span>
            <span
              className={cn(
                "font-display leading-[0.95] text-ink [text-shadow:2px_2px_0_rgba(255,255,255,.7)]",
                size === "lg" ? "text-[11cqw]" : "text-[10cqw]",
              )}
            >
              {album.title}
            </span>
          </div>
        </>
      )}
    </div>
  );
}
