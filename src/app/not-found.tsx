import Link from "next/link";
import Mark from "@/components/Mark";

export default function NotFound() {
    return (
        <main className="flex min-h-svh flex-col items-center justify-center gap-6 bg-paper px-6 text-center text-ink">
            <Mark className="size-10" />
            <p className="text-[18px]">Page not found.</p>
            <Link href="/" className="border border-ink/25 px-4 py-2 text-[14px] transition-colors hover:bg-ink hover:text-paper">
                Home
            </Link>
        </main>
    );
}
