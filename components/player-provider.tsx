"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { albums, toSeconds, type Album, type Track } from "@/lib/content";

export type QueueItem = { album: Album; track: Track; index: number };

// Every track across every album, in library order — the global "queue" (Winamp's playlist).
export const queue: QueueItem[] = albums.flatMap((album) => album.tracks.map((track, index) => ({ album, track, index })));
const position = (slug: string, index: number) => queue.findIndex((q) => q.album.slug === slug && q.index === index);

type PlayerState = {
  current: QueueItem;
  position: number;
  playing: boolean;
  play: (slug: string, index?: number) => void;
  toggle: () => void;
  stop: () => void;
  next: () => void;
  prev: () => void;
  shuffle: () => void;
  isCurrent: (slug: string, index?: number) => boolean;
};

type Clock = { elapsed: number; total: number; seek: (s: number) => void };

const PlayerContext = createContext<PlayerState | null>(null);
// Ticks every 500ms — split out so only the player chrome re-renders, not every track row.
const ClockContext = createContext<Clock | null>(null);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [pos, setPos] = useState(0); // starts queued on the current job, stopped
  const [playing, setPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const posRef = useRef(pos);
  posRef.current = pos;
  const total = toSeconds(queue[pos].track.duration);

  const jump = useCallback((p: number) => {
    setPos(p);
    setElapsed(0);
  }, []);

  const play = useCallback(
    (slug: string, index = 0) => {
      const p = position(slug, index);
      if (p === posRef.current) setPlaying((v) => !v);
      else {
        jump(p);
        setPlaying(true);
      }
    },
    [jump],
  );
  const toggle = useCallback(() => setPlaying((v) => !v), []);
  const stop = useCallback(() => {
    setPlaying(false);
    setElapsed(0);
  }, []);
  const next = useCallback(() => jump((posRef.current + 1) % queue.length), [jump]);
  const prev = useCallback(() => jump((posRef.current - 1 + queue.length) % queue.length), [jump]);
  const shuffle = useCallback(() => {
    let r = posRef.current;
    while (r === posRef.current) r = Math.floor(Math.random() * queue.length);
    jump(r);
    setPlaying(true);
  }, [jump]);

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => setElapsed((e) => e + 0.5), 500);
    return () => clearInterval(id);
  }, [playing]);
  useEffect(() => {
    if (elapsed >= total) next();
  }, [elapsed, total, next]);

  const value = useMemo<PlayerState>(
    () => ({
      current: queue[pos],
      position: pos,
      playing,
      play,
      toggle,
      stop,
      next,
      prev,
      shuffle,
      isCurrent: (slug, index) => queue[pos].album.slug === slug && (index === undefined || queue[pos].index === index),
    }),
    [pos, playing, play, toggle, stop, next, prev, shuffle],
  );
  const clock = useMemo<Clock>(() => ({ elapsed, total, seek: setElapsed }), [elapsed, total]);

  return (
    <PlayerContext.Provider value={value}>
      <ClockContext.Provider value={clock}>{children}</ClockContext.Provider>
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be used inside <PlayerProvider>");
  return ctx;
}

export function useClock() {
  const ctx = useContext(ClockContext);
  if (!ctx) throw new Error("useClock must be used inside <PlayerProvider>");
  return ctx;
}
