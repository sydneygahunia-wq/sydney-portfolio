"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { Linkedin, Mail, Users } from "lucide-react";
import { Btn } from "@/components/retro/button";
import { Window } from "@/components/retro/window";
import { profile } from "@/lib/content";

const linkedinLabel = profile.linkedin.replace(/^https?:\/\/(www\.)?/, "");

// "Connect" opens a small Win98 dialog with email + LinkedIn.
export function ConnectButton() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

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

  const row = "flex items-center gap-2.5 px-2 py-2 text-[12px] hover:bg-select focus-visible:bg-select";

  return (
    <div ref={ref} className="relative">
      <Btn onClick={() => setOpen((v) => !v)} pressed={open} aria-expanded={open} aria-controls="connect-dialog">
        <Users size={13} /> Connect
      </Btn>
      <AnimatePresence>
        {open && (
          <m.div
            id="connect-dialog"
            role="dialog"
            aria-label={`Connect with ${profile.name}`}
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.14 }}
            className="absolute left-0 top-full z-30 mt-2 w-[min(300px,calc(100vw-3rem))] origin-top-left"
          >
            <Window title={`Connect with ${profile.name.split(" ")[0]}`} icon={<Users size={13} />} onClose={() => setOpen(false)}>
              <ul className="bevel-in mt-[3px] bg-white">
                <li>
                  <a href={`mailto:${profile.email}`} className={row}>
                    <Mail size={16} className="shrink-0" />
                    <span className="min-w-0">
                      <span className="block font-bold">Email</span>
                      <span className="block truncate">{profile.email}</span>
                    </span>
                  </a>
                </li>
                <li className="border-t border-face">
                  <a href={profile.linkedin} target="_blank" rel="noreferrer" className={row}>
                    <Linkedin size={16} className="shrink-0" />
                    <span className="min-w-0">
                      <span className="block font-bold">LinkedIn</span>
                      <span className="block truncate">{linkedinLabel}</span>
                    </span>
                  </a>
                </li>
              </ul>
            </Window>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
