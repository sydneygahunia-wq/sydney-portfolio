import Link from "next/link";
import { cn } from "@/lib/utils";

const base =
  "bevel-out inline-flex items-center justify-center gap-1.5 bg-face px-3 py-1.5 text-[13px] text-ink active:bevel-in active:translate-y-px disabled:text-face-shadow";

type Common = { className?: string; children: React.ReactNode; pressed?: boolean };

// Win98 push button. Renders <a> when given href, <button> otherwise.
export function Btn({
  href,
  external,
  className,
  pressed,
  children,
  ...props
}: Common & { href?: string; external?: boolean } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const cls = cn(base, pressed && "bevel-in translate-y-px", className);
  if (href) {
    return external || href.startsWith("mailto:") ? (
      <a href={href} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined} className={cls}>
        {children}
      </a>
    ) : (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <button type="button" className={cls} {...props}>
      {children}
    </button>
  );
}

// Small square Winamp transport button.
export function AmpBtn({
  label,
  className,
  pressed,
  children,
  ...props
}: Common & { label: string } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cn(
        "grid h-[22px] min-w-[26px] place-items-center bg-gradient-to-b from-white to-amp px-1 text-ink amp-out active:amp-in",
        pressed && "amp-in bg-p-pink bg-none",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
