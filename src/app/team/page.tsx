import type { Metadata } from "next";
import SubPage from "@/components/SubPage";
import TeamLayouts from "@/components/TeamLayouts";
import { CURRENT_MEMBERS, MEMBERS } from "@/lib/data";

export const metadata: Metadata = { title: "Team" };

export default function TeamPage() {
    return (
        <SubPage title="Team" intro={`Our ${CURRENT_MEMBERS.length} current members, and the alumni who helped build the club.`}>
            <TeamLayouts members={MEMBERS} />
        </SubPage>
    );
}
