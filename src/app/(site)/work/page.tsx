import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import { PALETTES } from "@/lib/palettes";
import Label from "@/components/Label";
import Portrait from "@/components/Portrait";
import { Reveal } from "@/components/Reveal";
import { ACTIVE_BUILDS, CONTACT_EMAIL, PROJECTS } from "@/lib/data";

export const metadata: Metadata = {
    title: "Work",
    description: "AI systems built by Generative AI at Cornell for industry partners and the Cornell community.",
};

export default function WorkPage() {
    return (
        <>
            <PageHeader
                index="Work"
                title="Work"
                meta={`${PROJECTS.length} selected · ${ACTIVE_BUILDS.length} in progress`}
                palette={PALETTES.dusk}
                seed={2}
                intro={
                    <>
                        Projects for industry partners and for Cornell.
                    </>
                }
            />

            <section className="mx-auto px-4 pt-28 md:px-6 md:pt-40">
                <Label index="01" className="mb-10">Projects</Label>
                <div className="border-t border-line">
                    {PROJECTS.map((p, i) => (
                        <article key={p.slug} id={p.slug} className="grid scroll-mt-20 grid-cols-12 gap-x-4 gap-y-8 border-b border-line py-12 md:py-16">
                            <Reveal className="col-span-12 md:col-span-4">
                                <div className="label mb-6 flex items-center gap-3 text-ink-3">
                                    <span>0{i + 1}</span>
                                    <span className="h-px w-8 bg-line" />
                                    <span className="flex items-center gap-2 text-ink-2">
                                        <span className={p.status === "Shipped" ? "size-1.5 bg-ink" : "size-1.5 animate-pulse bg-ember"} />
                                        {p.status} · {p.term}
                                    </span>
                                </div>
                                <h2 className="mb-5 text-[clamp(2.25rem,4vw,3.75rem)] font-medium leading-[0.95] tracking-[-0.045em]">{p.title}</h2>
                                <p className="mb-4 text-[19px] font-medium leading-snug tracking-[-0.015em]">{p.summary}</p>
                                <p className="mb-8 max-w-md text-[16px] leading-relaxed text-ink-2">{p.description}</p>
                                <dl className="label mb-8 grid max-w-sm grid-cols-[auto_1fr] gap-x-6 gap-y-2">
                                    <dt className="text-ink-3">Partner</dt>
                                    <dd>{p.partner}</dd>
                                    <dt className="text-ink-3">Type</dt>
                                    <dd>{p.kind}</dd>
                                    <dt className="text-ink-3">Stack</dt>
                                    <dd>{p.tags.join(" / ")}</dd>
                                </dl>
                                {p.link && (
                                    <a
                                        href={p.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group inline-flex items-center gap-2 rounded-full border border-ink px-5 py-2.5 text-[14px] font-medium transition-colors hover:bg-ink hover:text-paper"
                                    >
                                        Write-up <span className="transition-transform duration-300 group-hover:translate-x-0.5">↗</span>
                                    </a>
                                )}
                            </Reveal>
                            <Reveal delay={0.1} className="col-span-12 md:col-span-7 md:col-start-6">
                                <div className="group relative aspect-[16/11] overflow-hidden rounded-[14px] bg-paper-2">
                                    <img
                                        src={p.image}
                                        alt={p.title}
                                        loading="lazy"
                                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.2s] ease-out-expo group-hover:scale-[1.03]"
                                    />
                                    <div className="halftone absolute inset-0 opacity-20 mix-blend-multiply" />
                                    <div className="label absolute left-4 top-4 rounded-full bg-paper/85 px-3 py-1.5 backdrop-blur">{p.partner}</div>
                                </div>
                            </Reveal>
                        </article>
                    ))}
                </div>
            </section>

            <section className="mx-auto px-4 pt-28 md:px-6 md:pt-40">
                <Label index="02" className="mb-10">Current</Label>
                <div className="border-t border-line">
                    {ACTIVE_BUILDS.map((b, i) => (
                        <Reveal key={b.name} y={10} delay={i * 0.04}>
                            <div className="group grid grid-cols-12 items-center gap-x-4 gap-y-3 border-b border-line py-5">
                                <span className="label col-span-2 text-ink-3 md:col-span-1">{String(i + 1).padStart(2, "0")}</span>
                                <h3 className="col-span-10 text-[clamp(1.5rem,2.6vw,2.25rem)] font-medium tracking-[-0.035em] transition-transform duration-500 ease-out-expo group-hover:translate-x-2 md:col-span-5">
                                    {b.name}
                                </h3>
                                <div className="col-span-10 col-start-3 flex items-center md:col-span-2 md:col-start-auto">
                                    {b.members.map((m) => (
                                        <Portrait key={m.name} member={m} hover={false} className="-ml-2 size-7 rounded-full ring-2 ring-paper first:ml-0 [&_span]:font-sans [&_span]:text-[11px] [&_span]:not-italic" />
                                    ))}
                                </div>
                                <p className="label col-span-10 col-start-3 text-ink-2 md:col-span-4 md:col-start-auto md:text-right">
                                    {b.members.map((m) => m.name.split(" ")[0]).join(", ")}
                                </p>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </section>

            <section className="mx-auto grid grid-cols-12 gap-4 px-4 py-28 md:px-6 md:py-40">
                <Label index="03" className="col-span-12 md:col-span-4">Partners</Label>
                <div className="col-span-12 md:col-span-8">
                    <p className="mb-8 max-w-2xl text-[clamp(1.75rem,3.2vw,3rem)] font-medium leading-[1.04] tracking-[-0.035em]">
                        Interested in sponsoring a project?
                    </p>
                    <a
                        href={`mailto:${CONTACT_EMAIL}?subject=Project%20partnership`}
                        className="group inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-[15px] font-medium text-paper transition-colors hover:bg-ember"
                    >
                        {CONTACT_EMAIL} <span className="transition-transform duration-300 group-hover:translate-x-0.5">→</span>
                    </a>
                </div>
            </section>
        </>
    );
}
