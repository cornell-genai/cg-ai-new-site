import Link from "next/link";
import Swarm from "@/components/Swarm";
import Footer from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import TeamPhoto from "@/components/TeamPhoto";
import { ClientCycler, OrbLogo, ProjectIcons } from "@/components/Inline";
import { MEMBERS } from "@/lib/data";

export default function Home() {
    return (
        <>
            <section className="relative h-svh min-h-[600px] overflow-hidden">
                <Swarm />

                <div data-swarm-avoid className="absolute left-5 top-24 max-w-[19rem] md:left-6 md:top-28 md:max-w-[26rem]">
                    <p className="text-[clamp(1.5rem,2.3vw,2.1rem)] font-semibold leading-[1.08] tracking-[-0.03em] text-white">
                        Cornell&apos;s student-run community for building with AI.
                    </p>
                    <p className="mt-4 max-w-[22rem] text-[15px] leading-relaxed text-bone/55">
                        Applied research, AI engineering for clients, and frontier projects.
                    </p>
                </div>

                <h1 className="absolute bottom-[9svh] left-5 flex flex-col items-start gap-4 md:left-auto md:right-[6vw] md:flex-row md:items-end md:gap-[calc(var(--swarm-cell,12px)*1.4)]">
                    <span data-swarm-mark aria-hidden className="block size-[calc(var(--swarm-cell,12px)*9)] shrink-0" />
                    <span
                        data-swarm-avoid
                        className="block text-[clamp(3.5rem,17vw,6rem)] font-medium leading-[0.8] tracking-[-0.05em] md:-mb-[0.06em] md:whitespace-nowrap md:text-[calc(var(--swarm-cell,12px)*11.5)]"
                    >
                        Cornell <br className="md:hidden" />
                        GenAI
                    </span>
                </h1>
            </section>

            <main className="px-5 md:px-6">
                <section className="pt-24 md:pt-36">
                    <Reveal className="mx-auto max-w-3xl text-center">
                        <p className="text-[clamp(1.75rem,3.6vw,3rem)] font-semibold leading-[1.08] tracking-[-0.035em] text-white">
                            {MEMBERS.length} engineers, researchers, and designers who like building things that work.
                        </p>
                    </Reveal>
                    <Reveal delay={0.1} className="mx-auto mt-12 max-w-[1200px] md:mt-16">
                        <Link href="/team" aria-label="Meet the team">
                            <TeamPhoto src="/brand/team.webp" alt="The Cornell GenAI team" />
                        </Link>
                    </Reveal>
                </section>

                <section className="mx-auto max-w-[78rem] pt-24 md:pt-40">
                    <Reveal>
                        <p className="text-[clamp(1.9rem,4.4vw,4.1rem)] font-semibold leading-[1.18] tracking-[-0.04em] text-bone/35">
                            We&apos;re Cornell engineers and researchers who build with AI.{" "}
                            <span className="text-white">We run applied AI projects and research</span> <ProjectIcons />, from agents that hold up over
                            long, multi-step tasks to systems that act in the real world.{" "}
                            <span className="text-white">We build for clients</span> <ClientCycler />, shipping production AI for teams that need it to
                            work. <span className="text-white">And we build in the open</span>, contributing to{" "}
                            <OrbLogo src="/logos/mlx.png" name="MLX" /> and <OrbLogo src="/logos/pollen.svg" name="Pollen Robotics" /> Pollen Robotics.
                        </p>
                    </Reveal>
                </section>
            </main>

            <Footer />
        </>
    );
}
