import Link from "next/link";

// Y2K section heading: italic Arial Black with a hard blue drop shadow.
export function RetroHeading({
  id,
  title,
  kicker,
  href,
  linkLabel = "SHOW ALL >>",
}: {
  id: string;
  title: string;
  kicker?: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4">
      <div>
        {kicker && <p className="font-lcd text-[17px] leading-none text-lcd">{kicker}</p>}
        <h2
          id={id}
          className="font-display text-[clamp(1.5rem,3.5vw,2rem)] italic leading-tight text-ink [text-shadow:2px_2px_0_hsl(var(--p-pink)),4px_4px_0_hsl(var(--p-blue))]"
        >
          {title}
        </h2>
      </div>
      {href && (
        <Link href={href} className="shrink-0 font-lcd text-[18px] text-lcd hover:underline">
          {linkLabel}
        </Link>
      )}
    </div>
  );
}
