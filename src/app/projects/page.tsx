import type { Metadata } from "next";
import SubPage, { Group, Row } from "@/components/SubPage";
import DotMatrix from "@/components/DotMatrix";
import { ACTIVE_BUILDS, PROJECTS } from "@/lib/data";

export const metadata: Metadata = { title: "Projects" };

export default function ProjectsPage() {
    return (
        <SubPage
            title="Projects"
            intro="Each semester, small teams build one project with an industry partner or for Cornell."
            aside={<DotMatrix src="/brand/campus-src.jpg" alt="Cornell campus in the fall" pitch={7} sourceBackground="#ff00ff" focus={[0.74, 0.4]} />}
        >
            <Group title="Current">
                {ACTIVE_BUILDS.map((b) => (
                    <Row key={b.name} left={b.name} right={`${b.members.length} ${b.members.length === 1 ? "member" : "members"}`} sub={b.members.map((m) => m.name).join(", ")} />
                ))}
            </Group>
            <Group title="Spring 2025">
                {PROJECTS.map((p) => (
                    <Row
                        key={p.slug}
                        left={
                            <>
                                {p.title} <span className="ml-1 text-[14px] text-ink-2">{p.partner}</span>
                            </>
                        }
                        right={p.link ? "Write-up ↗" : p.status}
                        sub={p.description}
                        href={p.link}
                    />
                ))}
            </Group>
        </SubPage>
    );
}
