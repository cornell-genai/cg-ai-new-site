import { cn } from "@/lib/utils";
import type { Member } from "@/lib/data";

const SWATCHES = [
    ["#1b25ff", "#ff4a1c"],
    ["#ff4a1c", "#ffd7b0"],
    ["#0b0b0c", "#1b25ff"],
    ["#5e6bff", "#ff8a2a"],
    ["#1630ff", "#a9b8ff"],
];

function hashName(name: string) {
    let h = 0;
    for (const c of name) h = (h * 31 + c.charCodeAt(0)) >>> 0;
    return h;
}

export function initials(name: string) {
    const parts = name.replace(/,.*$/, "").trim().split(/\s+/);
    return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase();
}

// Members without a photo get a grainy gradient with their initials.
export default function Portrait({ member, className, hover = true }: { member: Member; className?: string; hover?: boolean }) {
    const h = hashName(member.name);
    const [a, b] = SWATCHES[h % SWATCHES.length];
    const angle = (h % 360) | 0;

    return (
        <div className={cn("relative overflow-hidden bg-paper-2", className)}>
            {member.image ? (
                <>
                    <img
                        src={member.image}
                        alt={member.name}
                        loading="lazy"
                        className={cn(
                            "absolute inset-0 h-full w-full object-cover grayscale contrast-[1.15] brightness-[1.04] transition-[filter,transform] duration-700 ease-out-expo",
                            hover && "group-hover:scale-[1.03] group-hover:grayscale-0 group-hover:contrast-100",
                        )}
                    />
                    <div className={cn("halftone absolute inset-0 opacity-25 mix-blend-multiply transition-opacity duration-700", hover && "group-hover:opacity-0")} />
                </>
            ) : (
                <div className="absolute inset-0" style={{ background: `linear-gradient(${angle}deg, ${a}, ${b})` }}>
                    <div className="grain absolute inset-0 opacity-60 mix-blend-overlay" />
                    <div className="halftone absolute inset-0 opacity-20 mix-blend-overlay" />
                    <span className="absolute inset-0 flex items-center justify-center font-serif text-[clamp(2.5rem,7vw,5rem)] italic leading-none text-paper/90">
                        {initials(member.name)}
                    </span>
                </div>
            )}
        </div>
    );
}
