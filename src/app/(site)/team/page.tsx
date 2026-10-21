import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import { PALETTES } from "@/lib/palettes";
import Label from "@/components/Label";
import TeamGrid from "@/components/TeamGrid";
import DotMatrix from "@/components/DotMatrix";
import Corners from "@/components/Corners";
import { MEMBERS } from "@/lib/data";

export const metadata: Metadata = {
    title: "Team",
    description: "The engineers, designers, and operators behind Generative AI at Cornell.",
};

export default function TeamPage() {
    return (
        <>
            <PageHeader
                index="Team"
                title="Team"
                meta={`${MEMBERS.length} members`}
                palette={PALETTES.ember}
                seed={5}
                pixel={4}
                intro={
                    <>
                        Engineers, product managers, and designers. Recruited each semester.
                    </>
                }
            />

            <section className="px-2 pt-24 md:px-3 md:pt-32">
                <figure className="relative aspect-[400/188] overflow-hidden rounded-[18px] bg-paper">
                    <DotMatrix src="/brand/team-src.jpg" alt="The Cornell GenAI team" pitch={8} />
                    <Corners className="text-ink/50" />
                </figure>
            </section>

            <section className="mx-auto px-4 pb-32 pt-24 md:px-6 md:pb-44 md:pt-32">
                <Label index="01" className="mb-8">Members</Label>
                <TeamGrid />
            </section>
        </>
    );
}
