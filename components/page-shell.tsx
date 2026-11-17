import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PondScene } from "@/components/pond/pond-scene";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/experience", label: "experience" },
  { href: "/projects", label: "projects" },
];

// Inner pages: the live pond keeps moving behind the content (dimmed), with a "back to pond" pill and a centred title.
export function PageShell({
  title,
  current,
  intro,
  children,
}: {
  title: string;
  current: string;
  intro?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-dvh overflow-x-hidden bg-pond-deep">
      <PondScene variant="page" />

      <header className="relative z-10 mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 pt-5 sm:px-6">
        <Link href="/" className="glass inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13px] text-cream/90 transition-colors hover:bg-white/[0.14]">
          <ArrowLeft size={14} aria-hidden /> back to pond
        </Link>
        <nav aria-label="Pages" className="flex gap-1">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={item.href === current ? "page" : undefined}
              className={cn(
                "rounded-full px-3 py-2 text-[13px] transition-colors",
                item.href === current ? "glass text-cream" : "text-mist hover:text-cream",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>

      <main className="relative z-10 mx-auto max-w-3xl px-4 pb-24 pt-14 sm:px-6 sm:pt-20">
        <div className="mb-12 text-center">
          <h1 className="font-serif text-title text-cream">
            <span aria-hidden className="mr-3 inline-block h-2.5 w-2.5 -translate-y-[0.35em] rounded-full bg-petal shadow-[0_0_12px_hsl(var(--petal))]" />
            {title}
          </h1>
          {intro && <p className="mx-auto mt-4 max-w-md text-balance text-sm text-mist">{intro}</p>}
        </div>
        {children}
      </main>
    </div>
  );
}

export function Chips({ items, label }: { items: string[]; label: string }) {
  return (
    <ul aria-label={label} className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <li key={item} className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5 text-xs text-mist">
          {item}
        </li>
      ))}
    </ul>
  );
}
