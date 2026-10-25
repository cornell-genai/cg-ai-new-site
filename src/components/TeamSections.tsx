"use client";

import { useEffect, useRef, useState } from "react";
import { TeamCard } from "./TeamGrid";
import type { Member } from "@/lib/data";
import { cn } from "@/lib/utils";

type Group = { id: string; title: string; members: Member[] };
const word = "font-medium leading-[1.05] tracking-[-0.05em] text-fg";

export default function TeamSections({ groups }: { groups: Group[] }) {
    const [active, setActive] = useState(0);
    const refs = useRef<(HTMLElement | null)[]>([]);

    useEffect(() => {
        const io = new IntersectionObserver(
            (entries) => {
                for (const e of entries) if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.index));
            },
            { rootMargin: "-25% 0px -65% 0px" },
        );
        refs.current.forEach((el) => el && io.observe(el));
        return () => io.disconnect();
    }, []);

    return (
        <div className="grid gap-12 lg:grid-cols-[minmax(16rem,22rem)_minmax(0,58rem)] lg:gap-12 xl:grid-cols-[20%_80%] xl:gap-0">
            <div className="lg:ps-6 xl:ps-12">
                <div className="team-sidebar lg:sticky lg:top-44">
                    <h1 className={`text-[clamp(3.5rem,9vw,6rem)] lg:font-mono lg:text-[13px] lg:font-normal lg:uppercase lg:tracking-[0.1em] lg:text-bone-2 ${word}`}>Team</h1>
                    <p aria-hidden className={`mt-6 hidden whitespace-nowrap text-[clamp(2.5rem,4vw,4.5rem)] lg:block ${word}`}>{groups[active]?.title}</p>
                    <nav aria-label="Team groups" className="mt-6 lg:mt-8">
                        <ul className="flex flex-wrap gap-x-5 gap-y-1 lg:flex-col lg:items-start lg:gap-0">
                            {groups.map((g, i) => (
                                <li key={g.id}><a href={`#${g.id}`} aria-current={active === i ? "location" : undefined} className={cn("inline-flex min-h-11 items-center gap-2 text-[15px] underline-offset-4 hover:underline", active === i ? "font-medium text-fg underline decoration-red" : "text-bone-2")}>
                                    {g.title}
                                </a></li>
                            ))}
                        </ul>
                    </nav>
                </div>
            </div>
            <div className="flex min-w-0 flex-col gap-20 xl:px-[clamp(3rem,7vw,9rem)]">
                {groups.map((g, i) => (
                    <section key={g.id} id={g.id} aria-labelledby={`${g.id}-heading`} data-index={i} ref={(el) => { refs.current[i] = el; }} className="scroll-mt-28 lg:scroll-mt-44">
                        <h2 id={`${g.id}-heading`} className={`mb-8 text-[clamp(2.5rem,10vw,3.5rem)] lg:sr-only ${word}`}>{g.title}</h2>
                        <ul className="grid grid-cols-2 gap-x-5 gap-y-8 min-[480px]:grid-cols-3 sm:grid-cols-4 sm:gap-y-10">
                            {g.members.map((m) => <TeamCard key={m.name} m={m} />)}
                        </ul>
                        {i < groups.length - 1 && <hr className="mt-12 border-bone/15" />}
                    </section>
                ))}
            </div>
        </div>
    );
}
