import type { Metadata } from "next";
import SubPage from "@/components/SubPage";
import TeamList from "@/components/TeamList";
import Halftone from "@/components/Halftone";
import { ACTIVE_BUILDS, MEMBERS } from "@/lib/data";

export const metadata: Metadata = { title: "Team" };

export default function TeamPage() {
    return (
        <SubPage
            title="Team"
            intro={`${MEMBERS.length} engineers, product managers, and designers, recruited each semester.`}
            banner={<Halftone src="/brand/team-src.jpg" alt="Members of Cornell GenAI" pitch={4} fade="bottom" />}
        >
            <TeamList
                groups={[
                    { title: "leadership", members: MEMBERS.filter((m) => m.team !== "Engineering") },
                    ...ACTIVE_BUILDS.map((b) => ({ title: b.name, members: b.members, showRole: false })),
                ]}
            />
        </SubPage>
    );
}
