import type { Metadata } from "next";
import { Chips, PageShell } from "@/components/page-shell";
import { Reveal } from "@/components/reveal";
import { experiences } from "@/lib/content";

export const metadata: Metadata = { title: "Experience" };

const Dot = () => <span aria-hidden className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-petal/80" />;

export default function ExperiencePage() {
  return (
    <PageShell title="experience" current="/experience">
      <ol className="space-y-6">
        {experiences.map((job, i) => (
          <li key={job.org}>
            <Reveal delay={i * 0.06}>
              <article className="glass rounded-3xl p-6 sm:p-8">
                <header className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                  <h2 className="font-serif text-[1.9rem] leading-tight text-cream">{job.role}</h2>
                  <p className="text-sm text-mist sm:text-right">{job.period}</p>
                </header>
                <p className="mt-1 text-[15px] text-petal">
                  {job.org}
                  {job.location && <span className="text-mist"> · {job.location}</span>}
                </p>

                <ul className="mt-6 space-y-3">
                  {job.bullets.map((b, j) => {
                    const startsGroup = b.group && b.group !== job.bullets[j - 1]?.group;
                    return (
                      <li key={j}>
                        {startsGroup && (
                          <p className={`mb-2 text-[11px] font-medium uppercase tracking-[0.14em] text-petal/90 ${j > 0 ? "mt-6" : ""}`}>
                            {b.group}
                          </p>
                        )}
                        <div className="flex gap-3">
                          <Dot />
                          <p className="text-pretty text-[15px] leading-relaxed text-cream/85">{b.text}</p>
                        </div>
                      </li>
                    );
                  })}
                </ul>

                <div className="mt-6 border-t border-white/10 pt-5">
                  <Chips items={job.stack} label={`${job.org} tech stack`} />
                </div>
              </article>
            </Reveal>
          </li>
        ))}
      </ol>
    </PageShell>
  );
}
