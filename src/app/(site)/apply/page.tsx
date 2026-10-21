import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import { PALETTES } from "@/lib/palettes";
import Label from "@/components/Label";
import { Reveal } from "@/components/Reveal";
import Timeline, { ApplyButton, StatusPill } from "@/components/Timeline";
import { CONTACT_EMAIL, RECRUITING } from "@/lib/data";

export const metadata: Metadata = {
    title: "Apply",
    description: "Join Generative AI at Cornell. We recruit engineers and designers every semester.",
};

export default function ApplyPage() {
    return (
        <>
            <PageHeader
                index="Apply"
                title="Apply"
                meta="Every semester"
                palette={PALETTES.cobalt}
                seed={7}
                pixel={5}
                intro={
                    <>
                        Two tracks: engineering, and design &amp; marketing.{" "}
                        <span className="text-ink-3">Applicants build an AI project over three weeks.</span>
                    </>
                }
            />

            <section className="mx-auto px-4 pt-20 md:px-6 md:pt-28">
                <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
                    <Label index="01">Tracks</Label>
                    <StatusPill />
                </div>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    {RECRUITING.tracks.map((t, i) => (
                        <Reveal key={t.title} delay={i * 0.08} className="h-full">
                            <article className="flex h-full flex-col justify-between gap-12 rounded-[18px] bg-paper-2 p-6 md:p-8">
                                <div>
                                    <div className="label mb-10 flex justify-between text-ink-3">
                                        <span>Track 0{i + 1}</span>
                                    </div>
                                    <h2 className="mb-4 text-[clamp(2.25rem,4vw,3.5rem)] font-medium leading-none tracking-[-0.045em]">{t.title}</h2>
                                    <p className="max-w-md text-[17px] leading-snug text-ink-2">{t.blurb}</p>
                                </div>
                                <div className="flex flex-col justify-between gap-8 sm:flex-row sm:items-end">
                                    <ul className="space-y-1.5">
                                        {t.lookingFor.map((x) => (
                                            <li key={x} className="label flex items-center gap-2 text-ink-2">
                                                <span className="size-1 bg-ink" /> {x}
                                            </li>
                                        ))}
                                    </ul>
                                    <ApplyButton url={t.url} title={t.title} />
                                </div>
                            </article>
                        </Reveal>
                    ))}
                </div>
            </section>

            <section className="mx-auto grid grid-cols-12 gap-x-4 gap-y-8 px-4 pt-28 md:px-6 md:pt-40">
                <div className="col-span-12 md:col-span-4">
                    <Label index="02">Timeline</Label>
                    <p className="mt-6 max-w-xs text-[15px] leading-relaxed text-ink-2">
                        {RECRUITING.cycle}.
                    </p>
                </div>
                <div className="col-span-12 md:col-span-8">
                    <Timeline />
                </div>
            </section>

            <section className="mx-auto grid grid-cols-12 gap-x-4 gap-y-8 px-4 pt-28 md:px-6 md:pt-40">
                <Label index="03" className="col-span-12 md:col-span-4">FAQ</Label>
                <dl className="col-span-12 border-t border-line md:col-span-8">
                    {RECRUITING.faq.map((f) => (
                        <div key={f.q} className="grid grid-cols-1 gap-2 border-b border-line py-6 md:grid-cols-8 md:gap-4">
                            <dt className="text-[18px] font-medium tracking-[-0.02em] md:col-span-3">{f.q}</dt>
                            <dd className="text-[16px] leading-relaxed text-ink-2 md:col-span-5">{f.a}</dd>
                        </div>
                    ))}
                </dl>
            </section>

            <section className="mx-auto grid grid-cols-1 gap-3 px-4 py-28 md:grid-cols-2 md:px-6 md:py-40">
                <a
                    href={RECRUITING.coffeeChatUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex min-h-[220px] flex-col justify-between rounded-[18px] bg-ink p-6 text-paper transition-colors hover:bg-ember md:p-8"
                >
                    <span className="label text-paper/60">Prospective members</span>
                    <span className="flex items-end justify-between gap-4 text-[clamp(1.75rem,3vw,2.5rem)] font-medium leading-none tracking-[-0.04em]">
                        Book a coffee chat
                        <span className="transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1">↗</span>
                    </span>
                </a>
                <a
                    href={`mailto:${CONTACT_EMAIL}?subject=Partnership%20inquiry`}
                    className="group flex min-h-[220px] flex-col justify-between rounded-[18px] border border-line p-6 transition-colors hover:border-ink md:p-8"
                >
                    <span className="label text-ink-3">Companies</span>
                    <span className="flex items-end justify-between gap-4 text-[clamp(1.75rem,3vw,2.5rem)] font-medium leading-none tracking-[-0.04em]">
                        Partner with us
                        <span className="transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1">↗</span>
                    </span>
                </a>
            </section>
        </>
    );
}
