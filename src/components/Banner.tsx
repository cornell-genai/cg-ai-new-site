import AsciiHover from "./AsciiHover";

// Full-bleed photo banner, rendered as static markup: the photo and the title
// are there on first paint. The page title sits on its lower edge, clear of
// the device's safe areas. The photo's ASCII hover is the only motion.
export default function Banner({ src, alt, title }: { src: string; alt: string; title: string }) {
    return (
        <section className="relative h-[72svh] min-h-[440px] overflow-hidden">
            <AsciiHover src={src} alt={alt} className="absolute inset-0 h-full w-full" imgClassName="object-[60%_40%]" />
            <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-night via-night/20 to-night/40" />
            {/* Keeps the nav legible over the photo. */}
            <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-night/85 to-transparent" />
            <h1 className="absolute bottom-[max(1.5rem,env(safe-area-inset-bottom))] left-[max(1.25rem,env(safe-area-inset-left))] right-[max(1.25rem,env(safe-area-inset-right))] text-[clamp(3.5rem,10vw,9rem)] font-medium leading-[1.05] tracking-[-0.055em] text-fg md:bottom-[max(2.5rem,env(safe-area-inset-bottom))] md:left-[max(1.5rem,env(safe-area-inset-left))] md:right-[max(1.5rem,env(safe-area-inset-right))]">
                {title}
            </h1>
        </section>
    );
}
