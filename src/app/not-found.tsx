import Link from "next/link";

export default function NotFound() {
    return (
        <main className="flex min-h-svh flex-col items-center justify-center gap-5 px-6 text-center">
            <p className="text-[22px] tracking-[-0.01em]">Page not found.</p>
            <Link href="/" className="rounded-lg bg-ink px-3 py-1.5 text-[15px] text-card transition-colors hover:bg-blue">
                Home
            </Link>
        </main>
    );
}
