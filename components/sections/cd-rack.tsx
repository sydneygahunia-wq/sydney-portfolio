"use client";

import { useState } from "react";
import { CdShelf } from "@/components/retro/cd-shelf";
import { RetroHeading } from "@/components/retro/heading";
import { albums, type AlbumKind } from "@/lib/content";
import { cn } from "@/lib/utils";

const allTabs: { label: string; kinds: AlbumKind[] }[] = [
  { label: "Experience", kinds: ["Album"] },
  { label: "Projects", kinds: ["Single"] },
];
// A tab only shows up once it has something in it (e.g. Projects reappears when a project is added).
const tabs = allTabs.filter((t) => albums.some((a) => t.kinds.includes(a.kind)));

// Discography as a Win98 property sheet: tab strip + raised gray panel holding the jewel cases.
export function CdRack() {
  const [tab, setTab] = useState(tabs[0].label);
  const kinds = tabs.find((t) => t.label === tab)!.kinds;

  return (
    <section id="cd-rack" aria-labelledby="cd-rack-title" className="scroll-mt-4 px-4 pt-12 md:px-8">
      <RetroHeading id="cd-rack-title" kicker="// discography" title="CD Rack" href="/library" />

      <div role="tablist" aria-label="Filter releases" className="relative z-10 flex gap-[2px] pl-1">
        {tabs.map((t) => {
          const selected = tab === t.label;
          return (
            <button
              key={t.label}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls="cd-rack-panel"
              onClick={() => setTab(t.label)}
              className={cn(
                "rounded-t-[3px] border border-b-0 border-l-white border-r-black border-t-white bg-face px-3 text-[12px] text-ink shadow-[inset_-1px_0_0_hsl(var(--face-shadow))]",
                selected ? "-mb-[2px] py-1.5 font-bold" : "mt-1 py-1",
              )}
            >
              {t.label}
            </button>
          );
        })}
      </div>
      <div id="cd-rack-panel" role="tabpanel" aria-label={tab} className="bevel-out bg-face p-4 text-ink sm:p-5">
        <CdShelf albums={albums.filter((a) => kinds.includes(a.kind))} />
      </div>
    </section>
  );
}
