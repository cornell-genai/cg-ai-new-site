import { cn } from "@/lib/utils";

export default function Label({ index, children, className }: { index?: string; children: React.ReactNode; className?: string }) {
    return (
        <div className={cn("label flex items-center gap-3 self-start text-ink-2", className)}>
            {index && <span className="text-ink-3">({index})</span>}
            <span>{children}</span>
        </div>
    );
}
