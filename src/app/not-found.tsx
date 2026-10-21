import Link from "next/link";
import Mark from "@/components/Mark";

export default function NotFound() {
    return (
        <main className="flex min-h-svh flex-col items-center justify-center gap-8 px-6 text-center">
            <Mark className="size-10 text-ember" />
            <h1 className="text-[clamp(3rem,10vw,8rem)] font-medium leading-none tracking-[-0.05em]">
                404
            </h1>
            <p className="label text-ink-2">Page not found.</p>
            <Link href="/" className="rounded-full bg-ink px-5 py-2.5 text-[14px] font-medium text-paper transition-colors hover:bg-ember">
                Back home
            </Link>
        </main>
    );
}
