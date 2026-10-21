import Nav from "./Nav";
import Footer from "./Footer";
import Backdrop from "./Backdrop";
import { Card } from "./Card";

export default function SubPage({ title, intro, banner, children }: { title: string; intro?: React.ReactNode; banner?: React.ReactNode; children: React.ReactNode }) {
    return (
        <>
            <Backdrop />
            <Nav />
            <main className="relative z-10 mx-auto max-w-[1180px] px-4">
                <Card className="mx-auto mt-6 max-w-[720px] md:mt-10">
                    {banner && <div className="h-[220px] md:h-[300px]">{banner}</div>}
                    <div className="px-6 pb-8 pt-7 md:px-10 md:pb-10">
                        <h1 className="text-[clamp(2.4rem,6vw,3.25rem)] leading-none tracking-[-0.03em]">{title}</h1>
                        {intro && <p className="mt-5 max-w-lg text-[19px] leading-[1.35] tracking-[-0.01em] text-ink-2">{intro}</p>}
                        <div className="mt-10">{children}</div>
                    </div>
                </Card>
            </main>
            <Footer />
        </>
    );
}

export function Group({ title, children }: { title?: string; children: React.ReactNode }) {
    return (
        <section className="mb-10 last:mb-0">
            {title && <h2 className="mb-1 font-mono text-[11.5px] text-ink-3">{title}</h2>}
            <ul>{children}</ul>
        </section>
    );
}

export function Row({ left, right, sub, href }: { left: React.ReactNode; right?: React.ReactNode; sub?: React.ReactNode; href?: string }) {
    const inner = (
        <>
            <div className="flex items-baseline justify-between gap-6">
                <span className="text-[18px] tracking-[-0.01em]">{left}</span>
                {right && <span className="shrink-0 text-right font-mono text-[11.5px] text-ink-2">{right}</span>}
            </div>
            {sub && <div className="mt-1 max-w-xl text-[16px] leading-[1.4] text-ink-2">{sub}</div>}
        </>
    );
    return (
        <li className="border-b border-black/[0.06] last:border-0">
            {href ? (
                <a href={href} target={href.startsWith("mailto:") ? undefined : "_blank"} rel="noopener noreferrer" className="block py-3.5 transition-opacity hover:opacity-60">
                    {inner}
                </a>
            ) : (
                <div className="py-3.5">{inner}</div>
            )}
        </li>
    );
}
