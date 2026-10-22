import type { Metadata } from "next";
import SubPage, { Group, Row } from "@/components/SubPage";
import { CURRENT, PAST } from "@/lib/data";

export const metadata: Metadata = { title: "Projects" };

export default function ProjectsPage() {
    return (
        <SubPage title="Projects" intro="A look at what we've been building: research, client work, and our own projects. We'll share demos from this semester as they come together!">
            <Group title="This semester">
                {CURRENT.map((p) => (
                    <Row key={p.slug} id={p.slug} left={p.title} right={p.partner} sub={p.summary} href={p.link} />
                ))}
            </Group>
            <Group title="Past work">
                {PAST.map((p) => (
                    <Row key={p.slug} id={p.slug} left={p.title} right={p.link ? `${p.partner} · Write-up ↗` : p.partner} sub={p.summary} href={p.link} />
                ))}
            </Group>
        </SubPage>
    );
}
