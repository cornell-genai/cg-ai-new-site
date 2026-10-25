import Footer from "./Footer";

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
    const lede = intro && <p className="max-w-sm text-[18px] font-medium leading-normal tracking-[-0.01em] text-bone/70">{intro}</p>;
    return (
        <>
            <main id="main-content" tabIndex={-1}>
                {banner}
                <div className={`safe-gutters [--gutter:1.25rem] mx-auto min-h-svh max-w-[72rem] pb-28 md:[--gutter:2rem] ${banner ? "pt-14 md:pt-20" : "pt-36 md:pt-48"}`}>
                    {banner ? lede : (
                        <header className="flex flex-col gap-6 border-b border-bone/12 pb-10 md:flex-row md:items-end md:justify-between">
                            <h1 className="text-balance text-[clamp(3.5rem,9vw,7.5rem)] font-medium leading-[0.85] tracking-[-0.055em]">{title}</h1>
                            {lede}
                        </header>
                    )}
                    <div className="mt-16">{children}</div>
                </div>
            </main>
            <Footer />
        </>
    );
}
