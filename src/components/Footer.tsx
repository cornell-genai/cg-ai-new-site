import Link from "next/link";
import Mark from "./Mark";
import { CONTACT_EMAIL, GITHUB_URL } from "@/lib/data";

export default function Footer() {
    return (
        <footer className="relative overflow-hidden bg-ink text-paper">
            <div className="mx-auto grid grid-cols-2 gap-10 px-4 pb-10 pt-20 md:grid-cols-12 md:px-6">
                <div className="col-span-2 md:col-span-5">
                    <p className="max-w-sm text-[22px] leading-[1.15] tracking-[-0.02em]">Generative AI at Cornell</p>
                    <p className="mt-2 text-[15px] text-paper/50">Student-run. Ithaca, NY.</p>
                </div>
                <div className="md:col-span-2 md:col-start-8">
                    <div className="label mb-4 text-paper/40">Index</div>
                    <ul className="space-y-1.5 text-[15px]">
                        {[["/", "Home"], ["/work", "Work"], ["/team", "Team"], ["/apply", "Apply"]].map(([href, label]) => (
                            <li key={href}>
                                <Link href={href} className="text-paper/70 transition-colors hover:text-paper">{label}</Link>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="md:col-span-3">
                    <div className="label mb-4 text-paper/40">Contact</div>
                    <ul className="space-y-1.5 text-[15px]">
                        <li><a href={`mailto:${CONTACT_EMAIL}`} className="text-paper/70 transition-colors hover:text-paper">{CONTACT_EMAIL}</a></li>
                        <li><a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="text-paper/70 transition-colors hover:text-paper">GitHub ↗</a></li>
                    </ul>
                </div>
            </div>

            <div className="relative px-4 md:px-6">
                <div className="flex items-end gap-[2vw] border-t border-paper/15 pt-6">
                    <Mark className="mb-[1.6vw] size-[11vw] shrink-0 text-ember" />
                    <span className="display whitespace-nowrap text-[17.5vw] leading-[0.78] tracking-[-0.06em]">GenAI</span>
                </div>
            </div>

            <div className="label flex flex-wrap justify-between gap-2 px-4 py-5 text-paper/40 md:px-6">
                <span>© {new Date().getFullYear()} Generative AI at Cornell</span>
            </div>
        </footer>
    );
}
