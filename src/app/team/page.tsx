import type { Metadata } from "next";
import SubPage from "@/components/SubPage";
import TeamList from "@/components/TeamList";
import { CURRENT_MEMBERS, MEMBERS, TEAMS } from "@/lib/data";

export const metadata: Metadata = { title: "Team" };

export default function TeamPage() {
    return (
        <SubPage title="Team" intro={`The ${CURRENT_MEMBERS.length} people who make it all happen, plus the alumni who got us here.`}>
            <TeamList groups={TEAMS.map((t) => ({ title: t, members: MEMBERS.filter((m) => m.team === t) }))} />
        </SubPage>
    );
}
