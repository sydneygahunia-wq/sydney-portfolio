"use client";

import { Pause, Play } from "lucide-react";
import { Btn } from "@/components/retro/button";
import { JewelCase } from "@/components/retro/jewel-case";
import { Visualizer } from "@/components/retro/visualizer";
import { usePlayer } from "@/components/player-provider";
import type { Album } from "@/lib/content";
import { cn } from "@/lib/utils";

// Jewel case whose disc slides out and spins while this album plays.
export function LiveJewelCase({ album, className }: { album: Album; className?: string }) {
  const { isCurrent, playing } = usePlayer();
  return <JewelCase album={album} size="lg" live={isCurrent(album.slug) && playing} className={className} />;
}

export function PlayAlbumButton({ album }: { album: Album }) {
  const { play, toggle, playing, isCurrent } = usePlayer();
  const live = isCurrent(album.slug) && playing;
  return (
    <Btn onClick={() => (isCurrent(album.slug) ? toggle() : play(album.slug, 0))} className="px-5 font-bold">
      {live ? <><Pause size={12} fill="currentColor" /> Pause</> : <><Play size={12} fill="currentColor" /> Play all</>}
    </Btn>
  );
}

// Winamp-playlist-style tracklist; each resume bullet is a track.
export function TrackList({ album }: { album: Album }) {
  const { play, playing, isCurrent } = usePlayer();
  return (
    <ol aria-label={`${album.title} tracks`} className="amp-in bg-lcd-bg p-1">
      {album.tracks.map((track, i) => {
        const current = isCurrent(album.slug, i);
        const startsGroup = track.group && track.group !== album.tracks[i - 1]?.group;
        return (
          <li key={i}>
            {startsGroup && (
              <h3 className={cn("px-2 pb-1.5 font-display text-[15px] italic text-ink", i > 0 ? "mt-4 pt-2" : "pt-1")}>
                <span className="border-b-2 border-p-pink">{track.group}</span>
              </h3>
            )}
            <button
              type="button"
              onClick={() => play(album.slug, i)}
              className={cn(
                "grid w-full grid-cols-[2rem_minmax(0,1fr)_3.5rem] items-start gap-3 px-2 py-3 text-left",
                current ? "bg-select" : "hover:bg-white/60",
                i % 2 === 1 && !current && "bg-white/30",
              )}
            >
              <span className="flex h-6 items-center justify-end font-lcd text-[19px] text-lcd">
                {current ? <Visualizer playing={playing} count={4} className="h-3.5" /> : `${String(i + 1).padStart(2, "0")}.`}
              </span>
              <span className="min-w-0">
                {track.title && <span className="block font-bold leading-6 text-ink">{track.title}</span>}
                <span className={cn("block text-[13px] leading-6 text-ink", track.title && "text-[12px] text-ink/75")}>
                  {track.detail}
                </span>
              </span>
              <span className="text-right font-lcd text-[19px] leading-6 tabular-nums text-lcd">{track.duration}</span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}
