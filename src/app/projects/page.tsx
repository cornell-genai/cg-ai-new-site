import type { Metadata } from "next";
import SubPage from "@/components/SubPage";

export const metadata: Metadata = { title: "Projects" };

// Project write-ups and demos are on the way. The descriptions live in
// src/lib/data.ts (CURRENT, PAST) for when this page is built out.
export default function ProjectsPage() {
    return (
        <SubPage title="Projects">
            <p className="text-[clamp(1.5rem,2.6vw,2.2rem)] font-semibold tracking-[-0.03em] text-fg">Coming soon.</p>
            <p className="mt-3 max-w-lg text-[17px] leading-relaxed text-bone/60">
                Write-ups of our past work and demos from this semester are on the way.
            </p>
        </SubPage>
    );
}
