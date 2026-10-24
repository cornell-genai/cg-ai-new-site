import Link from "next/link";
import type { Block } from "@/lib/work";
import Sketch from "./Sketches";
import { cn } from "@/lib/utils";

// Renders a write-up's blocks. Prose sits in a narrow column; diagrams,
// illustrations and figures step out a little wider.

const prose = "mx-auto max-w-[40rem]";
const wide = "mx-auto max-w-[52rem]";

// [text](href) inside a paragraph. Site paths stay in-app; the rest open a new tab.
function Inline({ text }: { text: string }) {
    const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g);
    return (
        <>
            {parts.map((p, i) => {
                const m = p.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
                if (!m) return p;
                const cls = "underline decoration-bone/30 underline-offset-[0.18em] transition-colors hover:decoration-red";
                return m[2].startsWith("/") ? (
                    <Link key={i} href={m[2]} className={cls}>{m[1]}</Link>
                ) : (
                    <a key={i} href={m[2]} target="_blank" rel="noopener noreferrer" className={cls}>{m[1]}</a>
                );
            })}
        </>
    );
}

function Caption({ children }: { children: React.ReactNode }) {
    return <p className="mt-3 text-[14px] leading-snug text-bone/50">{children}</p>;
}

function Flow({ steps, caption, accent }: { steps: { label: string; note?: string }[]; caption?: string; accent: string }) {
    const cols = steps.length <= 5 ? steps.length : 3;
    return (
        <figure className={wide}>
            <ol className="grid gap-y-7 md:gap-x-5 md:gap-y-10 md:[grid-template-columns:repeat(var(--cols),minmax(0,1fr))]" style={{ "--cols": cols } as React.CSSProperties}>
                {steps.map((s, i) => (
                    <li key={s.label} className="relative border-l-2 pl-5 md:border-l-0 md:border-t-2 md:pl-0 md:pt-5" style={{ borderColor: accent }}>
                        <span className="absolute -left-[7px] top-0 size-3 md:-top-[7px] md:left-0" style={{ background: accent }} />
                        {i < steps.length - 1 && (
                            <span aria-hidden className="absolute -top-[13px] right-0 hidden font-mono text-[15px] leading-none md:block" style={{ color: accent }}>
                                →
                            </span>
                        )}
                        <span className="font-mono text-[11px] tracking-[0.08em] text-bone/45">{String(i + 1).padStart(2, "0")}</span>
                        <p className="mt-1 text-[17px] font-semibold leading-tight tracking-[-0.01em] text-fg">{s.label}</p>
                        {s.note && <p className="mt-1.5 text-[14px] leading-snug text-bone/60">{s.note}</p>}
                    </li>
                ))}
            </ol>
            {caption && <Caption>{caption}</Caption>}
        </figure>
    );
}

export default function Blocks({ blocks, accent }: { blocks: Block[]; accent: string }) {
    return (
        <div className="space-y-7 text-[18px] leading-[1.65] text-bone/85">
            {blocks.map((b, i) => {
                if (typeof b === "string") return <p key={i} className={prose}><Inline text={b} /></p>;
                if ("h" in b)
                    return (
                        <h2 key={i} className={cn(prose, "!mt-16 text-[clamp(1.5rem,2.4vw,1.9rem)] font-semibold leading-tight tracking-[-0.03em] text-fg")}>
                            {b.h}
                        </h2>
                    );
                if ("list" in b)
                    return (
                        <ul key={i} className={cn(prose, "space-y-3")}>
                            {b.list.map((t) => (
                                <li key={t} className="relative pl-6">
                                    <span className="absolute left-0 top-[0.62em] size-[7px]" style={{ background: accent }} />
                                    <Inline text={t} />
                                </li>
                            ))}
                        </ul>
                    );
                if ("quote" in b)
                    return (
                        <figure key={i} className={cn(prose, "!my-14 border-l-[3px] pl-6")} style={{ borderColor: accent }}>
                            <blockquote className="text-[clamp(1.25rem,2vw,1.5rem)] font-medium leading-snug tracking-[-0.02em] text-fg">&ldquo;{b.quote}&rdquo;</blockquote>
                            <figcaption className="mt-4 text-[15px] text-bone/55">{b.by}</figcaption>
                        </figure>
                    );
                if ("flow" in b) return <div key={i} className="!my-14"><Flow steps={b.flow} caption={b.caption} accent={accent} /></div>;
                if ("stats" in b)
                    return (
                        <div key={i} className={cn(wide, "!my-14 grid gap-px overflow-hidden rounded-[6px] border border-bone/12 bg-bone/12 sm:grid-cols-2", b.stats.length > 3 && "lg:grid-cols-4", b.stats.length === 3 && "lg:grid-cols-3")}>
                            {b.stats.map((s) => (
                                <div key={s.label} className="bg-night p-5">
                                    <p className="text-[clamp(1.6rem,2.6vw,2.1rem)] font-semibold leading-none tracking-[-0.04em]" style={{ color: accent }}>{s.value}</p>
                                    <p className="mt-3 text-[14px] leading-snug text-bone/60">{s.label}</p>
                                </div>
                            ))}
                        </div>
                    );
                if ("rows" in b)
                    return (
                        <figure key={i} className={cn(wide, "!my-12")}>
                            <dl className="divide-y divide-bone/12 border-y border-bone/12">
                                {b.rows.map((r) => (
                                    <div key={r.label} className="grid gap-1 py-4 md:grid-cols-[10rem_1fr] md:gap-6">
                                        <dt className="flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.08em]" style={{ color: accent }}>
                                            <span className="size-1.5" style={{ background: accent }} />
                                            {r.label}
                                        </dt>
                                        <dd className="text-[16px] leading-snug text-bone/80">{r.body}</dd>
                                    </div>
                                ))}
                            </dl>
                            {b.caption && <Caption>{b.caption}</Caption>}
                        </figure>
                    );
                if ("figure" in b)
                    return (
                        <figure key={i} className={cn(wide, "!my-14")}>
                            <img src={b.figure} alt={b.alt} loading="lazy" className="w-full rounded-[6px] border border-bone/12 bg-white" />
                            <Caption>{b.caption}</Caption>
                        </figure>
                    );
                if ("sketch" in b)
                    return (
                        <figure key={i} className={cn(wide, "!my-14")}>
                            <Sketch name={b.sketch} accent={accent} />
                            <Caption>{b.caption}</Caption>
                        </figure>
                    );
                if ("people" in b)
                    return (
                        <ul key={i} className={cn(prose, "divide-y divide-bone/10 border-y border-bone/10 text-[16px] leading-snug")}>
                            {b.people.map((p) => (
                                <li key={p.name} className="grid gap-1 py-3 sm:grid-cols-[10rem_1fr] sm:gap-5">
                                    <span className="font-semibold text-fg">{p.name}</span>
                                    <span className="text-bone/70">{p.did}</span>
                                </li>
                            ))}
                        </ul>
                    );
                return (
                    <ul key={i} className={cn(prose, "!mt-12 border-t border-bone/12")}>
                        {b.links.map((l) => (
                            <li key={l.href} className="border-b border-bone/12">
                                <a href={l.href} target="_blank" rel="noopener noreferrer" className="group flex items-baseline justify-between gap-4 py-4">
                                    <span>
                                        <span className="font-semibold text-fg">{l.label}</span>
                                        {l.note && <span className="block text-[15px] text-bone/55">{l.note}</span>}
                                    </span>
                                    <span className="text-bone/40 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-red">↗</span>
                                </a>
                            </li>
                        ))}
                    </ul>
                );
            })}
        </div>
    );
}
