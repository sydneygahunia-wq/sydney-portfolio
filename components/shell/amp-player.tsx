"use client";

import Link from "next/link";
import { Pause, Play, Shuffle, SkipBack, SkipForward, Square } from "lucide-react";
import { AmpBtn } from "@/components/retro/button";
import { Marquee } from "@/components/retro/marquee";
import { Visualizer } from "@/components/retro/visualizer";
import { AmpWindow } from "@/components/retro/window";
import { useClock, usePlayer } from "@/components/player-provider";
import { formatTime, trackName } from "@/lib/content";
import { cn } from "@/lib/utils";

function SeekBar({ thin = false }: { thin?: boolean }) {
  const { elapsed, total, seek } = useClock();
  const pct = Math.min(100, (elapsed / total) * 100);
  return (
    <div className={cn("amp-in relative bg-lcd-bg", thin ? "h-[6px]" : "h-[10px]")}>
      <div className="h-full bg-lcd-dim" style={{ width: `${pct}%` }} />
      {!thin && (
        <div
          aria-hidden
          className="amp-out absolute top-0 h-full w-[26px] bg-gradient-to-b from-white to-p-pink"
          style={{ left: `calc(${pct}% - ${(pct / 100) * 26}px)` }}
        />
      )}
      <input
        type="range"
        min={0}
        max={total}
        step={0.5}
        value={elapsed}
        onChange={(e) => seek(Number(e.target.value))}
        aria-label="Seek"
        aria-valuetext={`${formatTime(elapsed)} of ${formatTime(total)}`}
        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
      />
    </div>
  );
}

// ▶ playing, ❚❚ paused mid-track, ■ stopped at 0:00.
function StateGlyph({ playing }: { playing: boolean }) {
  const { elapsed } = useClock();
  const Icon = playing ? Play : elapsed > 0 ? Pause : Square;
  return <Icon size={10} className="text-lcd" fill="currentColor" aria-hidden />;
}

function TimeDisplay({ className }: { className?: string }) {
  const { elapsed } = useClock();
  return <span className={cn("font-lcd tabular-nums text-lcd lcd-glow", className)}>{formatTime(elapsed)}</span>;
}

// Winamp-classic main window. `compact` is the docked phone/tablet version.
export function AmpPlayer({ compact = false }: { compact?: boolean }) {
  const { current, position, playing, toggle, stop, next, prev, shuffle } = usePlayer();
  const { album, track } = current;
  const marquee = `${position + 1}. ${album.title} - ${trackName(album, current.index)} (${track.duration})`;

  const songTitle = (
    <div className="amp-in h-[20px] overflow-hidden bg-lcd-bg px-1" aria-live="polite">
      <span className="sr-only">Now playing: {marquee}</span>
      <div aria-hidden className="h-full">
        <Marquee duration="14s" gap="3rem" paused={!playing} className="h-full">
          <span className="whitespace-nowrap font-lcd text-[17px] leading-[20px] text-lcd lcd-glow">{marquee}</span>
          <span className="whitespace-nowrap font-lcd text-[17px] leading-[20px] text-lcd/50">***</span>
        </Marquee>
      </div>
    </div>
  );

  if (compact) {
    return (
      <AmpWindow title="SydAmp" className="mx-0 sm:mx-3 sm:mb-2">
        <div className="flex items-center gap-1.5 px-1 pb-1 pt-0.5">
          <div className="amp-in flex h-[38px] w-[64px] shrink-0 flex-col items-center justify-center bg-lcd-bg">
            <TimeDisplay className="text-[24px] leading-none" />
            <Visualizer playing={playing} count={10} className="h-2" />
          </div>
          <div className="min-w-0 flex-1 space-y-1">
            {songTitle}
            <SeekBar thin />
          </div>
          <AmpBtn label="Previous" onClick={prev}>
            <SkipBack size={12} fill="currentColor" />
          </AmpBtn>
          <AmpBtn label={playing ? "Pause" : "Play"} onClick={toggle} className="min-w-[32px]">
            {playing ? <Pause size={12} fill="currentColor" /> : <Play size={12} fill="currentColor" />}
          </AmpBtn>
          <AmpBtn label="Next" onClick={next}>
            <SkipForward size={12} fill="currentColor" />
          </AmpBtn>
        </div>
      </AmpWindow>
    );
  }

  return (
    <AmpWindow title="SydAmp">
      <div className="flex gap-1.5 px-1 pt-1">
        <div className="amp-in flex w-[112px] shrink-0 flex-col justify-between bg-lcd-bg px-1.5 pb-1 pt-0.5">
          <div className="flex items-center gap-1.5">
            <StateGlyph playing={playing} />
            <TimeDisplay className="ml-auto text-[36px] leading-[0.9]" />
          </div>
          <Visualizer playing={playing} count={16} className="h-6" />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          {songTitle}
          <div className="flex items-center gap-1 font-lcd text-[15px] leading-none text-ink/80">
            <span className="amp-in bg-lcd-bg px-1 text-lcd">320</span>kbps
            <span className="amp-in ml-1 bg-lcd-bg px-1 text-lcd">44</span>kHz
          </div>
          <div className="flex justify-end gap-2 font-lcd text-[14px] leading-none">
            <span className="text-ink/70">stereo</span>
          </div>
        </div>
      </div>

      <div className="px-1 pt-1.5">
        <SeekBar />
      </div>

      <div className="flex items-center gap-[2px] p-1">
        <AmpBtn label="Previous" onClick={prev}>
          <SkipBack size={12} fill="currentColor" />
        </AmpBtn>
        <AmpBtn label="Play" onClick={() => !playing && toggle()} pressed={playing}>
          <Play size={12} fill="currentColor" />
        </AmpBtn>
        <AmpBtn label="Pause" onClick={() => playing && toggle()}>
          <Pause size={12} fill="currentColor" />
        </AmpBtn>
        <AmpBtn label="Stop" onClick={stop}>
          <Square size={11} fill="currentColor" />
        </AmpBtn>
        <AmpBtn label="Next" onClick={next}>
          <SkipForward size={12} fill="currentColor" />
        </AmpBtn>
        <Link
          href={`/album/${album.slug}`}
          title="Open album"
          className="amp-out ml-1 grid h-[22px] min-w-[26px] place-items-center bg-gradient-to-b from-white to-amp px-1 text-[12px] text-ink active:amp-in"
        >
          <span aria-hidden>⏏</span>
          <span className="sr-only">Open {album.title}</span>
        </Link>
        <AmpBtn label="Shuffle" onClick={shuffle} className="ml-auto gap-1 px-2 font-lcd text-[14px]">
          <Shuffle size={11} /> SHUF
        </AmpBtn>
      </div>
    </AmpWindow>
  );
}
