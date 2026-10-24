import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import Cover from "@/components/work/Cover";
import Blocks from "@/components/work/Blocks";
import { POSTS, readMinutes } from "@/lib/work";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
    return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
    const { slug } = await params;
    const post = POSTS.find((p) => p.slug === slug);
    return post ? { title: post.title, description: post.dek } : {};
}

export default async function PostPage({ params }: Params) {
    const { slug } = await params;
    const i = POSTS.findIndex((p) => p.slug === slug);
    if (i < 0) notFound();
    const post = POSTS[i];
    const next = [POSTS[(i + 1) % POSTS.length], POSTS[(i + 2) % POSTS.length]];

    return (
        <div data-theme-scope="light">
            <main className="px-5 pb-20 pt-32 md:px-8 md:pt-40">
                <article>
                    <header className="mx-auto max-w-[52rem]">
                        <Link href="/projects/" className="text-[15px] text-bone/50 transition-colors hover:text-fg">
                            ← Projects
                        </Link>
                        <h1 className="mt-8 text-[clamp(2.4rem,5.4vw,4.4rem)] font-medium leading-[1.02] tracking-[-0.045em] text-fg">{post.title}</h1>
                        <p className="mt-6 text-[15px] text-bone/50">
                            {post.when} · {readMinutes(post)} min read · {post.partner === "Research" ? "Research" : `With ${post.partner}`}
                        </p>
                        <p className="mt-6 max-w-[40rem] text-[clamp(1.15rem,1.6vw,1.35rem)] leading-snug tracking-[-0.01em] text-bone/75">{post.dek}</p>
                    </header>

                    <Cover motif={post.motif} palette={post.palette} logos={post.logos} className="mx-auto mt-12 max-w-[52rem] md:mt-16" />

                    <div className="mt-16 md:mt-20">
                        <Blocks blocks={post.body} accent={post.palette.accent} />
                    </div>

                    {post.team.length > 0 && (
                        <footer className="mx-auto mt-20 max-w-[40rem] border-t border-bone/12 pt-6 text-[15px] leading-relaxed">
                            <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-bone/45">Built by</p>
                            <p className="mt-2 text-bone/75">{post.team.join(", ")}</p>
                        </footer>
                    )}
                </article>

                <section className="mx-auto mt-32 max-w-[52rem]">
                    <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-bone/45">Keep reading</p>
                    <div className="mt-6 grid gap-12 sm:grid-cols-2">
                        {next.map((p) => (
                            <Link key={p.slug} href={`/projects/${p.slug}/`} className="group block">
                                <Cover motif={p.motif} palette={p.palette} logos={p.logos} className="transition-transform duration-700 ease-out-expo group-hover:-translate-y-1" />
                                <p className="mt-4 text-[20px] font-medium leading-tight tracking-[-0.02em] text-fg group-hover:underline">{p.title}</p>
                                <p className="mt-2 text-[14px] text-bone/45">{p.when} · {readMinutes(p)} min read</p>
                            </Link>
                        ))}
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
