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
Photos for the halftone live in `public/brand/` as small (~400px), blurred JPEGs; the shader adds the detail.

## Pieces

- `Halftone`: posterised blue dot screen (WebGL) for photos and the page backdrop. The cursor pushes
  the dots aside and clicks send ripples through them; it only renders while something moves.
- `Log`: monospace status lines that type themselves out when scrolled into view.

The halftone draws a single still frame under `prefers-reduced-motion`.
