"use client";

import { useState } from "react";
import { CONTACT_EMAIL, NEWSLETTER_URL } from "@/lib/data";

// Mailing-list signup. Posts to NEWSLETTER_URL (no-cors, so we can't read the
// reply and assume it landed); without one it falls back to a mailto.
export default function Newsletter() {
    const [state, setState] = useState<"idle" | "sending" | "done">("idle");

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        if (!NEWSLETTER_URL) {
            const body = `Please add ${data.get("email")} to the Cornell GenAI mailing list.`;
            location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Mailing list")}&body=${encodeURIComponent(body)}`;
            setState("done");
            return;
        }
        setState("sending");
        fetch(NEWSLETTER_URL, { method: "POST", mode: "no-cors", body: data }).finally(() => setState("done"));
    };

    if (state === "done") return <p className="text-[17px] text-fg">You&apos;re on the list. Talk soon.</p>;

    return (
        <form onSubmit={submit} className="flex max-w-md border-b border-bone/30 focus-within:border-red">
            <label htmlFor="newsletter-email" className="sr-only">Email</label>
            <input
                id="newsletter-email"
                name="email"
                type="email"
                required
                placeholder="you@cornell.edu"
                className="min-w-0 flex-1 bg-transparent py-3 text-[17px] text-fg outline-none placeholder:text-bone/35"
            />
            <button type="submit" disabled={state === "sending"} className="shrink-0 py-3 pl-4 text-[16px] font-medium text-fg transition-colors hover:text-red disabled:opacity-50">
                Subscribe →
            </button>
        </form>
    );
}
