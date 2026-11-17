"use client";

import { useRef } from "react";
import { PondScene, type Carrier } from "@/components/pond/pond-scene";
import { profile } from "@/lib/content";

// Each link rides on its own koi.
const carriers: Carrier[] = [
  { id: "experience", label: "experience", href: "/experience", variety: "kohaku" },
  { id: "projects", label: "projects", href: "/projects", variety: "gold" },
  { id: "connect", label: "connect", variety: "blue" },
];

export function HomePond() {
  const titleRef = useRef<HTMLDivElement>(null);
  return (
    <main className="relative h-dvh w-full overflow-hidden bg-pond-deep">
      <PondScene variant="home" carriers={carriers} avoidRef={titleRef} />
      <div className="pointer-events-none relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <div ref={titleRef}>
          <h1 className="font-serif text-hero text-cream [text-shadow:0_2px_24px_rgba(0,0,0,0.35)]">
            hi, i&rsquo;m <em className="text-petal-gradient pr-[0.08em]">{profile.firstName}</em>
          </h1>
          <p className="mx-auto mt-5 max-w-lg text-balance text-[15px] tracking-[0.05em] text-cream/80 [text-shadow:0_1px_10px_rgba(0,0,0,0.5)] sm:text-[17px]">
            {profile.subtitle}
          </p>
        </div>
      </div>
    </main>
  );
}
