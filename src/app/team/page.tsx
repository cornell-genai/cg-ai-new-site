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

export default function TeamPage() {
    return (
        <>
            {/* The nav's gutters on small screens. From xl, TeamSections splits the full width 20/80, so no gutters here. */}
            <main id="main-content" tabIndex={-1} className="safe-gutters min-h-svh pb-28 pt-32 [--gutter:1.25rem] md:pt-44 md:[--gutter:1.5rem] xl:[--gutter:0rem]">
                <TeamSections groups={GROUPS.map((g) => ({ id: g.id, title: g.title, members: MEMBERS.filter((m) => m.team === g.team) }))} />
            </main>
            <Footer />
        </>
    );
}
