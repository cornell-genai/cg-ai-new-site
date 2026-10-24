import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import Cover from "@/components/work/Cover";
import { POSTS, readMinutes, type Post } from "@/lib/work";

export const metadata: Metadata = {
    title: "Projects",
    description: "Write-ups of our client work, research and open source, from the people who built it.",
};

function Card({ post, size }: { post: Post; size: "lg" | "sm" }) {
    return (
        <Link href={`/projects/${post.slug}/`} className="group block">
            <div className="overflow-hidden rounded-[3px] transition-transform duration-700 ease-out-expo group-hover:-translate-y-1">
                <Cover motif={post.motif} palette={post.palette} logos={post.logos} />
            </div>
            <h2
                className={`mt-6 font-medium leading-[1.12] tracking-[-0.03em] text-fg decoration-[0.06em] underline-offset-[0.14em] group-hover:underline ${size === "lg" ? "text-[clamp(1.7rem,2.6vw,2.4rem)]" : "text-[clamp(1.5rem,2.1vw,2rem)]"}`}
                style={{ textDecorationColor: post.palette.accent }}
            >
                {post.title}
            </h2>
            <div className="mt-5 flex items-center justify-between gap-4 text-[15px]">
                <span className="flex min-w-0 items-center gap-3">
                    <span className="shrink-0 bg-night-2 px-3 py-1 text-bone/70">{post.tag}</span>
                    <span className="truncate text-bone/45">{post.when}</span>
                </span>
                <span className="shrink-0 text-bone/45">{readMinutes(post)} min read</span>
            </div>
        </Link>
    );
}

// Always white, like the Team page. Two staggered columns with plenty of air,
// after a print magazine more than a grid.
export default function ProjectsPage() {
    const left = POSTS.filter((_, i) => i % 2 === 0);
    const right = POSTS.filter((_, i) => i % 2 === 1);
    return (
        <div data-theme-scope="light">
            <main className="mx-auto min-h-svh max-w-[76rem] px-5 pb-28 pt-32 md:px-8 md:pt-44">
                <header className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                    <h1 className="text-[clamp(3.5rem,9vw,7.5rem)] font-medium leading-[0.85] tracking-[-0.055em]">Projects</h1>
                    <p className="max-w-sm text-[18px] font-medium leading-snug tracking-[-0.01em] text-bone/60">
                        What we&apos;ve built with our partners, what we&apos;ve found in research, and what we&apos;ve given back to open source. Written by the people who did the work.
                    </p>
                </header>

                {/* Mobile: one column in order. Desktop: two columns, the right one set lower. */}
                <div className="mt-20 flex flex-col gap-24 md:hidden">
                    {POSTS.map((p) => <Card key={p.slug} post={p} size="lg" />)}
                </div>
                <div className="mt-28 hidden grid-cols-12 md:grid">
                    <div className="col-span-7 flex flex-col gap-40">
                        {left.map((p) => <Card key={p.slug} post={p} size="lg" />)}
                    </div>
                    <div className="col-span-5 col-start-8 flex flex-col gap-40 pl-6 pt-[22rem] lg:pl-12">
                        {right.map((p) => <Card key={p.slug} post={p} size="sm" />)}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
