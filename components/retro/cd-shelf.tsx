"use client";

import Link from "next/link";
import { AnimatePresence, m } from "framer-motion";
import { Pause, Play } from "lucide-react";
import { JewelCase } from "@/components/retro/jewel-case";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import { usePlayer } from "@/components/player-provider";
import type { Album } from "@/lib/content";
import { cn } from "@/lib/utils";

// Grid of jewel cases with captions. Caption link is stretched over the item; the play button sits above it.
export function CdShelf({ albums, className }: { albums: Album[]; className?: string }) {
  const { play, toggle, playing, isCurrent } = usePlayer();
  return (
    <ul className={cn("grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5", className)}>
      <AnimatePresence mode="popLayout" initial={false}>
        {albums.map((album, i) => {
          const live = isCurrent(album.slug) && playing;
          // Experience captions lead with the role; the company goes underneath.
          const [primary, secondary] = album.kind === "Album" ? [album.role, album.title] : [album.title, album.role];
          return (
            <m.li
              key={album.slug}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.25, delay: i * 0.03 }}
              className="group relative"
            >
              {/* The cover is its own link: the spotlight layer sits above the caption's stretched link and used to swallow clicks.
                  Hidden from keyboard/screen readers because the caption link below goes to the same page. */}
              <Link href={`/album/${album.slug}`} tabIndex={-1} aria-hidden className="block">
                <CardSpotlight color="#ffffff" radius={160} className="overflow-visible pr-[22%]">
                  <JewelCase album={album} live={live} />
                </CardSpotlight>
              </Link>
              <div className="mt-3 flex items-start gap-2">
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/album/${album.slug}`}
                    className="block truncate text-[13px] font-bold after:absolute after:inset-0 after:content-[''] group-hover:underline"
                  >
                    {primary}
                  </Link>
                  <p className="truncate text-[11px] opacity-75">
                    {album.year} · {secondary}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => (isCurrent(album.slug) ? toggle() : play(album.slug, 0))}
                  aria-label={`${live ? "Pause" : "Play"} ${album.title}`}
                  className="bevel-out relative z-10 grid h-6 w-7 shrink-0 place-items-center bg-face text-[11px] text-ink active:bevel-in"
                >
                  {live ? <Pause size={11} fill="currentColor" /> : <Play size={11} fill="currentColor" />}
                </button>
              </div>
            </m.li>
          );
        })}
      </AnimatePresence>
    </ul>
  );
}
