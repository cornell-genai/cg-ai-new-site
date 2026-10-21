import { cn } from "@/lib/utils";

// The one surface on the site: a soft white panel on the grey page.
export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
    return (
        <div
            className={cn(
                "overflow-hidden rounded-[20px] bg-card shadow-[0_1px_2px_rgba(20,22,40,0.04),0_24px_60px_-24px_rgba(30,36,90,0.22)] ring-1 ring-black/[0.035]",
                className,
            )}
        >
            {children}
        </div>
    );
}

export function CardHead({ title, chip }: { title: React.ReactNode; chip?: React.ReactNode }) {
    return (
        <div className="flex items-center justify-between gap-4 px-6 pb-3 pt-5">
            <span className="text-[19px] tracking-[-0.015em]">{title}</span>
            {chip && <Chip>{chip}</Chip>}
        </div>
    );
}

export function Chip({ children }: { children: React.ReactNode }) {
    return <span className="shrink-0 rounded-md bg-chip px-2.5 py-1.5 font-mono text-[11.5px] leading-none text-ink">{children}</span>;
}
