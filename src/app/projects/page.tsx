import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import { POSTS, readMinutes, type Post } from "@/lib/work";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
    title: "Projects",
    description: "Write-ups of our client work and research, from the people who built it.",
};

// Each post gets its own spot on the page rather than a slot in a grid: the
// banner's width and column, and whether the words sit beside or below it,
// change from one to the next. Desktop only; on phones they simply stack.
const PLACES = [
    { image: "md:col-span-9", text: "md:col-span-9", beside: false, big: true },
    { image: "md:col-span-7 md:col-start-6", text: "md:col-span-4 md:col-start-1 md:row-start-1", beside: true, big: false },
    { image: "md:col-span-6 md:col-start-2", text: "md:col-span-6 md:col-start-2", beside: false, big: false },
    { image: "md:col-span-8 md:col-start-1", text: "md:col-span-4 md:col-start-9", beside: true, big: false },
    { image: "md:col-span-6 md:col-start-6", text: "md:col-span-6 md:col-start-6", beside: false, big: false },
];

function Entry({ post, n, place }: { post: Post; n: number; place: (typeof PLACES)[number] }) {
    return (
        <Link href={`/projects/${post.slug}/`} className="group grid grid-cols-1 gap-x-8 md:grid-cols-12">
            <div className={cn("overflow-hidden rounded-[3px]", place.image)}>
                <img
                    src={post.banner}
                    alt=""
                    className="aspect-[1.9/1] w-full object-cover transition-transform duration-[1.2s] ease-out-expo group-hover:scale-[1.025]"
                />
            </div>
            <div className={cn("mt-6", place.text, place.beside && "md:mt-0 md:self-end")}>
                <p className="font-mono text-[11px] tracking-[0.08em] text-bone/40">
                    {String(n).padStart(2, "0")} / {String(POSTS.length).padStart(2, "0")}
                </p>
                <h2
                    className={cn(
                        "mt-3 font-medium leading-[1.1] tracking-[-0.03em] text-fg decoration-[0.06em] underline-offset-[0.14em] group-hover:underline",
                        place.big ? "text-[clamp(1.8rem,3vw,2.7rem)]" : "text-[clamp(1.5rem,2.1vw,1.95rem)]",
                    )}
                    style={{ textDecorationColor: post.accent }}
                >
                    {post.title}
                </h2>
                {place.big && <p className="mt-4 max-w-[38rem] text-[17px] leading-snug text-bone/60">{post.dek}</p>}
                <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 text-[15px]">
                    <span className="bg-night-2 px-3 py-1 text-bone/70">{post.tag}</span>
                    <span className="text-bone/45">{post.when}</span>
                    <span className="text-bone/30">·</span>
                    <span className="text-bone/45">{readMinutes(post)} min read</span>
                </div>
            </div>
        </Link>
    );
}

// Always white, like the Team page.
export default function ProjectsPage() {
    return (
        <div data-theme-scope="light">
            <main className="mx-auto min-h-svh max-w-[78rem] px-5 pb-28 pt-32 md:px-8 md:pt-44">
                <header className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                    <h1 className="text-[clamp(3.5rem,9vw,7.5rem)] font-medium leading-[0.85] tracking-[-0.055em]">Projects</h1>
                    <p className="max-w-sm text-[18px] font-medium leading-snug tracking-[-0.01em] text-bone/60">
                        What we&apos;ve built with our partners and what we&apos;ve found in research, written by the people who did the work.
                    </p>
                </header>

                <div className="mt-20 flex flex-col gap-24 md:mt-28 md:gap-44">
                    {POSTS.map((p, i) => (
                        <Entry key={p.slug} post={p} n={i + 1} place={PLACES[i % PLACES.length]} />
                    ))}
                </div>
            </main>
            <Footer />
        </div>
    );
}
