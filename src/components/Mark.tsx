import { cn } from "@/lib/utils";

// The brand mark: the club logo (red "C" around a split brain), never
// recoloured, filling the height of its box. `public/brand/logo.svg` is the
// single source; `src/app/icon.svg` and the home page's Life board are built from it.
export const LOGO_SRC = "/brand/logo.svg";
export const LOGO_RED = "#BC3127";

export default function Mark({ className }: { className?: string }) {
    return (
        <span aria-hidden className={cn("relative block shrink-0", className)}>
            <img src={LOGO_SRC} alt="" width="596" height="698" className="absolute inset-0 m-auto h-full w-auto" />
        </span>
    );
}

export function Lockup({ className, markClassName }: { className?: string; markClassName?: string }) {
    return (
        <span className={cn("flex items-center gap-2.5", className)}>
            <Mark className={cn("size-9", markClassName)} />
            <span className="whitespace-nowrap text-[18px] font-semibold sm:text-[20px] tracking-[-0.03em]">Cornell Generative AI</span>
        </span>
    );
}
