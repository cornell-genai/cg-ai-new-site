import Mark from "./Mark";
import Footer from "./Footer";
import Scramble from "./Scramble";

export default function SubPage({
    title,
    intro,
    banner,
    children,
}: {
    title: string;
    intro?: React.ReactNode;
    /** A full-bleed header that carries the title itself. */
    banner?: React.ReactNode;
    children: React.ReactNode;
}) {
    return (
        <>
            {banner}
            <main className={`mx-auto min-h-svh max-w-[60rem] px-5 pb-28 ${banner ? "pt-14 md:pt-20" : "pt-36 md:pt-44"}`}>
                {!banner && (
                    <h1 className="flex items-center gap-[0.2em] text-[clamp(3.25rem,7vw,5.5rem)] font-medium leading-none tracking-[-0.05em]">
                        <Mark className="size-[0.72em]" />
                        {title}
                    </h1>
                )}
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
            {title && <h2 className="mb-3 font-mono text-[12px] uppercase tracking-[0.08em] text-bone/40"><Scramble text={title} duration={380} /></h2>}
            <ul className="border-t border-bone/12">{children}</ul>
        </section>
    );
}
