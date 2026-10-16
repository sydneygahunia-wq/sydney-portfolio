"use client";

import { usePlayer } from "@/components/player-provider";
import { trackName } from "@/lib/content";

// Win98 status bar along the bottom of the media-library window.
export function StatusBar() {
  const { current, playing } = usePlayer();
  return (
    <div className="flex shrink-0 gap-[2px] pt-[2px] text-[11px] text-ink">
      <span className="bevel-in shrink-0 px-2 py-[2px]">Done</span>
      <span className="bevel-in min-w-0 flex-1 truncate px-2 py-[2px]">
        {playing ? "▶ Now playing: " : "■ Stopped: "}
        {trackName(current.album, current.index)} — {current.album.title}
      </span>
      <span className="bevel-in hidden shrink-0 px-2 py-[2px] sm:block">🌐 Internet zone</span>
    </div>
  );
}
