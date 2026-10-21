import type { Metadata } from "next";
import SubPage, { Group, Row } from "@/components/SubPage";
import Halftone from "@/components/Halftone";
import { ACTIVE_BUILDS, PROJECTS } from "@/lib/data";

export const metadata: Metadata = { title: "Projects" };

export default function ProjectsPage() {
    return (
        <SubPage
            title="Projects"
            intro="Each semester, small teams build one project with an industry partner or for Cornell."
            banner={<Halftone src="/brand/campus-src.jpg" alt="Cornell campus in the fall" pitch={4} focus={[0.74, 0.3]} fade="bottom" />}
        >
            <Group title="in_progress">
                {ACTIVE_BUILDS.map((b) => (
                    <Row key={b.name} left={b.name} right={`${b.members.length} ${b.members.length === 1 ? "member" : "members"}`} sub={b.members.map((m) => m.name).join(", ")} />
                ))}
            </Group>
            <Group title="spring_2025">
                {PROJECTS.map((p) => (
                    <Row
                        key={p.slug}
                        left={
                            <>
                                {p.title} <span className="text-ink-3">· {p.partner}</span>
                            </>
                        }
                        right={p.link ? "write-up ↗" : p.status.toLowerCase()}
                        sub={p.description}
                        href={p.link}
                    />
                ))}
            </Group>
        </SubPage>
    );
}
