import { COLS, ROWS, renderCover, type MotifName } from "@/lib/covers";
import type { Palette } from "@/lib/work";
import { cn } from "@/lib/utils";

// The ASCII cover for a write-up, drawn in the partner's colours, with their
// mark in a chip at the corner. Pure SVG text, rendered at build time.
export default function Cover({
    motif,
    palette,
    logos = [],
    className,
}: {
    motif: MotifName;
    palette: Palette;
    logos?: { src: string; alt: string; bg?: string }[];
    className?: string;
}) {
    const layers = renderCover(motif);
    const w = COLS * 6, h = ROWS * 10;
    return (
        <div className={cn("@container relative aspect-square overflow-hidden rounded-[3px]", className)} style={{ background: palette.bg }}>
            <svg viewBox={`0 0 ${w} ${h}`} className="absolute inset-0 size-full" aria-hidden>
                {layers.map((rows, i) => (
                    <g key={i} fill={palette.ink[i]} fontSize="10" style={{ fontFamily: "var(--font-mono), ui-monospace, monospace" }}>
                        {rows.map((row, r) =>
                            row.trim() ? (
                                <text key={r} x="0" y={(r + 0.8) * 10} textLength={w} lengthAdjust="spacing" xmlSpace="preserve">
                                    {row}
                                </text>
                            ) : null,
                        )}
                    </g>
                ))}
            </svg>
            {logos.length > 0 && (
                <div className="absolute bottom-[5%] left-[5%] flex gap-2">
                    {logos.map((l) => (
                        <span key={l.src} className="flex size-[clamp(2.5rem,11cqw,4.5rem)] items-center justify-center rounded-[22%] p-[0.55rem] shadow-[0_1px_0_rgba(0,0,0,0.08)]" style={{ background: l.bg ?? "#ffffff" }}>
                            <img src={l.src} alt={l.alt} className="max-h-full max-w-full object-contain" />
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}
