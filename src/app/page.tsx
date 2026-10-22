import Link from "next/link";
import Swarm from "@/components/Swarm";
import Footer from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import TeamPhoto from "@/components/TeamPhoto";
import { ClientStack, OpenSourceStack, ProjectIcons } from "@/components/Inline";
import { CURRENT_MEMBERS } from "@/lib/data";

export default function Home() {
    return (
        <>
            <section className="relative h-svh min-h-[600px] overflow-hidden">
                <Swarm />

                {/* Centred lockup: the school swims all the way around it. */}
                <div className="absolute inset-0 flex flex-col items-center justify-center px-5 pt-10 text-center">
                    <h1 className="flex flex-col items-center gap-[calc(var(--swarm-cell,12px)*2)]">
                        <span data-swarm-mark aria-hidden className="block size-[calc(var(--swarm-cell,12px)*9)] shrink-0" />
                        <span
                            data-swarm-avoid
                            className="block whitespace-nowrap text-[clamp(3rem,14vw,6rem)] font-medium leading-[0.8] tracking-[-0.05em] md:text-[calc(var(--swarm-cell,12px)*10.5)]"
                        >
                            Cornell GenAI
                        </span>
                    </h1>
                    <p data-swarm-avoid className="mt-9 max-w-[30rem] text-[clamp(1rem,1.3vw,1.15rem)] leading-relaxed text-bone/60 md:mt-11">
                        Cornell students shipping AI: applied research, production systems for clients, and open source.
                    </p>
                </div>
            </section>

            <main className="px-7 md:px-[8vw]">
                <section className="pt-28 md:pt-44">
                    <Reveal className="mx-auto max-w-3xl text-center">
                        <p className="text-[clamp(1.75rem,3.6vw,3rem)] font-semibold leading-[1.08] tracking-[-0.035em] text-fg">
                            {CURRENT_MEMBERS.length} engineers, researchers, and designers building with AI.
                        </p>
                    </Reveal>
                    <Reveal delay={0.1} className="mx-auto mt-12 max-w-[1040px] md:mt-16">
                        <Link href="/team" aria-label="Meet the team">
                            <TeamPhoto src="/brand/team.webp" alt="The Cornell GenAI team" />
                        </Link>
                    </Reveal>
                </section>

                <section className="mx-auto max-w-[54rem] py-28 md:py-48">
                    <Reveal>
                        <p className="text-[clamp(1.6rem,3.3vw,3rem)] font-semibold leading-[1.28] tracking-[-0.035em] text-fg">
                            We&apos;re Cornell engineers and researchers who build with AI. We run{" "}
                            <span className="underline decoration-red decoration-[0.07em] underline-offset-[0.14em]">applied AI projects and research</span>{" "}
                            <span className="whitespace-nowrap"><ProjectIcons />,</span> from agents for long horizon tasks to systems that act in the real world. We{" "}
                            <span className="underline decoration-red decoration-[0.07em] underline-offset-[0.14em]">build for clients</span> <span className="whitespace-nowrap"><ClientStack />,</span>
                            shipping production systems used in the real world. And we{" "}
                            <span className="underline decoration-red decoration-[0.07em] underline-offset-[0.14em]">contribute to open source</span>{" "}
                            <span className="whitespace-nowrap"><OpenSourceStack />.</span>
                        </p>
                    </Reveal>
                </section>

            </main>

            <Footer />
        </>
    );
}
