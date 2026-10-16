"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, House } from "lucide-react";
import { useLocation } from "@/components/shell/app-shell";

const tool =
  "flex h-[26px] items-center gap-1 px-2 text-[12px] text-ink hover:bevel-out active:bevel-in";

// IE5-style toolbar: Back / Forward / Home, then the address bar. Doubles as the sticky nav.
export function Toolbar() {
  const router = useRouter();
  const { path } = useLocation();

  return (
    <nav aria-label="Browser" className="flex shrink-0 flex-col gap-[2px] border-b border-face-shadow pb-[3px] pt-[2px] sm:flex-row sm:items-center">
      <div className="flex items-center">
        <button type="button" onClick={() => router.back()} className={tool}>
          <ArrowLeft size={14} /> Back
        </button>
        <button type="button" onClick={() => router.forward()} className={`${tool} hidden sm:flex`}>
          <ArrowRight size={14} /> Forward
        </button>
        <Link href="/" className={tool}>
          <House size={14} /> Home
        </Link>
      </div>
      <div className="flex min-w-0 flex-1 items-center gap-1.5 px-1 text-[12px]">
        <span>Address</span>
        <span className="bevel-in flex h-[22px] min-w-0 flex-1 items-center gap-1 bg-white px-2 font-ui text-[12px] text-ink">
          <span aria-hidden>📁</span>
          <span className="truncate">{path}</span>
        </span>
      </div>
    </nav>
  );
}
