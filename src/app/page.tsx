import Link from "next/link";
import Life from "@/components/Life";
import Footer from "@/components/Footer";
import OutlineLife from "@/components/OutlineLife";
import { ClientStack, OpenSourceStack, ProjectIcons } from "@/components/Inline";
import { GITHUB_URL, MEMBER_COUNT } from "@/lib/data";
import Mark from "@/components/Mark";

export default function Home() {
    return (
        <>
            <main id="main-content" tabIndex={-1}>
                <section className="relative flex min-h-[max(600px,100svh)] items-center justify-center safe-gutters overflow-hidden pb-20 pt-16 [--gutter:1.25rem] md:[--gutter:1.5rem]">
                    <Life />

                    <div className="relative grid w-fit max-w-full grid-cols-1 items-start gap-6 text-start text-[clamp(2.75rem,7vw,7rem)] sm:grid-cols-[auto_minmax(0,1fr)] sm:gap-7">
                        <span data-swarm-mark aria-hidden className="hidden sm:block sm:aspect-[0.85] sm:h-[clamp(8rem,17vw,14rem)] sm:w-auto"><Mark className="life-mark h-full w-full" /></span>
                        <div className="min-w-0">
                            <h1 className="-ms-[0.025em] text-[1em] font-[650] leading-[1.02] tracking-[-0.04em] text-fg">
                                <span data-swarm-avoid>Cornell</span>{" "}
                                <span data-swarm-avoid>GenAI</span>
                            </h1>
                            <p data-swarm-avoid className="mt-5 w-fit text-balance text-[clamp(1.125rem,2vw,1.5rem)] font-medium leading-snug tracking-[-0.02em] text-fg md:mt-6">
                                Students shipping AI.
                            </p>
                            <p data-swarm-avoid className="mt-3 max-w-[38rem] text-balance text-[16px] leading-relaxed text-bone/65 md:text-[18px]">
                                Applied research, production systems for clients, and open source.
                            </p>
                            <div data-swarm-avoid className="mt-6 flex flex-wrap gap-x-6 gap-y-1 text-[16px] font-medium">
                                <Link href="/projects" className="inline-flex min-h-11 items-center gap-2 hover:text-red"><span className="underline decoration-red underline-offset-[0.3em]">Explore projects</span><span aria-hidden>→</span></Link>
                                <Link href="/get-involved" className="inline-flex min-h-11 items-center gap-2 text-bone-2 hover:text-fg">Get involved <span aria-hidden>→</span></Link>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="safe-gutters overflow-clip [--gutter:1.75rem] md:[--gutter:8vw]">
                    <section aria-labelledby="people-heading" className="pt-20 md:pt-32">
                        <div className="mx-auto max-w-3xl text-center">
                            <h2 id="people-heading" className="text-[clamp(1.75rem,3.6vw,3rem)] font-semibold leading-[1.2] tracking-[-0.035em] text-fg">
                                {MEMBER_COUNT} vetted members across engineering, research, and business.
                            </h2>
                        </div>
                        <div className="mx-auto mt-12 max-w-[1040px] md:mt-16">
                            <Link href="/team" className="group block text-center" aria-label="Meet the team">
                                {/* The team cut out of the photo's background (transparent WebP), with a faint
                                    Game of Life running around the group's outline. */}
                                <OutlineLife src="/brand/team.webp" alt="The Cornell GenAI team" />
                            </Link>
                        </div>
                    </section>

                    <section aria-labelledby="work-heading" className="mx-auto max-w-[54rem] py-24 md:py-36">
                        <h2 id="work-heading" className="sr-only">What we build</h2>
                        <p className="text-[clamp(1.6rem,3.3vw,3rem)] font-semibold leading-[1.4] tracking-[-0.035em] text-fg">
                            We&apos;re a project-based Cornell student organization that builds generative AI systems. We{" "}
                            <Link href="/projects" className="underline decoration-red decoration-[0.07em] underline-offset-[0.14em] hover:text-red">build for corporate clients</Link>{" "}
                            <span className="whitespace-nowrap"><ClientStack />,</span>{" "}
                            shipping agents and workflow automation that partners use in production. We run{" "}
                            <Link href="/projects" className="underline decoration-red decoration-[0.07em] underline-offset-[0.14em] hover:text-red">applied AI projects and research</Link>{" "}
                            <span className="whitespace-nowrap"><ProjectIcons />,</span>{" "}
                            from agents for long-horizon tasks to systems that act in the real world, and we{" "}
                            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="underline decoration-red decoration-[0.07em] underline-offset-[0.14em] hover:text-red">contribute to open source</a>{" "}
                            <span className="whitespace-nowrap"><OpenSourceStack />.</span>
                        </p>
                    </section>

                </div>
            </main>

            <Footer />
        </>
    );
}
