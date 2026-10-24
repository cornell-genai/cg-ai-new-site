import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import Plate from "@/components/work/Plate";
import { POSTS, readMinutes, type Post } from "@/lib/work";

export const metadata: Metadata = {
    title: "Projects",
    description: "Write-ups of our client work, research and open source, from the people who built it.",
};

const label = "font-mono text-[11px] uppercase tracking-[0.1em]";

function Meta({ post }: { post: Post }) {
    return (
        <p className={`${label} flex flex-wrap gap-x-3 gap-y-1 text-bone/45`}>
            <span className="text-bone/75">{post.tag}</span>
            <span>{post.when}</span>
            <span>{readMinutes(post)} min</span>
        </p>
    );
}

// One featured write-up, then the rest on an even two-column grid. Every
// banner is set the same way, so the work does the talking.
export default function ProjectsPage() {
    const [lead, ...rest] = POSTS;
    return (
        <>
        <main className="mx-auto min-h-svh max-w-[80rem] px-5 pb-20 pt-32 md:px-8 md:pt-44">
            <header className="grid gap-8 border-b border-bone/10 pb-12 md:grid-cols-12 md:items-end">
                <div className="md:col-span-8">
                    <p className={`${label} text-bone/45`}>Projects · {String(POSTS.length).padStart(2, "0")} write-ups</p>
                    <h1 className="mt-5 text-[clamp(3.5rem,9vw,7.5rem)] font-medium leading-[0.85] tracking-[-0.055em]">Projects</h1>
                </div>
                <p className="max-w-sm text-[17px] leading-snug text-bone/60 md:col-span-4 md:justify-self-end">
                    What we&apos;ve built with our partners, found in research and given back to open source. Written by the people who did the work.
                </p>
            </header>

            <Link href={`/projects/${lead.slug}/`} className="group mt-14 grid gap-8 md:mt-20 md:grid-cols-12 md:items-end md:gap-10">
                <Plate src={lead.banner} eager className="md:col-span-8" />
                <div className="md:col-span-4">
                    <Meta post={lead} />
                    <h2 className="mt-4 text-[clamp(1.8rem,2.8vw,2.6rem)] font-medium leading-[1.06] tracking-[-0.035em] text-fg">{lead.title}</h2>
                    <p className="mt-4 text-[16px] leading-snug text-bone/60">{lead.dek}</p>
                    <p className="mt-6 text-[15px] text-fg">
                        Read the write-up <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
                    </p>
                </div>
            </Link>

            <div className="mt-24 flex items-center gap-4 md:mt-32">
                <p className={`${label} shrink-0 text-bone/45`}>All projects</p>
                <span className="h-px flex-1 bg-bone/10" />
            </div>

            <div className="mt-10 grid gap-x-10 gap-y-16 md:grid-cols-2 md:gap-y-20">
                {rest.map((p) => (
                    <Link key={p.slug} href={`/projects/${p.slug}/`} className="group block">
                        <Plate src={p.banner} />
                        <div className="mt-6">
                            <Meta post={p} />
                            <h2 className="mt-3 text-[clamp(1.4rem,1.9vw,1.75rem)] font-medium leading-[1.12] tracking-[-0.03em] text-fg decoration-bone/30 decoration-1 underline-offset-[0.18em] group-hover:underline">
                                {p.title}
                            </h2>
                            <p className="mt-3 line-clamp-2 max-w-[34rem] text-[15.5px] leading-snug text-bone/55">{p.dek}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </main>
        <Footer />
        </>
    );
}
