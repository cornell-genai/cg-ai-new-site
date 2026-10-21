import Link from "next/link";
import { Lockup } from "./Mark";
import { CONTACT_EMAIL, GITHUB_URL } from "@/lib/data";
import { cn } from "@/lib/utils";

export default function Footer({ tone = "dark" }: { tone?: "dark" | "light" }) {
    const dark = tone === "dark";
    return (
        <footer className={cn(dark ? "bg-night text-bone" : "bg-paper text-ink")}>
            <div className={cn("flex flex-col gap-8 border-t px-5 py-8 md:flex-row md:items-center md:justify-between", dark ? "border-bone/10" : "border-ink/10")}>
                <Lockup />
                <div className={cn("flex flex-wrap gap-x-6 gap-y-2 text-[14px]", dark ? "text-bone/55" : "text-ink-2")}>
                    <Link href="/projects" className="hover:text-current">Projects</Link>
                    <Link href="/team" className="hover:text-current">Team</Link>
                    <Link href="/get-involved" className="hover:text-current">Get Involved</Link>
                    <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-current">{CONTACT_EMAIL}</a>
                    <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="hover:text-current">GitHub</a>
                    <span>© {new Date().getFullYear()}</span>
                </div>
            </div>
        </footer>
    );
}
