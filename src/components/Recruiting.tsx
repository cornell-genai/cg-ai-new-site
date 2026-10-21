"use client";

import { useEffect, useState } from "react";
import { RECRUITING } from "@/lib/data";

// Applications are open from the first timeline event through the deadline.
export function useRecruiting() {
    const [today, setToday] = useState<string | null>(null);
    useEffect(() => setToday(new Date().toLocaleDateString("en-CA", { timeZone: "America/New_York" })), []);
    const { timeline } = RECRUITING;
    const open = today !== null && today >= timeline[0].date && today <= timeline[timeline.length - 1].date;
    return { today, open, known: today !== null };
}

export function RecruitingChip() {
    const { open, known } = useRecruiting();
    return <>{!known ? "recruiting" : open ? "applications_open" : "applications_closed"}</>;
}

export function ApplyLink({ url, className }: { url: string; className?: string }) {
    const { open, known } = useRecruiting();
    if (known && !open) return <span className={className}>Opens next cycle</span>;
    return (
        <a href={url} target="_blank" rel="noopener noreferrer" className={className}>
            Apply ↗
        </a>
    );
}
