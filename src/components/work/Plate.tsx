import { cn } from "@/lib/utils";

// A post's banner, set the same way everywhere: one aspect ratio, a hairline
// edge and a slow zoom when its card is hovered.
export default function Plate({ src, className, eager }: { src: string; className?: string; eager?: boolean }) {
    return (
        <div className={cn("relative overflow-hidden rounded-[6px] bg-night-2", className)}>
            <img
                src={src}
                alt=""
                loading={eager ? "eager" : "lazy"}
                className="aspect-[1.9/1] w-full object-cover transition-transform duration-[1.4s] ease-out-expo group-hover:scale-[1.03]"
            />
            <span aria-hidden className="pointer-events-none absolute inset-0 rounded-[6px] ring-1 ring-inset ring-white/10" />
        </div>
    );
}
