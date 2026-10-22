import { Reveal } from "./Reveal";
import type { Member } from "@/lib/data";

// Square portraits in a hairline frame, name and role underneath. Members
// without a headshot get an empty frame, ready for one. Cards rise in as they
// scroll into view, staggered across each row by `index`.
export function TeamCard({ m, index = 0 }: { m: Member; index?: number }) {
    const inner = (
        <>
            <div className="relative aspect-square overflow-hidden rounded-lg bg-night-2 after:absolute after:inset-0 after:rounded-lg after:ring-1 after:ring-inset after:ring-black/[0.06]">
                {m.image && <img src={m.image} alt={m.name} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />}
            </div>
            <p className="mt-3 text-[16px] font-medium tracking-[-0.015em] text-fg transition-colors group-hover:text-red">{m.name}</p>
            {m.role && <p className="text-[14px] text-bone/55">{m.role}</p>}
        </>
    );
    return (
        <li>
            <Reveal y={28} delay={(index % 3) * 0.08}>
                {m.linkedIn ? (
                    <a href={m.linkedIn} target="_blank" rel="noopener noreferrer" className="group block">{inner}</a>
                ) : (
                    <div className="group block">{inner}</div>
                )}
            </Reveal>
        </li>
    );
}
