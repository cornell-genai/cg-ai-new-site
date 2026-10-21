"use client";

import { useEffect, useState } from "react";
import { RECRUITING } from "@/lib/data";
import { cn } from "@/lib/utils";

const fmt = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "UTC" });

function todayInIthaca() {
    return new Date().toLocaleDateString("en-CA", { timeZone: "America/New_York" });
}

// Recruiting is open from the first event through the deadline (inclusive).
export function useRecruitingOpen() {
    const [today, setToday] = useState<string | null>(null);
    useEffect(() => setToday(todayInIthaca()), []);
    const { timeline } = RECRUITING;
    const open = today !== null && today >= timeline[0].date && today <= timeline[timeline.length - 1].date;
    return { today, open };
}

export function StatusPill() {
    const { today, open } = useRecruitingOpen();
    return (
        <span className="label inline-flex items-center gap-2 rounded-full border border-line px-3 py-1.5 text-ink-2">
            <span className={cn("size-1.5 rounded-full", today === null ? "bg-ink-3" : open ? "animate-pulse bg-ember" : "bg-ink-3")} />
            {today === null ? RECRUITING.cycle : open ? "Applications open" : "Applications closed"}
        </span>
    );
}

export function ApplyButton({ url, title }: { url: string; title: string }) {
    const { today, open } = useRecruitingOpen();
    if (today !== null && !open) {
        return (
            <span className="inline-flex cursor-not-allowed items-center gap-2 rounded-full border border-line px-5 py-2.5 text-[14px] font-medium text-ink-3">
                Opens next cycle
            </span>
        );
    }
    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Apply to ${title}`}
            className="group inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-[14px] font-medium text-paper transition-colors hover:bg-ember"
        >
            Apply <span className="transition-transform duration-300 group-hover:translate-x-0.5">→</span>
        </a>
    );
}

export default function Timeline() {
    const { today } = useRecruitingOpen();
    const nextIdx = today === null ? -1 : RECRUITING.timeline.findIndex((e) => e.date >= today);

    return (
        <ol className="border-t border-line">
            {RECRUITING.timeline.map((e, i) => {
                const past = today !== null && e.date < today;
                const next = i === nextIdx;
                return (
                    <li
                        key={e.date + e.label}
                        className={cn(
                            "grid grid-cols-12 items-baseline gap-4 border-b border-line py-5 transition-colors",
                            past && "text-ink-3",
                        )}
                    >
                        <span className="label col-span-3 md:col-span-2">{fmt.format(new Date(e.date))}</span>
                        <span className="col-span-9 text-[clamp(1.25rem,2vw,1.75rem)] font-medium tracking-[-0.03em] md:col-span-6">
                            {e.label}
                            {next && <span className="label ml-3 rounded-full bg-ember px-2 py-0.5 align-middle text-paper">Next</span>}
                        </span>
                        <span className="label col-span-9 col-start-4 text-ink-3 md:col-span-4 md:col-start-auto md:text-right">{e.location ?? ""}</span>
                    </li>
                );
            })}
        </ol>
    );
}
