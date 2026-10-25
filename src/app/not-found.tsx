import type { Metadata } from "next";
import Link from "next/link";
import Mark from "@/components/Mark";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
    return (
        <main id="main-content" tabIndex={-1} className="flex min-h-svh flex-col items-center justify-center gap-6 bg-night px-6 text-center text-bone">
            <Mark className="size-10" />
            <h1 className="text-[18px] font-medium">This page doesn&apos;t exist.</h1>
            <Link href="/" className="pressable inline-flex min-h-11 items-center rounded-md border border-bone/25 px-4 py-2 text-[14px] hover:bg-bone hover:text-night">
                Home
            </Link>
        </main>
    );
}
