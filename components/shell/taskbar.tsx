"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, m } from "framer-motion";
import { Disc3, Globe, House, Mail, Music, Volume2 } from "lucide-react";
import { usePlayer } from "@/components/player-provider";
import { profile, trackName } from "@/lib/content";
import { cn } from "@/lib/utils";

const menu = [
  { label: "Home", href: "/", Icon: House },
  { label: "My Albums", href: "/library", Icon: Disc3 },
  { label: "CD Rack", href: "/#cd-rack", Icon: Disc3 },
  { label: "Skills", href: "/#mixtapes", Icon: Music },
  { divider: true },
  { label: "LinkedIn", href: profile.linkedin, Icon: Globe, external: true },
  { label: "Email Sydney", href: `mailto:${profile.email}`, Icon: Mail, external: true },
] as const;

function Clock() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }));
    tick();
    const id = setInterval(tick, 15_000);
    return () => clearInterval(id);
  }, []);
  return <span className="min-w-[52px] text-center tabular-nums">{time}</span>;
}

// Win98 taskbar: Start menu (site nav), task buttons, system tray.
export function Taskbar() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { current, playing } = usePlayer();

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <footer className="relative z-40 flex h-[34px] shrink-0 items-center gap-1 border-t border-white bg-face px-[3px] text-ink shadow-[inset_0_1px_0_hsl(var(--face-hilite))] pb-[env(safe-area-inset-bottom)]">
      <div ref={ref} className="relative">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="start-menu"
          className={cn("flex h-[26px] items-center gap-1.5 bg-face px-2 text-[13px] font-bold", open ? "bevel-in" : "bevel-out")}
        >
          <Disc3 size={16} className="text-ink" /> Start
        </button>

        <AnimatePresence>
          {open && (
            <m.div
              id="start-menu"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.12 }}
              className="bevel-out absolute bottom-[30px] left-0 flex w-60 bg-face p-[3px]"
            >
              <div className="flex w-7 items-end bg-gradient-to-t from-title-from to-title-to pb-2">
                <span className="-rotate-90 origin-bottom-left translate-x-[22px] whitespace-nowrap text-[17px] font-bold text-ink">
                  <span className="font-display">SydAmp</span>
                  <span className="font-normal"> 98</span>
                </span>
              </div>
              <ul className="flex-1 py-1">
                {menu.map((item, i) =>
                  "divider" in item ? (
                    <li key={i} aria-hidden className="mx-1 my-1 border-t border-face-shadow border-b-white" />
                  ) : (
                    <li key={item.label}>
                      {(() => {
                        const cls = "flex items-center gap-3 px-3 py-2 text-[13px] hover:bg-select focus-visible:bg-select";
                        const inner = (
                          <>
                            <item.Icon size={18} /> {item.label}
                          </>
                        );
                        return "external" in item ? (
                          <a href={item.href} className={cls} target={item.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" onClick={() => setOpen(false)}>
                            {inner}
                          </a>
                        ) : (
                          <Link href={item.href} className={cls} onClick={() => setOpen(false)}>
                            {inner}
                          </Link>
                        );
                      })()}
                    </li>
                  ),
                )}
              </ul>
            </m.div>
          )}
        </AnimatePresence>
      </div>

      <span aria-hidden className="mx-0.5 h-6 border-l border-face-shadow bg-white" />
      <span className="bevel-in hidden h-[26px] max-w-[220px] flex-1 items-center gap-1.5 bg-[repeating-conic-gradient(hsl(var(--face))_0_25%,#fff_0_50%)] bg-[length:2px_2px] px-2 text-[12px] font-bold sm:flex">
        <Disc3 size={14} /> <span className="truncate">SydAmp Media Library</span>
      </span>
      <span className="bevel-out hidden h-[26px] max-w-[220px] flex-1 items-center gap-1.5 px-2 text-[12px] md:flex">
        <Music size={14} /> <span className="truncate">{playing ? `${current.album.title} - ${trackName(current.album, current.index)}` : "SydAmp"}</span>
      </span>

      <div className="bevel-in ml-auto flex h-[26px] items-center gap-2 px-2 text-[12px]">
        <Volume2 size={14} aria-label={playing ? "Playing" : "Stopped"} className={playing ? "" : "opacity-50"} />
        <Clock />
      </div>
    </footer>
  );
}
