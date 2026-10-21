import { cn } from "@/lib/utils";

// Small square registration marks, like a print proof.
export default function Corners({ className, inset = 14 }: { className?: string; inset?: number }) {
    const pos = [
        { top: inset, left: inset },
        { top: inset, right: inset },
        { bottom: inset, left: inset },
        { bottom: inset, right: inset },
    ];
    return (
        <div aria-hidden className={cn("pointer-events-none absolute inset-0", className)}>
            {pos.map((p, i) => (
                <span key={i} className="absolute size-[5px] bg-current" style={p} />
            ))}
        </div>
    );
}
