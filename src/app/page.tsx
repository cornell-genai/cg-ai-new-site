import Link from "next/link";
import Swarm from "@/components/Swarm";
import Scramble from "@/components/Scramble";
import Footer from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { CURRENT, MEMBERS, PARTNERS, PAST } from "@/lib/data";

const FOCUS = [
    { title: "Applied research", body: "Open questions in agents and learning, like how agents hold up over long, multi-step tasks." },
    { title: "AI engineering", body: "Production systems for clients, from agentic red teaming at Cisco to ESG monitoring for Investcorp." },
    { title: "Frontier projects", body: "Things we build to run in the world, like RL on Pollen Robotics' Microduck and a live trading agent." },
];

function Kicker({ children }: { children: React.ReactNode }) {
    return (
        <h2 className="font-mono text-[12px] uppercase tracking-[0.08em] text-bone/45">
            <Scramble text={String(children)} duration={380} />
        </h2>
    );
}

function More({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <Link href={href} className="group text-[15px] text-bone/60 transition-colors hover:text-bone">
            {children} <span className="inline-block transition-transform duration-300 group-hover:translate-x-0.5">→</span>
        </Link>
    );
}

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

            <main>
                {/* Team */}
                <section className="px-5 pt-24 md:px-6 md:pt-36">
                    <Reveal className="mx-auto max-w-3xl text-center">
                        <p className="text-[clamp(1.75rem,3.6vw,3rem)] font-semibold leading-[1.08] tracking-[-0.035em] text-white">
                            {MEMBERS.length} engineers, researchers, and designers who like building things that work.
                        </p>
                    </Reveal>
                    <Reveal delay={0.1} className="relative mx-auto mt-12 max-w-[1200px] md:mt-16">
                        <img src="/brand/team-dots.webp" alt="The Cornell GenAI team" className="w-full" />
                        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-night to-transparent" />
                    </Reveal>
                    <div className="mt-2 text-center">
                        <More href="/team">Meet the team</More>
                    </div>
                </section>

                {/* What we do */}
                <section className="px-5 pt-28 md:px-6 md:pt-40">
                    <Kicker>What we do</Kicker>
                    <div className="mt-8 grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
                        {FOCUS.map((f, i) => (
                            <Reveal key={f.title} delay={i * 0.08}>
                                <h3 className="text-[24px] font-semibold tracking-[-0.03em] text-white">{f.title}</h3>
                                <p className="mt-3 max-w-sm text-[16px] leading-relaxed text-bone/60">{f.body}</p>
                            </Reveal>
                        ))}
                    </div>
                </section>

                {/* Work */}
                <section className="px-5 pt-28 md:px-6 md:pt-40">
                    <div className="flex items-baseline justify-between gap-6">
                        <Kicker>This semester</Kicker>
                        <More href="/projects">All projects</More>
                    </div>
                    <ul className="mt-8">
                        {CURRENT.map((p, i) => (
                            <Reveal key={p.slug} delay={i * 0.06} y={12}>
                                <li className="grid grid-cols-1 gap-1 border-t border-bone/10 py-6 md:grid-cols-12 md:gap-6">
                                    <span className="text-[clamp(1.5rem,2.6vw,2.25rem)] font-semibold tracking-[-0.035em] text-white md:col-span-5">{p.title}</span>
                                    <span className="text-[16px] leading-relaxed text-bone/60 md:col-span-5 md:pt-2">{p.summary}</span>
                                    <span className="text-[14px] text-bone/40 md:col-span-2 md:pt-2.5 md:text-right">{p.partner}</span>
                                </li>
                            </Reveal>
                        ))}
                    </ul>

                    <div className="mt-20">
                        <Kicker>Past work</Kicker>
                        <div className="mt-6 flex flex-wrap gap-2">
                            {PAST.map((p) => (
                                <span key={p.slug} className="rounded-full border border-bone/15 px-4 py-2 text-[15px] text-bone/75">
                                    {p.title} <span className="text-bone/40">· {p.partner}</span>
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="mt-20">
                        <Kicker>Worked with</Kicker>
                        <p className="mt-6 text-[clamp(1.4rem,2.4vw,2rem)] font-semibold leading-snug tracking-[-0.03em] text-bone/35">
                            {PARTNERS.map((name, i) => (
                                <span key={name}>
                                    <span className="text-bone/80 transition-colors hover:text-white">{name}</span>
                                    {i < PARTNERS.length - 1 && <span className="mx-3 text-red">·</span>}
                                </span>
                            ))}
                        </p>
                    </div>
                </section>
            </main>

            <Footer />
        </>
    );
}
