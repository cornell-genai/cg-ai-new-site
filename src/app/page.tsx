import Link from "next/link";
import Swarm from "@/components/Swarm";
import Scramble from "@/components/Scramble";
import Footer from "@/components/Footer";
import { MEMBERS, PARTNERS, PROJECTS } from "@/lib/data";

function SectionHead({ title, href, link }: { title: string; href?: string; link?: string }) {
    return (
        <div className="mb-6 flex items-baseline justify-between gap-6">
            <h2 className="font-mono text-[12px] uppercase tracking-[0.08em] text-bone/45">{title}</h2>
            {href && (
                <Link href={href} className="group text-[15px] text-bone/60 transition-colors hover:text-bone">
                    {link} <span className="inline-block transition-transform duration-300 group-hover:translate-x-0.5">→</span>
                </Link>
            )}
        </div>
    );
}

export default function Home() {
    const faces = MEMBERS.filter((m) => m.image).slice(0, 9);

    return (
        <>
            <section className="relative h-svh min-h-[600px] overflow-hidden">
                <Swarm />

                <div data-swarm-avoid className="absolute left-5 top-24 max-w-[19rem] md:left-6 md:top-28 md:max-w-[26rem]">
                    <p className="text-[clamp(1.5rem,2.3vw,2.1rem)] font-semibold leading-[1.08] tracking-[-0.03em] text-white">
                        Cornell&apos;s student-run community for building with AI.
                    </p>
                    <p className="mt-4 max-w-[22rem] text-[15px] leading-relaxed text-bone/55">
                        Engineers, product managers, and designers shipping projects with industry partners.
                    </p>
                </div>

                <h1 className="absolute bottom-[9svh] left-5 flex flex-col items-start gap-4 md:left-auto md:right-[6vw] md:flex-row md:items-end md:gap-[calc(var(--swarm-cell,12px)*1.4)]">
                    <span data-swarm-mark aria-hidden className="block size-[calc(var(--swarm-cell,12px)*9)] shrink-0" />
                    <span
                        data-swarm-avoid
                        className="block text-[clamp(3.5rem,17vw,6rem)] font-medium leading-[0.8] tracking-[-0.05em] md:-mb-[0.06em] md:whitespace-nowrap md:text-[calc(var(--swarm-cell,12px)*11.5)]"
                    >
                        <span className="md:hidden">
                            <Scramble text="Cornell" />
                            <br />
                            <Scramble text="GenAI" />
                        </span>
                        <span className="hidden md:inline">
                            <Scramble text="Cornell GenAI" duration={600} />
                        </span>
                    </span>
                </h1>
            </section>

            <main className="px-5 md:px-6">
                {/* Who we are */}
                <section className="grid grid-cols-1 gap-10 border-t border-bone/10 pt-16 md:grid-cols-12 md:pt-24">
                    <p className="text-[clamp(1.6rem,3vw,2.6rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-white md:col-span-7">
                        Each semester, small teams take one real problem from a company or from Cornell and ship a working AI system.
                    </p>
                    <div className="md:col-span-4 md:col-start-9">
                        <p className="text-[16px] leading-relaxed text-bone/60">
                            We&apos;re {MEMBERS.length} engineers, product managers, and designers. We recruit every semester, and the application is building
                            something.
                        </p>
                        <Link href="/team" className="group mt-6 flex items-center gap-4">
                            <span className="flex">
                                {faces.map((m) => (
                                    <img
                                        key={m.name}
                                        src={m.image}
                                        alt=""
                                        loading="lazy"
                                        className="-ml-2.5 size-10 rounded-full object-cover ring-2 ring-night grayscale transition-[filter] duration-500 first:ml-0 group-hover:grayscale-0"
                                    />
                                ))}
                            </span>
                            <span className="text-[15px] text-bone/60 transition-colors group-hover:text-bone">
                                Meet the team <span className="inline-block transition-transform duration-300 group-hover:translate-x-0.5">→</span>
                            </span>
                        </Link>
                    </div>
                </section>

                {/* Selected work */}
                <section className="pt-24 md:pt-32">
                    <SectionHead title="Selected work" href="/projects" link="All projects" />
                    <div className="grid grid-cols-1 gap-x-4 gap-y-10 md:grid-cols-3">
                        {PROJECTS.map((p) => (
                            <Link key={p.slug} href="/projects" className="group block">
                                <div className="aspect-[4/3] overflow-hidden bg-[#f3f0ea]">
                                    <img
                                        src={p.image}
                                        alt=""
                                        loading="lazy"
                                        className="h-full w-full object-contain p-6 transition-transform duration-700 ease-out-expo group-hover:scale-[1.04]"
                                    />
                                </div>
                                <div className="mt-4 flex items-baseline justify-between gap-4">
                                    <h3 className="text-[19px] font-medium tracking-[-0.02em] text-bone transition-colors group-hover:text-red">{p.title}</h3>
                                    <span className="shrink-0 text-[13px] text-bone/45">{p.partner}</span>
                                </div>
                                <p className="mt-1.5 text-[15px] leading-relaxed text-bone/55">{p.summary}</p>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Partners */}
                <section className="pb-24 pt-24 md:pb-32 md:pt-32">
                    <SectionHead title="Partners" />
                    <div className="flex flex-wrap items-center gap-x-12 gap-y-8 border-t border-bone/10 pt-8 md:justify-between">
                        {PARTNERS.map((p) => (
                            <span key={p.name} className="flex items-center gap-2 opacity-45 transition-opacity duration-300 hover:opacity-90">
                                <img
                                    src={p.logo}
                                    alt={"wordmark" in p ? "" : p.name}
                                    className={`${"wordmark" in p ? "h-6" : "h-7 max-w-[8.5rem]"} w-auto object-contain brightness-0 invert`}
                                />
                                {"wordmark" in p && <span className="text-[20px] font-semibold tracking-[-0.04em]">{p.name}</span>}
                            </span>
                        ))}
                    </div>
                </section>
            </main>

            <Footer />
        </>
    );
}
