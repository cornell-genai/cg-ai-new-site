import Link from "next/link";
import { CONTACT_EMAIL, GITHUB_URL } from "@/lib/data";

export default function Footer() {
    return (
        <footer className="relative z-10 mx-auto flex max-w-[1180px] flex-col gap-3 px-5 pb-10 pt-24 text-[15px] text-ink-2 md:flex-row md:items-center md:justify-between">
            <span>© {new Date().getFullYear()} Generative AI at Cornell</span>
            <div className="flex flex-wrap gap-x-5 gap-y-1">
                <Link href="/projects" className="hover:text-ink">Projects</Link>
                <Link href="/team" className="hover:text-ink">Team</Link>
                <Link href="/get-involved" className="hover:text-ink">Get involved</Link>
                <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-ink">{CONTACT_EMAIL}</a>
                <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="hover:text-ink">GitHub</a>
            </div>
        </footer>
    );
}
