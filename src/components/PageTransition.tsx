"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

// Quiet page changes: the current page eases out, the route changes, and the
// new page eases up into place. The nav sits outside #page and never moves.
//
// Internal <a> clicks are caught in the capture phase (ahead of <Link>'s own
// handler), so plain <Link>s get the transition with no wrapper. Back/forward
// navigation is left instant.

const OUT = { duration: 260, easing: "cubic-bezier(0.4, 0, 1, 1)" };
const IN = { duration: 700, easing: "cubic-bezier(0.16, 1, 0.3, 1)" };

export default function PageTransition({ children }: { children: React.ReactNode }) {
    const ref = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const pathname = usePathname();
    const pending = useRef<string | null>(null);
    const busy = useRef(false);

    useEffect(() => {
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const onClick = (e: MouseEvent) => {
            if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || busy.current || reduced) return;
            const a = (e.target as Element).closest?.("a");
            if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
            const url = new URL(a.href, location.href);
            if (url.origin !== location.origin) return;
            const there = url.pathname.replace(/\/$/, "") || "/";
            if ((location.pathname.replace(/\/$/, "") || "/") === there) return;
            e.preventDefault();
            e.stopPropagation(); // keep <Link> from navigating before the page has eased out
            busy.current = true;
            pending.current = there;
            router.prefetch(url.pathname);
            const el = ref.current;
            const go = () => router.push(url.pathname + url.search + url.hash);
            if (!el) return go();
            el.animate([{ opacity: 1, transform: "none" }, { opacity: 0, transform: "translateY(-6px)" }], { ...OUT, fill: "forwards" }).finished.then(go, go);
        };
        document.addEventListener("click", onClick, true);
        return () => document.removeEventListener("click", onClick, true);
    }, [router]);

    useEffect(() => {
        const here = pathname.replace(/\/$/, "") || "/";
        const el = ref.current;
        if (pending.current !== here || !el) return;
        pending.current = null;
        window.scrollTo(0, 0);
        el.getAnimations().forEach((a) => a.cancel());
        el.animate([{ opacity: 0, transform: "translateY(10px)" }, { opacity: 1, transform: "none" }], IN).finished.finally(() => {
            busy.current = false;
        });
    }, [pathname]);

    return (
        <div id="page" ref={ref} className="page-enter">
            {children}
        </div>
    );
}
