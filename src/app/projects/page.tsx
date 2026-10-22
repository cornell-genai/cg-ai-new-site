import type { Metadata } from "next";
import SubPage, { Group, Row } from "@/components/SubPage";
import { CURRENT, PAST } from "@/lib/data";

export const metadata: Metadata = { title: "Projects" };

export default function ProjectsPage() {
    return (
        <SubPage title="Projects" intro="Applied AI research, AI engineering for clients, and frontier projects. Demos from this semester are published as they ship.">
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
