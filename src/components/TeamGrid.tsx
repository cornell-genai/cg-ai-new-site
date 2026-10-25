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
// without a headshot get a silhouette placeholder. Content is immediately
// available rather than hidden behind a scroll-triggered entrance.
export function TeamCard({ m }: { m: Member }) {
    const inner = (
        <>
            <div className="relative aspect-square overflow-hidden rounded-lg bg-night-2 after:absolute after:inset-0 after:rounded-lg after:ring-1 after:ring-inset after:ring-white/10 light:after:ring-black/10">
                {m.image ? <img src={m.image} alt="" width="720" height="720" loading="lazy" className="absolute inset-0 h-full w-full object-cover" /> : <PortraitPlaceholder />}
            </div>
            <p className="mt-2.5 text-[15px] font-medium leading-[1.4] tracking-[-0.015em] text-fg decoration-red underline-offset-4 group-hover:underline sm:mt-3 sm:text-[16px]">{m.name}</p>
            {m.role && <p className="mt-1 text-[14px] leading-[1.4] text-bone-2">{m.role}</p>}
        </>
    );
    return (
        <li>
            {m.linkedIn ? (
                <a href={m.linkedIn} target="_blank" rel="noopener noreferrer" aria-label={`${m.name} on LinkedIn`} className="group block rounded-lg">{inner}</a>
            ) : (
                <div>{inner}</div>
            )}
        </li>
    );
}
