import type { Metadata } from "next";
import Footer from "@/components/Footer";
import TeamSections from "@/components/TeamSections";
import { MEMBERS, type Team } from "@/lib/data";

export const metadata: Metadata = { title: "Team" };

const GROUPS: { team: Team; id: string; title: string }[] = [
    { team: "Board", id: "board", title: "E-board" },
    { team: "Members", id: "developers", title: "Developers" },
    { team: "Business", id: "business", title: "Business" },
    { team: "Alumni", id: "alumni", title: "Alumni" },
];

// Always white, whatever the site theme.
export default function TeamPage() {
    return (
        <div data-theme-scope="light">
            <main className="mx-auto min-h-svh max-w-[76rem] px-5 pb-28 pt-32 md:px-8 md:pt-44">
                <TeamSections groups={GROUPS.map((g) => ({ id: g.id, title: g.title, members: MEMBERS.filter((m) => m.team === g.team) }))} />
            </main>
            <Footer />
        </div>
    );
}
