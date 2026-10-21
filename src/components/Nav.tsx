"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const LINKS = [
    { href: "/projects", label: "Projects" },
    { href: "/team", label: "Team" },
];

export default function Nav() {
    const path = usePathname().replace(/(.)\/$/, "$1");
    return (
        <header className="relative z-10 mx-auto flex h-16 max-w-[1180px] items-center justify-between px-5">
            <Link href="/" className="text-[19px] tracking-[-0.015em]">
                Cornell GenAI
            </Link>
            <nav className="flex items-center gap-5 text-[16px]">
                {LINKS.map((l) => (
                    <Link key={l.href} href={l.href} className={cn("hidden transition-colors hover:text-ink sm:inline", path === l.href ? "text-ink" : "text-ink-2")}>
                        {l.label}
                    </Link>
                ))}
                <Link href="/get-involved" className="rounded-lg bg-ink px-3 py-1.5 text-[15px] text-card transition-colors hover:bg-blue">
                    Get involved
                </Link>
            </nav>
        </header>
    );
}
