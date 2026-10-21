import { cn } from "@/lib/utils";

// The brand mark: a red square with an off-white pixel spark. 9×9 grid.
export const MARK = [
    ".........",
    "....#....",
    "....#....",
    "...#.#...",
    ".##...##.",
    "...#.#...",
    "....#....",
    "....#....",
    ".........",
];

const CELLS = MARK.flatMap((row, y) => [...row].flatMap((c, x) => (c === "#" ? [{ x, y }] : [])));

export default function Mark({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 9 9" className={cn("block shrink-0", className)} shapeRendering="crispEdges" aria-hidden>
            <rect width="9" height="9" fill="#d7261e" />
            {CELLS.map(({ x, y }) => (
                <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill="#f1eee8" />
            ))}
        </svg>
    );
}

export function Lockup({ className, markClassName }: { className?: string; markClassName?: string }) {
    return (
        <span className={cn("flex items-center gap-2", className)}>
            <Mark className={cn("size-7", markClassName)} />
            <span className="text-[14px] font-medium leading-[0.95] tracking-[-0.02em]">
                Cornell
                <br />
                GenAI
            </span>
        </span>
    );
}
