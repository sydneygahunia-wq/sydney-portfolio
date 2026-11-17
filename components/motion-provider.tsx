"use client";

import { LazyMotion, MotionConfig, domAnimation } from "framer-motion";

// LazyMotion + `m` components ship a much smaller animation bundle than `motion`.
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
