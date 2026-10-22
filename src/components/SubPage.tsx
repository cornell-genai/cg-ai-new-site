import Mark from "./Mark";
import Footer from "./Footer";
import Scramble from "./Scramble";

export default function SubPage({ title, intro, children }: { title: string; intro?: React.ReactNode; children: React.ReactNode }) {
    return (
        <>
            <main className="mx-auto min-h-svh max-w-[60rem] px-5 pb-28 pt-36 md:pt-44">
                <h1 className="flex items-center gap-[0.2em] text-[clamp(3.25rem,7vw,5.5rem)] font-medium leading-none tracking-[-0.05em]">
                    <Mark className="size-[0.72em]" />
                    <Scramble text={title} duration={500} />
                </h1>
                {intro && <p className="mt-7 max-w-xl text-[18px] font-medium leading-snug tracking-[-0.01em] text-bone/70">{intro}</p>}
                <div className="mt-16">{children}</div>
            </main>
            <Footer />
        </>
    );
}

export function Group({ title, children }: { title?: string; children: React.ReactNode }) {
    return (
        <section className="mb-14 last:mb-0">
            {title && <h2 className="mb-3 font-mono text-[12px] uppercase tracking-[0.08em] text-bone/40">{title}</h2>}
            <ul className="border-t border-bone/12">{children}</ul>
        </section>
    );
}

export function Row({ left, right, sub, href }: { left: React.ReactNode; right?: React.ReactNode; sub?: React.ReactNode; href?: string }) {
    const inner = (
        <>
            <div className="flex items-baseline justify-between gap-6">
                <span className="text-[19px] tracking-[-0.015em]">{left}</span>
                {right && <span className="shrink-0 text-right text-[14px] text-bone/50">{right}</span>}
            </div>
            {sub && <div className="mt-1.5 max-w-xl text-[15px] leading-relaxed text-bone/50">{sub}</div>}
        </>
    );
    return (
        <li className="border-b border-bone/12">
            {href ? (
                <a href={href} target={href.startsWith("mailto:") ? undefined : "_blank"} rel="noopener noreferrer" className="block py-5 transition-colors hover:text-red">
                    {inner}
                </a>
            ) : (
                <div className="py-5">{inner}</div>
            )}
        </li>
    );
}
