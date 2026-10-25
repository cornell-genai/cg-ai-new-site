import { Reveal } from "./Reveal";
import type { Member } from "@/lib/data";

// A head-and-shoulders silhouette framed like the studio headshots, for members without one yet.
function PortraitPlaceholder() {
    return (
        <svg viewBox="0 0 100 100" aria-hidden className="absolute inset-0 h-full w-full text-bone/[0.09]">
            <ellipse cx="50" cy="40" rx="15" ry="18" fill="currentColor" />
            <path d="M14 100 C14 76 30 64 50 64 C70 64 86 76 86 100 Z" fill="currentColor" />
        </svg>
    );
}

// Square portraits in a hairline frame, name and role underneath. Members
// without a headshot get a silhouette placeholder. Cards rise in as they
// scroll into view, staggered across each row by `index`.
export function TeamCard({ m, index = 0 }: { m: Member; index?: number }) {
    const inner = (
        <>
            <div className="relative aspect-square overflow-hidden rounded-lg bg-night-2 after:absolute after:inset-0 after:rounded-lg after:ring-1 after:ring-inset after:ring-black/[0.06]">
                {m.image ? <img src={m.image} alt={m.name} loading="lazy" className="absolute inset-0 h-full w-full object-cover" /> : <PortraitPlaceholder />}
            </div>
            <p className="mt-2.5 text-[13px] font-medium leading-snug tracking-[-0.015em] text-fg transition-colors group-hover:text-red sm:mt-3 sm:text-[16px]">{m.name}</p>
            {m.role && <p className="text-[12px] text-bone/55 sm:text-[14px]">{m.role}</p>}
        </>
    );
    return (
        <li>
            <Reveal y={28} delay={(index % 4) * 0.08}>
                {m.linkedIn ? (
                    <a href={m.linkedIn} target="_blank" rel="noopener noreferrer" className="group block">{inner}</a>
                ) : (
                    <div className="group block">{inner}</div>
                )}
            </Reveal>
        </li>
    );
}
