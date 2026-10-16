# SydAmp — Sydney Gahunia's portfolio

**Live site: [sydneygahunia.com](https://sydneygahunia.com)**

My personal portfolio, built as a Y2K music desktop: a Windows 98–style "media library" window, a Winamp-inspired player called SydAmp, and a pastel palette. Each role is a CD in the rack, each resume bullet is a track, and my skills are mixtapes.

## Features

- **CD Rack:** experience shown as jewel cases. Click one to open its "album" page with a full tracklist of what I worked on.
- **SydAmp player:** a working player with an LCD clock, spectrum visualizer, seek bar, shuffle and a playlist of every track on the site.
- **Mixtapes:** skills grouped into cassettes (Languages, AI / ML, Frameworks, Dev Tools).
- **Win98 shell:** Start menu, taskbar, desktop shortcuts, and a Back / Forward / Address toolbar.
- **Responsive:** a full desktop layout on large screens, and a docked mini player with a single window on phones.

## Tech stack

- [Next.js 14](https://nextjs.org) (App Router, static generation)
- [TypeScript](https://www.typescriptlang.org)
- [Tailwind CSS](https://tailwindcss.com) with design tokens as CSS variables
- [Framer Motion](https://www.framer.com/motion/) (LazyMotion) for animations and page transitions
- Deployed on [Vercel](https://vercel.com)

All visuals (covers, CDs, cassettes) are drawn with CSS, so the site loads no images, and the only web font is the LCD typeface.

## Running locally

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Editing content

All text lives in [`lib/content.ts`](lib/content.ts): the bio, each role and its bullets ("tracks"), and the skill mixtapes. The components only handle presentation, so most updates are a single edit in that file.
