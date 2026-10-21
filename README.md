# cornellgenai.dev

Website for Generative AI at Cornell. Next.js 15 (static export), Tailwind 4, Framer Motion, Lenis.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static site in ./out
```

## Content

Everything editable lives in `src/lib/data.ts`: members, projects, and the recruiting cycle
(timeline dates, application forms, FAQ). The Get Involved page opens and closes applications
from the timeline dates, so a new cycle only needs new dates and form links.

Headshots go in `public/team/` as ~720px WebP; they appear when hovering a name on the Team page.

## Pieces

- `Swarm`: the homepage hero. Schools of ASCII agents on a character grid that flee the cursor,
  leave diffusing wakes, and ripple on click. 81 agents assemble the mark in the hero lockup
  (`[data-swarm-mark]`); text marked `[data-swarm-avoid]` is swum around. Canvas 2D, fixed timestep.
- `DotMatrix`: re-draws a small blurred photo (`public/brand/*-src.jpg`) as a halftone dot screen
  that reacts to the cursor, and only renders while something is animating.
- `Mark`: the red square with a pixel spark; also `src/app/icon.svg`.

Both canvases pause offscreen and in background tabs, and draw a single still frame under
`prefers-reduced-motion`.
