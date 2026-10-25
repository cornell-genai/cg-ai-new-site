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
                <section className="relative h-svh min-h-[600px] overflow-hidden">
                    <Life />

                    {/* Centred lockup, mark to the left, tagline below: life never grows over them. The
                        mark's slot is whole cells (11 tall, 10 wide for the logo's 0.85 aspect) and Life reads
                        its size from here; it is centred on the wordmark. Below lg the wordmark stacks onto two lines. */}
                    <div className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 flex-col items-center px-5 pt-16">
                        <h1 className="flex items-center justify-center gap-[calc(var(--swarm-cell,12px)*1.4)]">
                            <span data-swarm-mark aria-hidden className="block h-[calc(var(--swarm-cell,12px)*11)] w-[calc(var(--swarm-cell,12px)*10)] shrink-0"><Mark className="life-mark h-full w-full" /></span>
                            <span
                                data-swarm-avoid
                                className="-mb-[0.06em] block text-[calc(var(--swarm-cell,12px)*5.6)] font-medium leading-[0.8] tracking-[-0.05em] text-fg lg:whitespace-nowrap lg:text-[calc(var(--swarm-cell,12px)*11.5)]"
                            >
                                Cornell <br className="lg:hidden" />
                                GenAI
                            </span>
                        </h1>
                        <p data-swarm-avoid className="mt-[calc(var(--swarm-cell,12px)*2.5)] text-center text-[clamp(1rem,1.6vw,1.375rem)] font-medium tracking-[-0.02em] text-bone/65">
                            Building at the frontier of AI.
                        </p>
                    </div>
                </section>

                <div className="safe-gutters overflow-clip [--gutter:1.75rem] md:[--gutter:8vw]">
                    <section aria-labelledby="people-heading" className="pt-20 md:pt-32">
                        <div className="mx-auto max-w-3xl text-center">
                            <h2 id="people-heading" className="text-[clamp(1.75rem,3.6vw,3rem)] font-semibold leading-[1.2] tracking-[-0.035em] text-fg">
                                {MEMBER_COUNT} members across engineering, research, and business.
                            </h2>
                        </div>
                        <div className="mx-auto mt-12 max-w-[1040px] md:mt-16">
                            <Link href="/team" className="group block text-center" aria-label="Meet the team">
                                {/* The team cut out of the photo's background (transparent WebP), with a faint
                                    Game of Life running above the group's outline. */}
                                <OutlineLife src="/brand/team.webp" alt="The Cornell GenAI team" />
                            </Link>
                        </div>
                    </section>

                    <section aria-labelledby="work-heading" className="mx-auto max-w-[54rem] py-24 md:py-36">
                        <h2 id="work-heading" className="sr-only">What we build</h2>
                        <p className="text-[clamp(1.6rem,3.3vw,3rem)] font-semibold leading-[1.4] tracking-[-0.035em] text-fg">
                            We&apos;re a Cornell student organization that builds generative AI systems. We{" "}
                            <Link href="/projects" className="underline decoration-red decoration-[0.07em] underline-offset-[0.14em] hover:text-red">build for corporate clients</Link>{" "}
                            <span className="whitespace-nowrap"><ClientStack />,</span>{" "}
                            shipping agents and workflow automations that partners use in production. We run{" "}
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
