"use client";

import { useEffect, useRef } from "react";
import { AmpWindow } from "@/components/retro/window";
import { queue, usePlayer } from "@/components/player-provider";
import { formatTime, toSeconds, trackName } from "@/lib/content";
import { cn } from "@/lib/utils";

const totalTime = formatTime(queue.reduce((s, q) => s + toSeconds(q.track.duration), 0));

// Winamp playlist editor: the whole career as one queue. Click a line to play it.
export function AmpPlaylist({ className }: { className?: string }) {
  const { position, play } = usePlayer();
  const listRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const list = listRef.current;
    const row = list?.querySelector<HTMLElement>("[data-current]");
    if (list && row) list.scrollTo({ top: row.offsetTop - list.clientHeight / 2 + row.clientHeight / 2, behavior: "smooth" });
  }, [position]);

  return (
    <AmpWindow title="SydAmp Playlist" className={cn("flex flex-col", className)}>
      <ol
        ref={listRef}
        aria-label="Playlist"
        className="win-scroll amp-in relative mx-1 min-h-0 flex-1 overflow-y-auto bg-lcd-bg py-0.5"
      >
        {queue.map((q, i) => {
          const current = i === position;
          return (
            <li key={`${q.album.slug}-${q.index}`} data-current={current || undefined}>
              <button
                type="button"
                onClick={() => play(q.album.slug, q.index)}
                aria-current={current || undefined}
                className={cn(
                  "flex w-full gap-1 px-1 text-left font-lcd text-[16px] leading-[18px]",
                  current ? "bg-select font-bold text-ink" : "text-lcd hover:bg-white/60",
                )}
              >
                <span className="min-w-0 flex-1 truncate">
                  {i + 1}. {q.album.title} - {trackName(q.album, q.index)}
                </span>
                <span className="tabular-nums">{q.track.duration}</span>
              </button>
            </li>
          );
        })}
      </ol>
      <div className="flex items-center justify-between px-1.5 py-1 font-lcd text-[15px] leading-none text-ink/80">
        <span>{queue.length} tracks</span>
        <span className="amp-in bg-lcd-bg px-1 text-lcd">{totalTime}</span>
      </div>
    </AmpWindow>
  );
}
