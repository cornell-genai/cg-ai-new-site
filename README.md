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

- `Swarm`: the homepage. Schools of ASCII agents on a character grid flee the cursor, leave red
  wakes, and ripple on click; 81 of them assemble the mark in the lockup (`[data-swarm-mark]`).
  Anything marked `[data-swarm-avoid]` (nav, copy) is swum around. Canvas 2D, fixed timestep.
- `PageTransition`: the pixel-dissolve curtain for the first load and every internal link. It
  catches `<a>` clicks in the capture phase, so plain `<Link>`s need no wrapper.
- `Scramble`: text that decodes from ASCII noise as the curtain lifts.
- `Mark`: the red square with a pixel spark; also `src/app/icon.svg`.

Everything pauses offscreen and respects `prefers-reduced-motion`.
