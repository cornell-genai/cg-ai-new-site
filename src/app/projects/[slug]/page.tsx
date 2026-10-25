import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import Plate from "@/components/work/Plate";
import Blocks, { slugify } from "@/components/work/Blocks";
import { POSTS } from "@/lib/work";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
    return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
    const { slug } = await params;
    const post = POSTS.find((p) => p.slug === slug);
    return post ? { title: post.title, description: post.dek, openGraph: { images: [post.banner] } } : {};
}

const label = "font-mono text-[12px] uppercase tracking-[0.1em]";

export default async function PostPage({ params }: Params) {
    const { slug } = await params;
    const i = POSTS.findIndex((p) => p.slug === slug);
    if (i < 0) notFound();
    const post = POSTS[i];
    const next = [POSTS[(i + 1) % POSTS.length], POSTS[(i + 2) % POSTS.length]];
    const sections = post.body.flatMap((b) => (typeof b === "object" && "h" in b ? [b.h] : []));
    const facts = [
        { k: post.tag === "client" ? "Partner" : "Type", v: post.tag === "client" ? post.partner : post.tag },
        { k: "Timeline", v: post.when },
        ...(post.status ? [{ k: "Status", v: post.status }] : []),
    ];

    return (
        <>
            <main id="main-content" tabIndex={-1} className="safe-gutters [--gutter:1.25rem] mx-auto max-w-[80rem] pb-20 pt-32 md:[--gutter:2rem] md:pt-40">
                <article>
                    <header>
                        <nav aria-label="Breadcrumb" className={`${label} text-bone-2`}>
                            <ol className="flex items-center">
                                <li><Link href="/projects/" className="transition-colors hover:text-fg">Projects</Link></li>
                                <li aria-hidden="true" className="mx-2">/</li>
                                <li aria-current="page" className="text-bone/70">{post.partner}</li>
                            </ol>
                        </nav>
                        <h1 className="mt-8 max-w-[60rem] text-balance text-[clamp(2.5rem,5.6vw,4.75rem)] font-medium leading-[1] tracking-[-0.045em] text-fg">{post.title}</h1>
                        <p className="mt-7 max-w-[44rem] text-[clamp(1.1rem,1.5vw,1.3rem)] leading-[1.45] text-bone/65">{post.dek}</p>

                        <dl className={`mt-12 grid grid-cols-1 border-t border-bone/10 ${facts.length === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
                            {facts.map((f) => (
                                <div key={f.k} className="border-b border-bone/10 py-4 pr-4 sm:border-b-0">
                                    <dt className={`${label} text-bone-2`}>{f.k}</dt>
                                    <dd className="mt-1.5 text-[15px] text-fg first-letter:uppercase">{f.v}</dd>
                                </div>
                            ))}
                        </dl>
                    </header>

                    <Plate src={post.banner} eager className="mt-8 md:mt-10" />

                    <div className="mt-16 grid gap-12 md:mt-24 md:grid-cols-12 md:gap-10">
                        <aside className="md:col-span-3">
                            <div className="space-y-10">
                                {sections.length > 0 && (
                                    <nav aria-label="On this page">
                                        {/* Native <details>: a real disclosure widget, so the contents list is reachable on mobile too, not just hidden. */}
                                        <details open>
                                            <summary className={`${label} min-h-11 cursor-pointer py-3 text-bone-2`}>On this page</summary>
                                            <ul className="mt-4 space-y-2.5 text-[14px] leading-normal">
                                                {sections.map((h) => (
                                                    <li key={h}>
                                                        <a href={`#${slugify(h)}`} className="block text-bone-2 transition-colors hover:text-fg">
                                                            {h}
                                                        </a>
                                                    </li>
                                                ))}
                                            </ul>
                                        </details>
                                    </nav>
                                )}
                                <div>
                                    <p className={`${label} text-bone-2`}>Built by</p>
                                    <ul className="mt-4 space-y-1.5 text-[14px] text-bone/70">
                                        {post.team.map((t) => <li key={t}>{t}</li>)}
                                    </ul>
                                </div>
                                <div>
                                    <p className={`${label} text-bone-2`}>Stack</p>
                                    <ul className="mt-4 flex flex-wrap gap-1.5">
                                        {post.stack.map((s) => (
                                            <li key={s} className="rounded-[3px] border border-bone/12 px-2 py-1 font-mono text-[12px] text-bone/65">{s}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </aside>

                        <div className="min-w-0 md:col-span-9">
                            <Blocks blocks={post.body} accent={post.accent} />
                        </div>
                    </div>
                </article>

                <section className="mt-32">
                    <p className={`${label} text-bone-2`}>Keep reading</p>
                    <div className="mt-8 grid gap-x-10 gap-y-14 md:grid-cols-2">
                        {next.map((p) => (
                            <Link key={p.slug} href={`/projects/${p.slug}/`} className="group block">
                                <Plate src={p.banner} />
                                <p className={`${label} mt-5 text-bone-2`}>
                                    <span className="text-bone/75">{p.tag}</span> · {p.when}
                                </p>
                                <p className="mt-2 text-balance text-[22px] font-medium leading-tight tracking-[-0.02em] text-fg decoration-bone/30 decoration-1 underline-offset-[0.18em] group-hover:underline">{p.title}</p>
                            </Link>
                        ))}
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
