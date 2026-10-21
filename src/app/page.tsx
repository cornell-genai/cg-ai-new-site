import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Swarm from "@/components/Swarm";
import Pillars from "@/components/Pillars";
import DotMatrix from "@/components/DotMatrix";
import { MEMBERS } from "@/lib/data";

export default function Home() {
    return (
        <div className="bg-night text-bone">
            <Nav />

            <section className="relative h-[calc(100svh-4rem)] min-h-[560px] overflow-hidden">
                <Swarm />

                <p
                    data-swarm-avoid
                    className="absolute left-5 top-5 max-w-[30rem] border border-bone/10 bg-night/90 px-4 py-3 text-[16px] leading-[1.55] backdrop-blur-sm md:text-[17px]"
                >
                    Cornell&apos;s student-run community for <span className="bg-red px-1 text-bone">building with AI</span>. Engineers, product managers,
                    and designers shipping projects with industry partners.
                </p>

                <h1 className="absolute bottom-5 left-5 flex flex-col items-start gap-4 md:left-auto md:right-6 md:flex-row md:items-end md:gap-[calc(var(--swarm-cell,12px)*1.4)]">
                    <span data-swarm-mark aria-hidden className="block size-[calc(var(--swarm-cell,12px)*9)] shrink-0" />
                    <span
                        data-swarm-avoid
                        className="block text-[clamp(3.5rem,17vw,6rem)] font-medium leading-[0.8] tracking-[-0.05em] md:-mb-[0.06em] md:whitespace-nowrap md:text-[calc(var(--swarm-cell,12px)*12.4)]"
                    >
                        Cornell <br className="md:hidden" />
                        GenAI
                    </span>
                </h1>
            </section>

            <Pillars
                heading={
                    <>
                        We build <span className="text-red">AI products</span> with industry partners and for Cornell.
                    </>
                }
                items={[
                    { title: "Partner Projects", body: "Semester-long builds with Cisco, Charter, QuickFi, Vero, and Gradial. Small teams working on real problems with real data." },
                    { title: "Internal Products", body: "Tools for Cornell, like ClassGPT: AI tutors grounded in each course's material." },
                    { title: "Who We Are", body: `${MEMBERS.length} engineers, product managers, and designers, recruited each semester.` },
                    {
                        title: "Past Work",
                        body: "Insurance verification and vendor due diligence agents for QuickFi, an AI tutoring platform, and more.",
                        cta: { href: "/get-involved", label: "Get Involved" },
                    },
                ]}
                aside={
                    <div className="aspect-[400/188] w-full">
                        <DotMatrix src="/brand/team-src.jpg" alt="Members of Cornell GenAI" pitch={7} background="#161616" sourceBackground="#f9f8f4" />
                    </div>
                }
            />

            <Footer />
        </div>
    );
}
