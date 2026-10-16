"use client";

import { useEffect } from "react";
import { m } from "framer-motion";
import { useScrollContainer } from "@/components/shell/app-shell";

// Skip the enter animation on the very first paint (keeps LCP instant); animate every later route change.
let firstMount = true;

// Re-mounts on every navigation: a quick fade/slide so the new page feels instant.
export default function Template({ children }: { children: React.ReactNode }) {
  const container = useScrollContainer();
  const animate = !firstMount;

  useEffect(() => {
    firstMount = false;
    if (!window.location.hash) container.current?.scrollTo({ top: 0 });
  }, [container]);

  return (
    <m.div
      initial={animate ? { opacity: 0.6, y: 6 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
    >
      {children}
    </m.div>
  );
}
