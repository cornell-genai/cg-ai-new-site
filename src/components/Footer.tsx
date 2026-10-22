import Link from "next/link";
import Glow from "./Glow";
import { Lockup } from "./Mark";
import { CONTACT_EMAIL, GITHUB_URL } from "@/lib/data";

export default function Footer() {
    return (
        <footer className="relative overflow-hidden">
            <div className="relative z-10 grid grid-cols-1 gap-10 px-5 pt-24 md:grid-cols-12 md:px-6 md:pt-32">
                <div className="md:col-span-6">
                    <p className="max-w-md text-[clamp(1.6rem,2.8vw,2.4rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-white">
                        Building something with AI? We&apos;d like to hear about it.
                    </p>
                    <div className="mt-6 flex flex-wrap gap-2">
                        <Link href="/get-involved" className="bg-bone px-4 py-2 text-[15px] font-medium text-night transition-colors hover:bg-white">
                            Join us
                        </Link>
                        <a href={`mailto:${CONTACT_EMAIL}?subject=Partnership`} className="border border-bone/25 px-4 py-2 text-[15px] transition-colors hover:border-bone">
                            Partner with us
                        </a>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-6 text-[15px] md:col-span-4 md:col-start-9">
                    <ul className="space-y-2 text-bone/60">
                        <li><Link href="/projects" className="hover:text-bone">Projects</Link></li>
                        <li><Link href="/team" className="hover:text-bone">Team</Link></li>
                        <li><Link href="/get-involved" className="hover:text-bone">Get involved</Link></li>
                    </ul>
                    <ul className="space-y-2 text-bone/60">
                        <li><a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-bone">Email</a></li>
                        <li><a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="hover:text-bone">GitHub</a></li>
                    </ul>
                </div>
            </div>

            <div className="relative mt-16 h-[46svh] min-h-[300px]">
                <Glow />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex items-end justify-between px-5 pb-5 text-[13px] font-medium text-night md:px-6">
                    <span className="pointer-events-auto"><Lockup /></span>
                    <span>© {new Date().getFullYear()} Generative AI at Cornell · Ithaca, NY</span>
                </div>
            </div>
        </footer>
    );
}
