import type { Metadata } from "next";
import Footer from "@/components/Footer";
import { AvatarStack, TeamCard } from "@/components/TeamGrid";
import { Reveal } from "@/components/Reveal";
import { CURRENT_MEMBERS, MEMBERS } from "@/lib/data";

export const metadata: Metadata = { title: "Team" };

// Always white, whatever the site theme. A sticky intro on the left, every
// member in one grid on the right: the board leads, with roles, but isn't set apart.
export default function TeamPage() {
    const alumni = MEMBERS.filter((m) => m.team === "Alumni");
    return (
        <div data-theme-scope="light">
            <main className="mx-auto min-h-svh max-w-[76rem] px-5 pb-28 pt-32 md:px-8 md:pt-44">
                <div className="grid gap-14 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-20">
                    <header className="lg:sticky lg:top-32 lg:self-start">
                        <p className="font-mono text-[12px] uppercase tracking-[0.08em] text-red">Team</p>
                        <h1 className="mt-4 text-[clamp(2.5rem,3.4vw,3.1rem)] font-medium leading-[0.95] tracking-[-0.045em] text-fg">
                            The people behind Cornell GenAI.
                        </h1>
                        <p className="mt-5 text-[17px] leading-relaxed text-bone/65">
                            {CURRENT_MEMBERS.length} engineers, researchers, and designers, and the alumni who helped build the club.
                        </p>
                        <Reveal delay={0.2} y={12} className="mt-8">
                            <AvatarStack members={CURRENT_MEMBERS} />
                        </Reveal>
                    </header>
                    <ul className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3">
                        {CURRENT_MEMBERS.map((m, i) => <TeamCard key={m.name} m={m} index={i} />)}
                        <li className="col-span-full mt-6 border-t border-bone/12 pt-6 font-mono text-[12px] uppercase tracking-[0.08em] text-bone/45">
                            Alumni
                        </li>
                        {alumni.map((m, i) => <TeamCard key={m.name} m={m} index={i} />)}
                    </ul>
                </div>
            </main>
            <Footer />
        </div>
    );
}
