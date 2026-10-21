import Link from "next/link";
import Mark from "./Mark";
import Footer from "./Footer";
import { cn } from "@/lib/utils";

export default function SubPage({ title, intro, children, aside }: { title: string; intro?: React.ReactNode; children: React.ReactNode; aside?: React.ReactNode }) {
    return (
        <div className="min-h-svh bg-paper text-ink">
            <div className={cn(aside ? "md:grid md:grid-cols-2" : "")}>
                {aside && (
                    <div className="relative h-[42svh] md:sticky md:top-0 md:h-svh">{aside}</div>
                )}
                <main className={cn("px-5 pb-28 pt-8 md:pt-12", aside ? "md:px-[4vw]" : "mx-auto max-w-[57rem]")}>
                    <Link href="/" aria-label="Home" className="-ml-1 inline-flex size-9 items-center justify-center text-ink-2 transition-colors hover:text-ink">
                        <svg width="12" height="20" viewBox="0 0 12 20" fill="none" aria-hidden>
                            <path d="M10 2L2 10l8 8" stroke="currentColor" strokeWidth="1.6" />
                        </svg>
                    </Link>
                    <h1 className="mt-8 flex items-center gap-[0.18em] text-[clamp(3.25rem,6vw,4.5rem)] font-medium leading-none tracking-[-0.045em]">
                        <Mark className="size-[0.78em]" />
                        {title}
                    </h1>
                    {intro && <p className="mt-6 max-w-xl text-[16px] leading-relaxed text-ink-2">{intro}</p>}
                    <div className="mt-14">{children}</div>
                </main>
            </div>
            <Footer tone="light" />
        </div>
    );
}

export function Group({ title, children }: { title?: string; children: React.ReactNode }) {
    return (
        <section className="mb-14 last:mb-0">
            {title && <h2 className="mb-4 text-[19px] tracking-[-0.02em] text-ink-2">{title}</h2>}
            <ul className="border-t border-ink/10">{children}</ul>
        </section>
    );
}

export function Row({ left, right, sub, href }: { left: React.ReactNode; right?: React.ReactNode; sub?: React.ReactNode; href?: string }) {
    const inner = (
        <>
            <div className="flex items-baseline justify-between gap-6">
                <span className="text-[18px] tracking-[-0.015em]">{left}</span>
                {right && <span className="shrink-0 text-right text-[15px] text-ink-2">{right}</span>}
            </div>
            {sub && <div className="mt-1.5 max-w-xl text-[15px] leading-relaxed text-ink-2">{sub}</div>}
        </>
    );
    return (
        <li className="border-b border-ink/10">
            {href ? (
                <a href={href} target="_blank" rel="noopener noreferrer" className="block py-5 transition-opacity hover:opacity-60">
                    {inner}
                </a>
            ) : (
                <div className="py-5">{inner}</div>
            )}
        </li>
    );
}
