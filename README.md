# Sydney Gahunia — personal site

**Live site: [sydneygahunia.com](https://sydneygahunia.com)**

My personal site, built around an animated koi pond. Koi glide under lily pads and lotus flowers while petals drift across the water, and glassy pills riding on the koi lead to my experience, projects and contact links.

## Features

- **Koi pond home:** each koi is a chain of spine points pulled along by its head, so bodies bend naturally as they turn. The links ride on their own koi (and the fish themselves are clickable).
- **Real water:** a WebGL height-field simulation runs the wave equation on the GPU. Clicks send out ripples that refract the koi and moonlight underneath, koi leave faint wakes, and glints catch the light on wave crests.
- **Experience and Projects pages:** frosted-glass cards floating over the same live pond, dimmed for readability.
- **Connect card:** email, LinkedIn and GitHub in one place.
- **Fast and accessible:** Lighthouse scores 95–98 for performance and 100 for accessibility, best practices and SEO. The pond shows a still frame for visitors who prefer reduced motion.

## Tech stack

- [Next.js 14](https://nextjs.org) (App Router, fully static pages)
- [TypeScript](https://www.typescriptlang.org)
- [Tailwind CSS](https://tailwindcss.com) with design tokens as CSS variables
- [Framer Motion](https://www.framer.com/motion/) for card reveals and the connect card
- WebGL2 (water simulation) and Canvas 2D (koi, lily pads, petals)
- Deployed on [Vercel](https://vercel.com)

## Running locally

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Editing content

All text lives in [`lib/content.ts`](lib/content.ts): the intro line, each role and its bullets, and projects with their links. The components only handle presentation, so most updates are a single edit in that file.
