import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LiveJewelCase, PlayAlbumButton, TrackList } from "@/components/album/album-controls";
import { CdShelf } from "@/components/retro/cd-shelf";
import { RetroHeading } from "@/components/retro/heading";
import { albumLength, albums, getAlbum, kindLabel, profile } from "@/lib/content";

export const dynamicParams = false;
export const generateStaticParams = () => albums.map((a) => ({ slug: a.slug }));

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const album = getAlbum(params.slug);
  return album ? { title: `${album.title} — ${album.role}`, description: `${album.role} · ${album.org} · ${album.period}` } : {};
}

export default function AlbumPage({ params }: { params: { slug: string } }) {
  const album = getAlbum(params.slug);
  if (!album) notFound();
  const [from, to] = album.colors;
  const more = albums.filter((a) => a.slug !== album.slug && a.kind !== "Playlist");
  const properties = [
    ["Artist", profile.name],
    ["Role", album.role],
    ["Label", album.org],
    ["Released", album.period],
    ...(album.location ? [["Location", album.location]] : []),
    ["Length", albumLength(album)],
  ];

  return (
    <article>
      {/* CD booklet header, tinted with the cover colors */}
      <header
        className="relative overflow-hidden"
        style={{ background: `radial-gradient(90% 90% at 15% 0%, ${from}, transparent 70%), linear-gradient(180deg, ${to}, hsl(var(--screen)))` }}
      >
        <div aria-hidden className="scanlines absolute inset-0 opacity-50" />
        <div className="relative grid gap-6 px-4 py-8 md:grid-cols-[auto_1fr] md:items-end md:px-8">
          <div className="mx-auto w-[min(78vw,300px)] pr-[22%] md:mx-0">
            <LiveJewelCase album={album} />
          </div>
          <div className="min-w-0">
            <p className="inline-block bg-p-pink px-2 py-0.5 font-display text-[11px] uppercase text-ink shadow-[2px_2px_0_hsl(var(--ink))]">
              {kindLabel[album.kind]}
            </p>
            <h1 className="pop-text mt-3 break-words font-display text-album-title">{album.title}</h1>

            <fieldset className="bevel-out mt-5 max-w-xl bg-face px-3 pb-3 pt-1 text-ink">
              <legend className="px-1 text-[12px]">Properties</legend>
              <dl className="grid grid-cols-[5.5rem_1fr] gap-x-3 gap-y-1 text-[12px]">
                {properties.map(([k, v]) => (
                  <div key={k} className="contents">
                    <dt>{k}:</dt>
                    <dd className="truncate font-bold">{v}</dd>
                  </div>
                ))}
              </dl>
            </fieldset>
          </div>
        </div>
      </header>

      <div className="px-4 pb-16 md:px-8">
        <div className="flex flex-wrap items-center gap-3 py-6">
          <PlayAlbumButton album={album} />
          {album.stack.length > 0 && (
            <ul className="flex flex-wrap gap-1.5" aria-label="Tech stack">
              {album.stack.map((s) => (
                <li key={s} className="amp-in bg-lcd-bg px-2 font-lcd text-[17px] leading-6 text-lcd">
                  {s}
                </li>
              ))}
            </ul>
          )}
        </div>

        <TrackList album={album} />

        <p className="mt-6 text-[11px] text-muted">
          ℗ {album.year} {profile.name} · {album.org}
          {album.location && <> · {album.location}</>}
        </p>

        <section className="mt-12" aria-labelledby="more-by">
          <RetroHeading id="more-by" kicker="// also in the rack" title={`More by ${profile.name.split(" ")[0]}`} href="/library" />
          <div className="bevel-out bg-face p-4 text-ink sm:p-5">
            <CdShelf albums={more} />
          </div>
        </section>
      </div>
    </article>
  );
}
