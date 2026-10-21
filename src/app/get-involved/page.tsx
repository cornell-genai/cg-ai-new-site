import type { Metadata } from "next";
import SubPage, { Group, Row } from "@/components/SubPage";
import { ApplyLink } from "@/components/Recruiting";
import { CONTACT_EMAIL, RECRUITING, formatDate } from "@/lib/data";

export const metadata: Metadata = { title: "Get involved" };

export default function GetInvolvedPage() {
    return (
        <SubPage title="Get involved" intro="We recruit engineers, product managers, and designers every semester. Applicants build an AI project over three weeks.">
            <Group title="tracks">
                {RECRUITING.tracks.map((t) => (
                    <Row key={t.title} left={t.title} sub={t.blurb} right={<ApplyLink url={t.url} className="hover:text-ink" />} />
                ))}
                <Row left="Coffee chat" sub="Talk to a current member before you apply." right="book ↗" href={RECRUITING.coffeeChatUrl} />
                <Row left="Partner with us" sub="Sponsor a project or recruit from the team." right="email ↗" href={`mailto:${CONTACT_EMAIL}?subject=Partnership`} />
            </Group>
            <Group title={`timeline, ${RECRUITING.cycle.toLowerCase()}`}>
                {RECRUITING.timeline.map((e) => (
                    <Row key={e.date + e.label} left={e.label} right={formatDate(e.date)} sub={"location" in e ? e.location : undefined} />
                ))}
            </Group>
            <Group title="faq">
                {RECRUITING.faq.map((f) => (
                    <Row key={f.q} left={f.q} sub={f.a} />
                ))}
            </Group>
        </SubPage>
    );
}
