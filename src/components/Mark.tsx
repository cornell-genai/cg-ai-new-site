import { cn } from "@/lib/utils";

// Pixel sparkle: a 9×9 grid with a hollow core. The brand mark.
const GRID = [
    "....#....",
    "....#....",
    "...###...",
    "..##.##..",
    "###...###",
    "..##.##..",
    "...###...",
    "....#....",
    "....#....",
];

const CELLS = GRID.flatMap((row, y) => [...row].flatMap((c, x) => (c === "#" ? [{ x, y }] : [])));

export default function Mark({ className, animated = false }: { className?: string; animated?: boolean }) {
    return (
        <svg viewBox="0 0 9 9" className={cn("block", className)} shapeRendering="crispEdges" aria-hidden>
            {CELLS.map(({ x, y }, i) => (
                <rect
                    key={i}
                    x={x}
                    y={y}
                    width="1"
                    height="1"
                    fill="currentColor"
                    className={animated ? "origin-center transition-opacity duration-300 group-hover:animate-[blink_0.9s_steps(2)_infinite]" : undefined}
                    style={animated ? { animationDelay: `${((x * 7 + y * 13) % 9) * 70}ms` } : undefined}
                />
            ))}
        </svg>
    );
}
