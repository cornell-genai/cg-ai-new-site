import type { Metadata } from "next";
import SubPage from "@/components/SubPage";
import TeamList from "@/components/TeamList";
import { ACTIVE_BUILDS, MEMBERS } from "@/lib/data";

export const metadata: Metadata = { title: "Team" };

export default function TeamPage() {
    const leads = MEMBERS.filter((m) => m.team !== "Engineering");
    return (
        <SubPage title="Team">
            <TeamList
                groups={[
                    { members: leads },
                    ...ACTIVE_BUILDS.map((b) => ({ title: b.name, members: b.members, showRole: false })),
                ]}
            />
        </SubPage>
    );
}
