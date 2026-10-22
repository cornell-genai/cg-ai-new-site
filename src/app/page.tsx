import Link from "next/link";
import Life from "@/components/Life";
import Footer from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import TeamPhoto from "@/components/TeamPhoto";
import { ClientStack, OpenSourceStack, ProjectIcons } from "@/components/Inline";
import { CURRENT_MEMBERS } from "@/lib/data";

export default function Home() {
    return (
        <>
            <section className="relative h-svh min-h-[600px] overflow-hidden">
                <Life />

                <div data-swarm-avoid className="absolute left-5 top-24 max-w-[19rem] md:left-6 md:top-28 md:max-w-[26rem]">
                    <p className="text-[clamp(1.5rem,2.3vw,2.1rem)] font-semibold leading-[1.08] tracking-[-0.03em] text-fg">
                        Cornell students shipping AI.
                    </p>
                    <p className="mt-4 max-w-[22rem] text-[15px] leading-relaxed text-bone/55">
                        Applied research, production systems for clients, and open source.
                    </p>
                </div>

                {/* Centred lockup, mark to the left: life never grows over it. Below lg the
                    wordmark stacks onto two lines sized to the mark's height (9 cells = 2 × 0.8 leading × 5.6). */}
                <h1 className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 items-end justify-center gap-[calc(var(--swarm-cell,12px)*1.4)] px-5 pt-16">
                    <span data-swarm-mark aria-hidden className="block size-[calc(var(--swarm-cell,12px)*9)] shrink-0" />
                    <span
                        data-swarm-avoid
                        className="-mb-[0.06em] block text-[calc(var(--swarm-cell,12px)*5.6)] font-medium leading-[0.8] tracking-[-0.05em] lg:whitespace-nowrap lg:text-[calc(var(--swarm-cell,12px)*11.5)]"
                    >
                        Cornell <br className="lg:hidden" />
                        GenAI
                    </span>
                </h1>
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
