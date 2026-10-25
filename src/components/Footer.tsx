import Link from "next/link";
import Glow from "./Glow";
import { CONTACT_EMAIL, GITHUB_URL } from "@/lib/data";

export default function Footer() {
    return (
        <footer className="mt-24 md:mt-32">
            <div className="safe-gutters flex flex-col gap-4 pb-10 text-[15px] [--gutter:1.75rem] md:flex-row md:items-center md:justify-between md:[--gutter:8vw]">
                <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-1 text-bone-2 [&>a]:inline-flex [&>a]:min-h-11 [&>a]:items-center">
                    <Link href="/projects" className="hover:text-fg">Projects</Link>
                    <Link href="/team" className="hover:text-fg">Team</Link>
                    <Link href="/get-involved" className="hover:text-fg">Get involved</Link>
                    <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-fg">{CONTACT_EMAIL}</a>
                    <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="hover:text-fg">GitHub</a>
                </nav>
                <span className="text-bone-2">© {new Date().getFullYear()} Generative AI at Cornell · Ithaca, NY</span>
            </div>
            <div className="relative h-[46svh] min-h-[300px] overflow-hidden">
                <Glow />
            </div>
        </footer>
    );
}
