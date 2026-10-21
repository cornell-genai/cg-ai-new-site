"use client";

import { useEffect, useState } from "react";
import { Group, Row } from "./SubPage";
import { CONTACT_EMAIL, RECRUITING } from "@/lib/data";

const fmt = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "UTC" });

// Applications are open from the first timeline event through the deadline.
export default function Recruiting() {
    const [today, setToday] = useState<string | null>(null);
    useEffect(() => setToday(new Date().toLocaleDateString("en-CA", { timeZone: "America/New_York" })), []);
    const { timeline, tracks } = RECRUITING;
    const open = today !== null && today >= timeline[0].date && today <= timeline[timeline.length - 1].date;
    const closed = today !== null && !open;

    return (
        <>
            <Group>
                {tracks.map((t) => (
                    <Row key={t.title} left={t.title} sub={t.blurb} right={closed ? "Opens next cycle" : "Apply ↗"} href={closed ? undefined : t.url} />
                ))}
                <Row left="Coffee chat" sub="Talk to a current member before you apply." right="Book ↗" href={RECRUITING.coffeeChatUrl} />
                <Row left="Partner with us" sub="Sponsor a project or recruit from the team." right="Email ↗" href={`mailto:${CONTACT_EMAIL}?subject=Partnership`} />
            </Group>
            <Group title={`Timeline, ${RECRUITING.cycle}`}>
                {timeline.map((e) => (
                    <Row
                        key={e.date + e.label}
                        left={<span className={today !== null && e.date < today ? "text-bone/40" : undefined}>{e.label}</span>}
                        right={fmt.format(new Date(e.date))}
                        sub={"location" in e ? e.location : undefined}
                    />
                ))}
            </Group>
            <Group title="FAQ">
                {RECRUITING.faq.map((f) => (
                    <Row key={f.q} left={f.q} sub={f.a} />
                ))}
            </Group>
        </>
    );
}
