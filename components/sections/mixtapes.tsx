"use client";

import { m } from "framer-motion";
import { Cassette } from "@/components/retro/cassette";
import { RetroHeading } from "@/components/retro/heading";
import { skillTapes } from "@/lib/content";

// Skills as mixtapes: one tape per cluster, every skill visible at a glance (nothing to click).
export function Mixtapes() {
  return (
    <section id="mixtapes" aria-labelledby="mixtapes-title" className="scroll-mt-4 px-4 pt-12 md:px-8">
      <RetroHeading id="mixtapes-title" kicker="// skills on repeat" title="Mixtapes" />

      <ul className="grid gap-x-8 gap-y-6 xl:grid-cols-2">
        {skillTapes.map((tape, i) => (
          <m.li
            key={tape.title}
            initial={{ opacity: 0, y: 28, rotate: i % 2 ? 2 : -2 }}
            whileInView={{ opacity: 1, y: 0, rotate: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: i * 0.08, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="flex flex-col gap-4 sm:flex-row sm:items-center"
          >
            <m.div
              whileHover={{ y: -4, rotate: i % 2 ? 1.5 : -1.5 }}
              transition={{ type: "spring", stiffness: 300, damping: 18 }}
              className="w-[min(100%,200px)] shrink-0 sm:w-[190px]"
            >
              <Cassette
                title={tape.title}
                side={String.fromCharCode(65 + i)}
                subtitle={`${tape.skills.length} tracks`}
                color={tape.color}
              />
            </m.div>
            <div className="min-w-0">
              <h3 className="font-display text-[18px] italic text-ink">{tape.title}</h3>
              <ul className="mt-2 flex flex-wrap gap-1.5" aria-label={`${tape.title} skills`}>
                {tape.skills.map((skill) => (
                  <li
                    key={skill}
                    className="amp-in px-2 font-lcd text-[17px] leading-6 text-lcd"
                    style={{ backgroundColor: `color-mix(in srgb, ${tape.color} 35%, white)` }}
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          </m.li>
        ))}
      </ul>
    </section>
  );
}
