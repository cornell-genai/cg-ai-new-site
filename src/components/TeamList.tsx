import Scramble from "./Scramble";
import { cn } from "@/lib/utils";
import type { Member } from "@/lib/data";

// Portrait grid. Each group has its label in a left column and a grid of
// 4:5 frames on the right: large for the board, dense for everyone else.
// Members without a headshot get an empty frame, ready for one.
export default function TeamList({ groups }: { groups: { title: string; members: Member[]; featured?: boolean }[] }) {
    return (
        <div className="flex flex-col gap-24 md:gap-32">
            {groups.map((g) => (
                <section key={g.title} className="grid gap-8 md:grid-cols-[11rem_1fr] md:gap-10">
                    <h2 className="flex items-baseline gap-3 font-mono text-[12px] uppercase tracking-[0.08em] text-bone/45 md:sticky md:top-28 md:self-start">
                        <Scramble text={g.title} duration={380} />
                        <span className="text-bone/30">{String(g.members.length).padStart(2, "0")}</span>
                    </h2>
                    <ul className={cn("grid gap-x-4 gap-y-10", g.featured ? "grid-cols-2 lg:grid-cols-3 lg:gap-x-6" : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5")}>
                        {g.members.map((m) => <Card key={m.name} m={m} large={g.featured} />)}
                    </ul>
                </section>
            ))}
        </div>
    );
}

function Card({ m, large }: { m: Member; large?: boolean }) {
    const Tag = m.linkedIn ? "a" : "div";
    return (
        <li>
            <Tag {...(m.linkedIn ? { href: m.linkedIn, target: "_blank", rel: "noopener noreferrer" } : {})} className="group block">
                <div className="relative aspect-[4/5] overflow-hidden bg-night-2 ring-1 ring-inset ring-bone/10">
                    {m.image && (
                        <img
                            src={m.image}
                            alt={m.name}
                            loading="lazy"
                            className="absolute inset-0 h-full w-full object-cover grayscale transition duration-500 ease-out group-hover:scale-[1.03] group-hover:grayscale-0"
                        />
                    )}
                </div>
                <p className={cn("mt-3 flex items-baseline justify-between gap-2 tracking-[-0.015em] transition-colors group-hover:text-red", large ? "text-[19px] font-medium" : "text-[15px]")}>
                    {m.name}
                    {m.linkedIn && <span className="shrink-0 text-[0.8em] text-bone/40 opacity-0 transition-opacity group-hover:opacity-100">↗</span>}
                </p>
                {m.role && <p className={cn("text-bone/50", large ? "mt-0.5 text-[15px]" : "text-[13px]")}>{m.role}</p>}
            </Tag>
        </li>
    );
}
