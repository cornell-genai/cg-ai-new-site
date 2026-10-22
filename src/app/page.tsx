import Link from "next/link";
import Swarm from "@/components/Swarm";
import Footer from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import TeamPhoto from "@/components/TeamPhoto";
import { ClientDot, ClientStack, OpenSourceStack, ProjectIcons } from "@/components/Inline";
import { MEMBERS, PAST } from "@/lib/data";

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

            <main className="px-7 md:px-[8vw]">
                <section className="pt-28 md:pt-44">
                    <Reveal className="mx-auto max-w-3xl text-center">
                        <p className="text-[clamp(1.75rem,3.6vw,3rem)] font-semibold leading-[1.08] tracking-[-0.035em] text-white">
                            {MEMBERS.length} engineers, researchers, and designers who like building things that work.
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
                        <p className="text-[clamp(1.6rem,3.3vw,3rem)] font-semibold leading-[1.28] tracking-[-0.035em] text-white">
                            We&apos;re Cornell engineers and researchers who build with AI. We run{" "}
                            <span className="underline decoration-red decoration-[0.07em] underline-offset-[0.14em]">applied AI projects and research</span>{" "}
                            <span className="whitespace-nowrap"><ProjectIcons />,</span> from agents for long-horizon tasks to systems that act in the real world. We{" "}
                            <span className="underline decoration-red decoration-[0.07em] underline-offset-[0.14em]">build for clients</span> <span className="whitespace-nowrap"><ClientStack />,</span>
                            shipping production AI for teams that need it to work. And we{" "}
                            <span className="underline decoration-red decoration-[0.07em] underline-offset-[0.14em]">contribute to open source</span>{" "}
                            <span className="whitespace-nowrap"><OpenSourceStack />.</span>
                        </p>
                    </Reveal>
                </section>

                <section className="mx-auto max-w-[54rem]">
                    <h2 className="font-mono text-[12px] uppercase tracking-[0.08em] text-bone/45">Selected work</h2>
                    <ul className="mt-6 border-t border-bone/10">
                        {PAST.filter((p) => ["cisco-red-teaming", "investcorp-esg", "quickfi-insurance"].includes(p.slug)).map((p) => (
                            <li key={p.slug} className="border-b border-bone/10">
                                <Link href={`/projects#${p.slug}`} className="group flex items-center gap-5 py-5">
                                    <ClientDot name={p.partner} />
                                    <span className="min-w-0 flex-1">
                                        <span className="block text-[19px] font-semibold tracking-[-0.02em] text-white transition-colors group-hover:text-red">{p.title}</span>
                                        <span className="block text-[15px] text-bone/55">{p.summary}</span>
                                    </span>
                                    <span className="hidden text-[14px] text-bone/40 sm:block">{p.partner}</span>
                                    <span className="text-bone/40 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-white">→</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </section>
            </main>

            <Footer />
        </>
    );
}
