import Link from "next/link";
import GrainField from "@/components/GrainField";
import AsciiField from "@/components/AsciiField";
import DotMatrix from "@/components/DotMatrix";
import Label from "@/components/Label";
import Counter from "@/components/Counter";
import Portrait from "@/components/Portrait";
import WorkIndex from "@/components/WorkIndex";
import { MaskLines, Reveal } from "@/components/Reveal";
import { PALETTES } from "@/lib/palettes";
import { ACTIVE_BUILDS, MEMBERS, PARTNERS, PROJECTS } from "@/lib/data";

const PILLARS = [
    { n: "01", title: "Partner projects", body: "Semester-long builds with companies like Cisco, Charter, and QuickFi." },
    { n: "02", title: "Internal products", body: "Tools for Cornell, like ClassGPT: AI tutors grounded in course material." },
    { n: "03", title: "Workshops", body: "Reading groups, technical workshops, and talks from people building in industry." },
    { n: "04", title: "The team", body: "Engineers, product managers, and designers, recruited each semester." },
];

export default function HomePage() {
    return (
        <>
            {/* Hero */}
            <section className="px-2 pt-14 md:px-3">
                <div className="relative h-[calc(100svh-4rem)] min-h-[600px] overflow-hidden rounded-[18px] text-paper">
                    <AsciiField scene="tower" palette={PALETTES.ember} />
                    <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#07070a] from-15% via-[#07070a]/50 via-55% to-transparent md:bg-gradient-to-r md:from-[#07070a]/85 md:from-0% md:via-transparent md:via-50%" />

                    <div className="absolute inset-x-0 bottom-0 grid grid-cols-12 gap-y-6 px-6 pb-8 md:pb-10">
                        <h1 className="col-span-12 text-[clamp(3rem,7.5vw,8rem)] font-medium leading-[0.88] tracking-[-0.055em] md:col-span-9">
                            <MaskLines lines={["Generative AI", "at Cornell"]} delay={0.15} />
                        </h1>
                        <Reveal delay={0.5} className="col-span-12 max-w-[24rem] text-[17px] leading-snug text-paper/80 md:col-span-5">
                            Cornell&apos;s student-run community for building with AI.
                        </Reveal>
                        <Reveal delay={0.6} className="col-span-12 flex items-end gap-2 md:col-span-7 md:justify-end">
                            <Link href="/work" className="rounded-full bg-paper px-5 py-2.5 text-[14px] font-medium text-ink transition-colors hover:bg-ember hover:text-paper">
                                Our work
                            </Link>
                            <Link href="/apply" className="rounded-full border border-paper/40 px-5 py-2.5 text-[14px] font-medium transition-colors hover:bg-paper hover:text-ink">
                                Get involved
                            </Link>
                        </Reveal>
                    </div>
                </div>
            </section>

            {/* About */}
            <section className="mx-auto grid grid-cols-12 gap-x-4 gap-y-8 px-4 pt-28 md:px-6 md:pt-40">
                <Label index="01" className="col-span-12 md:col-span-3">About</Label>
                <Reveal className="col-span-12 md:col-span-9">
                    <p className="max-w-[22em] text-[clamp(1.75rem,3.4vw,3.25rem)] font-medium leading-[1.06] tracking-[-0.035em]">
                        We build AI products with industry partners and for Cornell.{" "}
                        <span className="text-ink-3">Small teams, one project each, one semester.</span>
                    </p>
                </Reveal>
                <div className="col-span-12 grid grid-cols-1 border-t border-line sm:grid-cols-3 md:col-span-9 md:col-start-4 md:mt-12">
                    {[
                        { n: MEMBERS.length, label: "Members" },
                        { n: PARTNERS.length, label: "Industry partners" },
                        { n: ACTIVE_BUILDS.length, label: "Active projects" },
                    ].map((s, i) => (
                        <Reveal key={s.label} delay={i * 0.08} className="flex items-end justify-between border-b border-line py-6 sm:block sm:border-b-0 sm:border-r sm:py-8 sm:pr-6 sm:last:border-r-0 sm:[&:not(:first-child)]:pl-6">
                            <div className="text-[clamp(3.5rem,7vw,6.5rem)] font-medium leading-none tracking-[-0.06em]">
                                <Counter to={s.n} />
                            </div>
                            <div className="label mt-3 text-ink-2">{s.label}</div>
                        </Reveal>
                    ))}
                </div>
            </section>

            {/* What we do */}
            <section className="mx-auto px-4 pt-28 md:px-6 md:pt-40">
                <Label index="02" className="mb-10">What we do</Label>
                <div className="grid grid-cols-1 border-l border-t border-line sm:grid-cols-2 lg:grid-cols-4">
                    {PILLARS.map((p, i) => (
                        <Reveal key={p.n} delay={i * 0.06} y={16} className="h-full">
                            <article className="flex h-full min-h-[200px] flex-col justify-between gap-10 border-b border-r border-line p-5 sm:min-h-[260px] md:p-6">
                                <span className="label text-ink-3">{p.n}</span>
                                <div>
                                    <h3 className="mb-2 text-[24px] font-medium leading-none tracking-[-0.035em]">{p.title}</h3>
                                    <p className="max-w-[30ch] text-[15px] leading-relaxed text-ink-2">{p.body}</p>
                                </div>
                            </article>
                        </Reveal>
                    ))}
                </div>
            </section>

            {/* Work */}
            <section className="mx-auto px-4 pt-28 md:px-6 md:pt-40">
                <div className="mb-10 flex items-end justify-between gap-6">
                    <Label index="03">Selected work</Label>
                    <Link href="/work" className="label text-ink-2 transition-colors hover:text-ember">All work →</Link>
                </div>
                <WorkIndex projects={PROJECTS} />
            </section>

            {/* Current projects */}
            <section className="mx-auto px-4 pt-28 md:px-6 md:pt-40">
                <Label index="04" className="mb-10">Current projects</Label>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {ACTIVE_BUILDS.map((b, i) => (
                        <Reveal key={b.name} delay={i * 0.05} y={12}>
                            <div className="flex h-full items-center justify-between gap-6 rounded-[14px] bg-paper-2 p-5">
                                <h3 className="text-[20px] font-medium leading-tight tracking-[-0.03em]">{b.name}</h3>
                                <div className="flex shrink-0 items-center">
                                    {b.members.map((m) => (
                                        <Portrait key={m.name} member={m} hover={false} className="-ml-2 size-8 rounded-full ring-2 ring-paper-2 first:ml-0 [&_span]:font-sans [&_span]:text-[12px] [&_span]:not-italic" />
                                    ))}
                                </div>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </section>

            {/* Team */}
            <section className="mx-auto px-4 pt-28 md:px-6 md:pt-40">
                <div className="mb-10 flex items-end justify-between gap-6">
                    <Label index="05">Team</Label>
                    <Link href="/team" className="label text-ink-2 transition-colors hover:text-ember">Meet the team →</Link>
                </div>
                <figure className="relative aspect-[400/188] overflow-hidden">
                    <DotMatrix src="/brand/team-src.jpg" alt="The Cornell GenAI team" pitch={8} />
                </figure>
            </section>

            {/* Partners */}
            <section className="mx-auto px-4 pt-28 md:px-6 md:pt-40">
                <Label index="06" className="mb-10">Partners</Label>
                <div className="grid grid-cols-2 border-l border-t border-line sm:grid-cols-3 lg:grid-cols-5">
                    {PARTNERS.map((p) => (
                        <div key={p.name} className="group flex aspect-[3/2] items-center justify-center border-b border-r border-line p-8">
                            <span className="flex items-center gap-2.5 opacity-60 mix-blend-multiply grayscale transition-all duration-500 group-hover:opacity-100 group-hover:grayscale-0">
                                <img src={p.logo} alt={"wordmark" in p ? "" : p.name} className={"wordmark" in p ? "h-8 w-auto" : "max-h-12 max-w-[9rem] object-contain"} />
                                {"wordmark" in p && <span className="text-[26px] font-semibold tracking-[-0.04em]">{p.name}</span>}
                            </span>
                        </div>
                    ))}
                </div>
            </section>

            {/* Campus */}
            <section className="px-2 pt-28 md:px-3 md:pt-40">
                <div className="relative h-[70svh] min-h-[420px] overflow-hidden rounded-[18px]">
                    <AsciiField image="/brand/campus-src.jpg" palette={PALETTES.dusk} cell={8} />
                </div>
            </section>

            {/* Apply */}
            <section className="px-2 pb-2 pt-2 md:px-3 md:pb-3 md:pt-3">
                <div className="relative overflow-hidden rounded-[18px] text-paper">
                    <GrainField palette={PALETTES.cobalt} pixel={5} grain={0.35} scale={0.38} seed={4} />
                    <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#01020d]/70 via-[#01020d]/10 to-transparent" />
                    <div className="relative flex min-h-[60svh] flex-col justify-end gap-8 px-6 py-10 md:flex-row md:items-end md:justify-between md:px-10 md:py-12">
                        <h2 className="text-[clamp(3rem,8vw,8rem)] font-medium leading-[0.9] tracking-[-0.055em]">
                            <MaskLines inView lines={["Join us"]} />
                        </h2>
                        <div className="flex flex-col items-start gap-4 md:items-end">
                            <p className="text-[16px] text-paper/80">Recruiting every semester. Engineering and design tracks.</p>
                            <Link href="/apply" className="rounded-full bg-paper px-6 py-3 text-[15px] font-medium text-ink transition-colors hover:bg-ember hover:text-paper">
                                Apply →
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
            <div className="h-2 md:h-3" />
        </>
    );
}
