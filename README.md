# cornellgenai.dev

Website for Generative AI at Cornell. Next.js 15 (static export), Tailwind 4, Framer Motion, Lenis.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static site in ./out
```

## Updating content

Everything editable lives in `src/lib/data.ts`: members, projects, partners, and the recruiting
cycle (timeline dates, application forms, FAQ). The Apply page opens and closes itself based on
the timeline dates, so a new cycle only needs new dates and form links.

Team headshots go in `public/team/` as ~720px WebP. Members without a photo get a generated
gradient tile with their initials.

## Visual system

- **AsciiField**: two-pass WebGL ASCII renderer. The scene (gradient sky plus a procedural
  McGraw Tower, or any photo via `image`) is computed once per character cell into a tiny
  texture, then a full-res pass draws glyphs from a font atlas. Cursor opens a pixel lens.
- **GrainField**: grainy, domain-warped gradient. `pixel > 1` switches to Bayer-dithered pixels.
- **DotMatrix**: re-draws a small blurred photo as a halftone dot screen; dots react to the cursor.
  It only renders while something is animating.

All three pause offscreen and in background tabs, and render a single still frame under
`prefers-reduced-motion`. Photo sources for the shaders are intentionally small and blurred
(`public/brand/*-src.jpg`, 20–35 KB); the shader supplies the detail.
