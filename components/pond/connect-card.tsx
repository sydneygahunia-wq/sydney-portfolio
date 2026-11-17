"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, m } from "framer-motion";
import { Github, Linkedin, Mail, X } from "lucide-react";
import { profile } from "@/lib/content";

// Glass card with email, LinkedIn and GitHub. Fixed near the bottom so it never covers the title.
export function ConnectCard({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    const onDown = (e: PointerEvent) => {
      const t = e.target as HTMLElement;
      if (!ref.current?.contains(t) && !t.closest("[aria-controls=connect-card]")) onClose();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open, onClose]);

  const row = "flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] transition-colors hover:bg-white/10";

  return (
    <div className="pointer-events-none absolute bottom-6 left-1/2 z-30 -translate-x-1/2">
      <AnimatePresence>
        {open && (
          <m.div
            ref={ref}
            id="connect-card"
            role="dialog"
            aria-label={`Connect with ${profile.name}`}
            initial={{ opacity: 0, y: 12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="glass pointer-events-auto w-[min(300px,calc(100vw-2rem))] rounded-2xl bg-pond-deep/75 p-2"
          >
            <div className="flex items-center justify-between px-3 pb-1 pt-1.5">
              <p className="font-serif text-xl italic text-cream">say hi</p>
              <button type="button" onClick={onClose} aria-label="Close" className="rounded-full p-1 text-cream/70 hover:bg-white/10 hover:text-cream">
                <X size={15} />
              </button>
            </div>
            <a href={`mailto:${profile.email}`} className={row}>
              <Mail size={16} className="shrink-0 text-petal" />
              <span className="truncate">{profile.email}</span>
            </a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer" className={row}>
              <Linkedin size={16} className="shrink-0 text-petal" />
              LinkedIn
            </a>
            <a href={profile.github} target="_blank" rel="noreferrer" className={row}>
              <Github size={16} className="shrink-0 text-petal" />
              GitHub
            </a>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
