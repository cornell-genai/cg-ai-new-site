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
            {/* The nav's gutters on small screens. From xl, TeamSections splits the full width 20/80, so no gutters here. */}
            <main className="min-h-svh px-5 pb-28 pt-32 md:px-6 md:pt-44 xl:px-0">
                <TeamSections groups={GROUPS.map((g) => ({ id: g.id, title: g.title, members: MEMBERS.filter((m) => m.team === g.team) }))} />
            </main>
            <Footer />
        </div>
    );
}
