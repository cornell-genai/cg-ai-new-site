import Link from "next/link";
import { Lockup } from "./Mark";
import { CONTACT_EMAIL, GITHUB_URL } from "@/lib/data";

export default function Footer() {
    return (
        <footer className="border-t border-bone/10">
            <div className="flex flex-col gap-8 px-5 py-8 md:flex-row md:items-center md:justify-between md:px-6">
                <Lockup />
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-[14px] text-bone/50">
                    <Link href="/projects" className="hover:text-bone">Projects</Link>
                    <Link href="/team" className="hover:text-bone">Team</Link>
                    <Link href="/get-involved" className="hover:text-bone">Get involved</Link>
                    <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-bone">{CONTACT_EMAIL}</a>
                    <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="hover:text-bone">GitHub</a>
                    <span>© {new Date().getFullYear()}</span>
                </div>
            </div>
        </footer>
    );
}
