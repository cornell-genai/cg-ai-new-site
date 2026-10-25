import { cn } from "@/lib/utils";

// A post's banner, set the same way everywhere: one aspect ratio and a
// hairline edge. Static (no hover zoom) so it never shifts layout or motion.
export default function Plate({ src, className, eager }: { src: string; className?: string; eager?: boolean }) {
    return (
        <div className={cn("relative overflow-hidden rounded-[6px] bg-night-2", className)}>
            <img
                src={src}
                alt=""
                width={1900}
                height={1000}
                loading={eager ? "eager" : "lazy"}
                className="aspect-[1.9/1] h-auto w-full object-cover"
            />
            <span aria-hidden className="pointer-events-none absolute inset-0 rounded-[6px] ring-1 ring-inset ring-white/10 light:ring-black/10" />
        </div>
    );
}
