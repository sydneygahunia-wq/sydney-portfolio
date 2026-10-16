import type { Metadata } from "next";
import { CdShelf } from "@/components/retro/cd-shelf";
import { RetroHeading } from "@/components/retro/heading";
import { albums } from "@/lib/content";

export const metadata: Metadata = { title: "My Albums" };

// "My Albums" folder: every release, including the Liked Skills playlist.
export default function LibraryPage() {
  return (
    <div className="px-4 pb-16 pt-8 md:px-8">
      <RetroHeading id="library-title" kicker={`// ${albums.length} object(s)`} title="My Albums" />
      <div className="bevel-out bg-face p-4 text-ink sm:p-5">
        <CdShelf albums={albums} />
      </div>
    </div>
  );
}
