import Link from "next/link";
import Mark from "@/components/Mark";

export default function NotFound() {
    return (
        <main className="flex min-h-svh flex-col items-center justify-center gap-6 bg-night px-6 text-center text-bone">
            <Mark className="size-10" />
            <p className="text-[18px]">This page doesn&apos;t exist.</p>
            <Link href="/" className="border border-bone/25 px-4 py-2 text-[14px] transition-colors hover:bg-bone hover:text-night">
                Home
            </Link>
        </main>
    );
}
