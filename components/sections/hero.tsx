"use client";

import { Pause, Play } from "lucide-react";
import { Btn } from "@/components/retro/button";
import { ConnectButton } from "@/components/retro/connect-button";
import { Disc } from "@/components/retro/jewel-case";
import { usePlayer } from "@/components/player-provider";
import { albums, profile } from "@/lib/content";

const latest = albums[0];

// Scattered sparkles made of tiny radial gradients: no image request.
const sparkles =
  "radial-gradient(2px 2px at 12% 20%,#fff,transparent),radial-gradient(2px 2px at 68% 12%,#fff,transparent),radial-gradient(3px 3px at 84% 46%,#fff,transparent),radial-gradient(2px 2px at 32% 78%,#fff,transparent),radial-gradient(2px 2px at 52% 34%,#fff,transparent),radial-gradient(3px 3px at 22% 52%,#fff,transparent),radial-gradient(2px 2px at 91% 82%,#fff,transparent),radial-gradient(2px 2px at 6% 88%,#fff,transparent)";

export function Hero() {
  const { play, toggle, shuffle, playing, isCurrent } = usePlayer();
  const latestLive = playing && isCurrent(latest.slug);

  return (
    <section id="top" aria-labelledby="artist-name" className="relative">
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(80%_90%_at_85%_10%,hsl(var(--p-blue))_0%,transparent_60%),radial-gradient(70%_80%_at_0%_100%,hsl(var(--p-pink))_0%,transparent_60%),radial-gradient(60%_60%_at_40%_40%,hsl(var(--p-purple))_0%,transparent_70%),linear-gradient(180deg,hsl(var(--p-teal)),hsl(var(--screen)))]"
      />
      <div aria-hidden className="absolute inset-0" style={{ backgroundImage: sparkles }} />
      <div aria-hidden className="scanlines absolute inset-0" />

      <div className="relative flex flex-col gap-8 px-4 py-10 md:flex-row md:items-center md:gap-8 md:px-8 md:py-14">
        {/* Capped at the bio's width so the CD sits right beside the text instead of floating far right. */}
        <div className="min-w-0 md:max-w-xl">
          <h1 id="artist-name" className="pop-text font-display text-hero">
            {profile.name}
          </h1>
          <p className="mt-5 font-lcd text-[22px] leading-tight text-lcd">
            &gt; systems_design_eng @ uwaterloo
            <span aria-hidden className="animate-blink">_</span>
          </p>
          <div className="mt-3 space-y-2 text-pretty text-[13px] leading-relaxed text-ink/85">
            {profile.bio.map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <Btn onClick={() => (isCurrent(latest.slug) ? toggle() : play(latest.slug, 0))} className="font-bold">
              {latestLive ? (
                <>
                  <Pause size={12} fill="currentColor" /> Pause
                </>
              ) : (
                <>
                  <Play size={12} fill="currentColor" /> Play latest release
                </>
              )}
            </Btn>
            <Btn onClick={shuffle}>🔀 Shuffle</Btn>
            <ConnectButton />
          </div>
        </div>

        {/* Big CD: spins while anything is playing */}
        <div className="relative hidden w-[clamp(170px,20vw,250px)] shrink-0 md:block">
          <div aria-hidden className="absolute inset-[-12%] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,.8),transparent_65%)]" />
          <Disc spinning={playing} className="relative w-full" />
        </div>
      </div>
    </section>
  );
}
