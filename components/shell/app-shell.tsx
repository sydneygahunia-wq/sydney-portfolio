"use client";

import { createContext, useContext, useRef } from "react";
import { usePathname } from "next/navigation";
import { Disc3 } from "lucide-react";
import { Window } from "@/components/retro/window";
import { AmpPlayer } from "@/components/shell/amp-player";
import { AmpPlaylist } from "@/components/shell/amp-playlist";
import { DesktopIcons } from "@/components/shell/desktop-icons";
import { StatusBar } from "@/components/shell/status-bar";
import { Taskbar } from "@/components/shell/taskbar";
import { Toolbar } from "@/components/shell/toolbar";
import { getAlbum } from "@/lib/content";

// The media-library window's content pane scrolls (not the page), like a real desktop app.
const ScrollContext = createContext<React.RefObject<HTMLElement> | null>(null);
export const useScrollContainer = () => useContext(ScrollContext)!;

// Window title + fake Windows path for the current route.
export function useLocation() {
  const pathname = usePathname();
  if (pathname.startsWith("/album/")) {
    const album = getAlbum(pathname.split("/")[2]);
    const name = album?.title ?? "Unknown";
    return { title: name, path: `C:\\SydAmp\\My Albums\\${name}` };
  }
  if (pathname === "/library") return { title: "My Albums", path: "C:\\SydAmp\\My Albums" };
  return { title: "Home", path: "C:\\SydAmp\\" };
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const scrollRef = useRef<HTMLElement>(null);
  const { title } = useLocation();

  return (
    <ScrollContext.Provider value={scrollRef}>
      <div className="flex h-dvh flex-col">
        <div className="flex min-h-0 flex-1 gap-3 sm:p-3">
          <DesktopIcons />
          <Window
            title={`SydAmp Media Library - ${title}`}
            icon={<Disc3 size={14} />}
            className="min-w-0 flex-1"
            bodyClassName="flex flex-col"
          >
            <Toolbar />
            <main
              ref={scrollRef}
              id="main"
              className="win-scroll bevel-in relative min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-screen p-[2px] text-foreground"
            >
              {children}
            </main>
            <StatusBar />
          </Window>
          <aside className="hidden w-[300px] shrink-0 flex-col lg:flex" aria-label="SydAmp player">
            <AmpPlayer />
            <AmpPlaylist className="min-h-0 flex-1" />
          </aside>
        </div>
        <div className="lg:hidden">
          <AmpPlayer compact />
        </div>
        <Taskbar />
      </div>
    </ScrollContext.Provider>
  );
}
