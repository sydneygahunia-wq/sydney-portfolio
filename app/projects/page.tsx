import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { Chips, PageShell } from "@/components/page-shell";
import { Reveal } from "@/components/reveal";
import { projects } from "@/lib/content";

export const metadata: Metadata = { title: "Projects" };

export default function ProjectsPage() {
  return (
    <PageShell title="projects" current="/projects">
      <ul className="space-y-6">
        {projects.map((project, i) => (
          <li key={project.name}>
            <Reveal delay={i * 0.06}>
              <article className="glass rounded-3xl p-6 sm:p-8">
                <header className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                  <h2 className="font-serif text-[2.2rem] leading-tight text-cream">{project.name}</h2>
                  {project.period && <p className="text-sm text-mist">{project.period}</p>}
                </header>
                <p className="mt-1 text-[15px] text-petal">{project.tagline}</p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {project.links.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      className="glass inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[13px] text-cream/90 transition-colors hover:bg-white/[0.14]"
                    >
                      {link.label} <ArrowUpRight size={13} aria-hidden />
                    </a>
                  ))}
                </div>

                <ul className="mt-6 space-y-3">
                  {project.bullets.map((text) => (
                    <li key={text} className="flex gap-3">
                      <span aria-hidden className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-petal/80" />
                      <p className="text-pretty text-[15px] leading-relaxed text-cream/85">{text}</p>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 border-t border-white/10 pt-5">
                  <Chips items={project.stack} label={`${project.name} tech stack`} />
                </div>
              </article>
            </Reveal>
          </li>
        ))}
      </ul>
    </PageShell>
  );
}
