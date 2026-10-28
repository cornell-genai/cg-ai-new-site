import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import Plate from "@/components/work/Plate";
import { SECTIONS, type Post } from "@/lib/work";

export const metadata: Metadata = {
    title: "Projects",
    description: "Research, client software, products, and members' own projects from Cornell GenAI."
};

const label = "font-mono text-[12px] uppercase tracking-[0.1em]";

// The section heading already names the kind, so a card shows when the work
// happened and where it stands.
function Meta({ post }: { post: Post }) {
    return (
        <p className={`${label} flex flex-wrap gap-x-3 gap-y-1 text-bone-2`}>
            <span className="text-bone/75">{post.when}</span>
            {post.status && <span>{post.status}</span>}
        </p>
    );
}

function Featured({ post, eager }: { post: Post; eager: boolean }) {
    return (
        <Link href={`/projects/${post.slug}/`} className="group grid gap-8 md:grid-cols-12 md:items-end md:gap-10">
            <Plate src={post.banner} eager={eager} className="md:col-span-8" />
            <div className="md:col-span-4">
                <Meta post={post} />
                <h3 className="mt-4 text-balance text-[clamp(1.8rem,2.8vw,2.6rem)] font-medium leading-[1.06] tracking-[-0.035em] text-fg">{post.title}</h3>
                <p className="mt-4 text-[16px] leading-normal text-bone-2">{post.dek}</p>
                <p className="mt-6 text-[15px] text-fg">
                    Read the write-up <span aria-hidden="true" className="inline-block">→</span>
                </p>
            </div>
        </Link>
    );
}

function Card({ post, eager }: { post: Post; eager: boolean }) {
    return (
        <Link href={`/projects/${post.slug}/`} className="group block">
            <Plate src={post.banner} eager={eager} />
            <div className="mt-6">
                <Meta post={post} />
                <h3 className="mt-3 text-balance text-[clamp(1.4rem,1.9vw,1.75rem)] font-medium leading-[1.12] tracking-[-0.03em] text-fg decoration-bone/30 decoration-1 underline-offset-[0.18em] group-hover:underline">
                    {post.title}
                </h3>
                <p className="mt-3 max-w-[34rem] text-[15.5px] leading-normal text-bone-2">{post.dek}</p>
            </div>
        </Link>
    );
}

// One section per kind of project. A section with an odd number of posts
// leads with a featured one, so the two-column grid under it stays even.
// Every banner is set the same way, so the work does the talking.
export default function ProjectsPage() {
    return (
        <>
        <main id="main-content" tabIndex={-1} className="safe-gutters [--gutter:1.25rem] mx-auto min-h-svh max-w-[80rem] pb-20 pt-32 md:[--gutter:2rem] md:pt-44">
            <header>
                <h1 className="text-balance text-[clamp(3.5rem,9vw,7.5rem)] font-medium leading-[0.85] tracking-[-0.055em]">Projects</h1>
                <nav aria-label="Project types" className="mt-8 md:mt-10">
                    <ul className="flex flex-wrap gap-x-6 gap-y-1">
                        {SECTIONS.map((s) => (
                            <li key={s.kind}>
                                <a href={`#${s.kind}`} className="inline-flex min-h-11 items-center gap-2 text-[15px] text-bone-2 underline-offset-4 transition-colors hover:text-fg hover:underline">
                                    {s.title}
                                    <span className="font-mono text-[12px]">{s.posts.length}</span>
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>
            </header>

            <div className="mt-14 flex flex-col gap-24 md:mt-20 md:gap-32">
                {SECTIONS.map((s, i) => {
                    const lead = s.posts.length % 2 === 1 ? s.posts[0] : undefined;
                    const grid = lead ? s.posts.slice(1) : s.posts;
                    const eager = i === 0;
                    return (
                        <section key={s.kind} id={s.kind} aria-labelledby={`${s.kind}-heading`} className="scroll-mt-28 border-t border-bone/15 pt-8 md:scroll-mt-36 md:pt-10">
                            <div className="grid gap-3 md:grid-cols-12 md:items-end md:gap-10">
                                <h2 id={`${s.kind}-heading`} className="text-balance text-[clamp(2.25rem,4.5vw,3.5rem)] font-medium leading-[0.95] tracking-[-0.045em] text-fg md:col-span-8">{s.title}</h2>
                                <p className="max-w-[34rem] text-[15.5px] leading-normal text-bone-2 md:col-span-4">{s.blurb}</p>
                            </div>
                            {lead && (
                                <div className="mt-12 md:mt-16">
                                    <Featured post={lead} eager={eager} />
                                </div>
                            )}
                            {grid.length > 0 && (
                                <div className={`grid gap-x-10 gap-y-16 md:grid-cols-2 md:gap-y-20 ${lead ? "mt-16 md:mt-20" : "mt-12 md:mt-16"}`}>
                                    {grid.map((p) => <Card key={p.slug} post={p} eager={eager} />)}
                                </div>
                            )}
                        </section>
                    );
                })}
            </div>
        </main>
        <Footer />
        </>
    );
}
