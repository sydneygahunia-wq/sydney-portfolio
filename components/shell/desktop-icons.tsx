import Link from "next/link";
import { Disc3, Monitor, Music } from "lucide-react";

const icons = [
  { label: "My Computer", href: "/", Icon: Monitor },
  { label: "My Albums", href: "/library", Icon: Disc3 },
  { label: "Skills", href: "/#mixtapes", Icon: Music },
];

// Win98 desktop shortcuts (md+). Single-click, because the web isn't Windows.
export function DesktopIcons() {
  return (
    <nav aria-label="Desktop shortcuts" className="hidden w-[76px] shrink-0 flex-col items-center gap-4 pt-1 md:flex">
      {icons.map(({ label, href, Icon }) => (
        <Link key={label} href={href} className="group flex w-full flex-col items-center gap-1 outline-none">
          <Icon size={34} strokeWidth={1.5} className="text-ink drop-shadow-[1px_1px_0_rgba(255,255,255,.8)]" />
          <span className="px-0.5 text-center text-[11px] leading-tight text-ink group-hover:bg-select group-focus-visible:bg-select">
            {label}
          </span>
        </Link>
      ))}
    </nav>
  );
}
