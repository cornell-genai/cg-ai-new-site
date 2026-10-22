import Glow from "./Glow";

export default function Footer() {
    return (
        <footer className="relative mt-24 h-[52svh] min-h-[320px] overflow-hidden md:mt-32">
            <Glow />
            <div className="pointer-events-none absolute bottom-5 right-5 z-10 md:right-6">
                {/* A soft dark halo keeps the line legible over the bright dots. */}
                <span className="relative block px-1 text-[13px] font-medium text-bone">
                    <span aria-hidden className="absolute -inset-x-10 -inset-y-6 -z-10 rounded-full bg-night/90 blur-xl" />
                    © {new Date().getFullYear()} Generative AI at Cornell · Ithaca, NY
                </span>
            </div>
        </footer>
    );
}
