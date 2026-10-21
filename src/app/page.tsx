import Swarm from "@/components/Swarm";
import Scramble from "@/components/Scramble";

export default function Home() {
    return (
        <main className="relative h-svh min-h-[600px] overflow-hidden">
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
                        <Scramble text="Cornell" delay={150} />
                        <br />
                        <Scramble text="GenAI" delay={300} />
                    </span>
                    <span className="hidden md:inline">
                        <Scramble text="Cornell GenAI" delay={150} duration={1000} />
                    </span>
                </span>
            </h1>
        </main>
    );
}
