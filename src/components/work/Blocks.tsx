import Link from "next/link";
import type { Block } from "@/lib/work";
import Sketch from "./Sketches";
import { cn } from "@/lib/utils";

// Renders a write-up's blocks inside the post's main column. Prose keeps a
// readable measure; figures, diagrams and illustrations use the full column.

const prose = "max-w-[42rem]";

export const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

// [text](href) inside a paragraph. Site paths stay in-app; the rest open a new tab.
function Inline({ text }: { text: string }) {
    const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g);
    return (
        <>
            {parts.map((p, i) => {
                const m = p.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
                if (!m) return p;
                const cls = "text-fg underline decoration-bone/30 underline-offset-[0.18em] transition-colors hover:decoration-bone";
                return m[2].startsWith("/") ? (
                    <Link key={i} href={m[2]} className={cls}>{m[1]}</Link>
                ) : (
                    <a key={i} href={m[2]} target="_blank" rel="noopener noreferrer" className={cls}>{m[1]}</a>
                );
            })}
        </>
    );
}

function Caption({ n, children }: { n?: number; children: React.ReactNode }) {
    return (
        <figcaption className="mt-4 flex gap-4 text-[14px] leading-snug text-bone/50">
            {n !== undefined && <span className="shrink-0 font-mono text-[11px] uppercase leading-[1.6] tracking-[0.08em] text-bone/35">Fig. {String(n).padStart(2, "0")}</span>}
            <span>{children}</span>
        </figcaption>
    );
}

function Flow({ steps, caption, accent, n }: { steps: { label: string; note?: string }[]; caption?: string; accent: string; n: number }) {
    const cols = steps.length <= 5 ? steps.length : 3;
    return (
        <figure>
            <div className="rounded-[6px] border border-bone/10 bg-night-2/60 p-5 md:p-7">
                <ol className="grid gap-y-7 md:gap-x-5 md:gap-y-10 md:[grid-template-columns:repeat(var(--cols),minmax(0,1fr))]" style={{ "--cols": cols } as React.CSSProperties}>
                    {steps.map((s, i) => (
                        <li key={s.label} className="relative border-l pl-5 md:border-l-0 md:border-t md:pl-0 md:pt-5" style={{ borderColor: accent }}>
                            <span className="absolute -left-[4px] top-0 size-[7px] md:-top-[4px] md:left-0" style={{ background: accent }} />
                            <span className="font-mono text-[11px] tracking-[0.08em] text-bone/40">{String(i + 1).padStart(2, "0")}</span>
                            <p className="mt-1 text-[16px] font-semibold leading-tight tracking-[-0.01em] text-fg">{s.label}</p>
                            {s.note && <p className="mt-1.5 text-[14px] leading-snug text-bone/55">{s.note}</p>}
                        </li>
                    ))}
                </ol>
            </div>
            {caption && <Caption n={n}>{caption}</Caption>}
        </figure>
    );
}

export default function Blocks({ blocks, accent }: { blocks: Block[]; accent: string }) {
    let fig = 0;
    return (
        <div className="space-y-7 text-[17.5px] leading-[1.7] text-bone/80">
            {blocks.map((b, i) => {
                if (typeof b === "string") return <p key={i} className={prose}><Inline text={b} /></p>;
                if ("h" in b)
                    return (
                        <h2 key={i} id={slugify(b.h)} className={cn(prose, "!mt-20 scroll-mt-28 text-[clamp(1.45rem,2.2vw,1.8rem)] font-semibold leading-tight tracking-[-0.03em] text-fg")}>
                            {b.h}
                        </h2>
                    );
                if ("list" in b)
                    return (
                        <ul key={i} className={cn(prose, "space-y-3")}>
                            {b.list.map((t) => (
                                <li key={t} className="relative pl-6">
                                    <span className="absolute left-0 top-[0.7em] h-px w-3 bg-bone/40" />
                                    <Inline text={t} />
                                </li>
                            ))}
                        </ul>
                    );
                if ("quote" in b)
                    return (
                        <figure key={i} className={cn(prose, "!my-16")}>
                            <blockquote className="text-[clamp(1.3rem,2vw,1.6rem)] font-medium leading-[1.35] tracking-[-0.02em] text-fg">&ldquo;{b.quote}&rdquo;</blockquote>
                            <figcaption className="mt-5 flex items-center gap-3 text-[15px] text-bone/55">
                                <span className="h-px w-6" style={{ background: accent }} />
                                {b.by}
                            </figcaption>
                        </figure>
                    );
                if ("flow" in b) return <div key={i} className="!my-14"><Flow steps={b.flow} caption={b.caption} accent={accent} n={++fig} /></div>;
                if ("stats" in b)
                    return (
                        <div key={i} className={cn("!my-14 grid gap-px overflow-hidden rounded-[6px] border border-bone/10 bg-bone/10 sm:grid-cols-2", b.stats.length > 3 && "lg:grid-cols-4", b.stats.length === 3 && "lg:grid-cols-3")}>
                            {b.stats.map((s) => (
                                <div key={s.label} className="bg-night p-5 md:p-6">
                                    <p className="text-[clamp(1.5rem,2.4vw,2rem)] font-semibold leading-none tracking-[-0.04em] text-fg">{s.value}</p>
                                    <p className="mt-3 text-[14px] leading-snug text-bone/55">{s.label}</p>
                                </div>
                            ))}
                        </div>
                    );
                if ("rows" in b) {
                    const n = b.caption ? ++fig : undefined;
                    return (
                        <figure key={i} className="!my-12">
                            <dl className="divide-y divide-bone/10 border-y border-bone/10">
                                {b.rows.map((r) => (
                                    <div key={r.label} className="grid gap-1 py-4 md:grid-cols-[11rem_1fr] md:gap-8">
                                        <dt className="font-mono text-[12px] uppercase leading-[1.9] tracking-[0.08em] text-fg">{r.label}</dt>
                                        <dd className="text-[16px] leading-snug text-bone/70">{r.body}</dd>
                                    </div>
                                ))}
                            </dl>
                            {b.caption && <Caption n={n}>{b.caption}</Caption>}
                        </figure>
                    );
                }
                if ("figure" in b)
                    return (
                        <figure key={i} className="!my-16">
                            {b.plate ? (
                                <div
                                    className="overflow-hidden rounded-[8px] border border-bone/10 px-[5%] pt-[5%]"
                                    style={{ background: `radial-gradient(120% 90% at 50% 0%, color-mix(in srgb, ${accent} 30%, #121212) 0%, #141414 70%)` }}
                                >
                                    <img src={b.figure} alt={b.alt} loading="lazy" className="w-full rounded-t-[6px] shadow-[0_-1px_0_rgba(255,255,255,0.08),0_30px_80px_-20px_rgba(0,0,0,0.6)]" />
                                </div>
                            ) : (
                                <img src={b.figure} alt={b.alt} loading="lazy" className="w-full rounded-[6px] border border-bone/10 bg-white" />
                            )}
                            <Caption n={++fig}>{b.caption}</Caption>
                        </figure>
                    );
                if ("sketch" in b)
                    return (
                        <figure key={i} className="!my-16">
                            <Sketch name={b.sketch} accent={accent} />
                            <Caption n={++fig}>{b.caption}</Caption>
                        </figure>
                    );
                if ("people" in b)
                    return (
                        <ul key={i} className="divide-y divide-bone/10 border-y border-bone/10 text-[15.5px] leading-snug">
                            {b.people.map((p) => (
                                <li key={p.name} className="grid gap-1 py-3.5 sm:grid-cols-[11rem_1fr] sm:gap-8">
                                    <span className="font-medium text-fg">{p.name}</span>
                                    <span className="text-bone/65">{p.did}</span>
                                </li>
                            ))}
                        </ul>
                    );
                return (
                    <ul key={i} className={cn(prose, "!mt-12 border-t border-bone/10")}>
                        {b.links.map((l) => (
                            <li key={l.href} className="border-b border-bone/10">
                                <a href={l.href} target="_blank" rel="noopener noreferrer" className="group flex items-baseline justify-between gap-4 py-4">
                                    <span>
                                        <span className="font-medium text-fg">{l.label}</span>
                                        {l.note && <span className="block text-[15px] text-bone/50">{l.note}</span>}
                                    </span>
                                    <span className="text-bone/40 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-fg">↗</span>
                                </a>
                            </li>
                        ))}
                    </ul>
                );
            })}
        </div>
    );
}
