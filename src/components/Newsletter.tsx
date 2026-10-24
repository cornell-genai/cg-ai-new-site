"use client";

import { useState } from "react";
import { CONTACT_EMAIL, NEWSLETTER_URL } from "@/lib/data";

// An opaque no-cors response cannot confirm a subscription. Without an
// endpoint, ask the visitor to send a signup request through their email app.
export default function Newsletter() {
    const [state, setState] = useState<"idle" | "sending" | "sent" | "draft" | "error">("idle");

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        if (!NEWSLETTER_URL) {
            const body = `Please add ${data.get("email")} to the Cornell GenAI mailing list.`;
            location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Mailing list")}&body=${encodeURIComponent(body)}`;
            setState("draft");
            return;
        }
        setState("sending");
        fetch(NEWSLETTER_URL, { method: "POST", mode: "no-cors", body: data })
            .then(() => setState("sent"))
            .catch(() => setState("error"));
    };

    return (
        <div className="max-w-md">
            <form onSubmit={submit}>
                <label htmlFor="newsletter-email" className="text-[14px] text-bone/65">Email address</label>
                <div className="flex border-b border-bone/30 focus-within:border-red">
                    <input
                        id="newsletter-email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        placeholder="you@cornell.edu"
                        aria-describedby={!NEWSLETTER_URL ? "newsletter-hint" : undefined}
                        className="min-w-0 flex-1 bg-transparent py-3 text-[17px] text-fg outline-none placeholder:text-bone/35"
                    />
                    <button type="submit" disabled={state === "sending"} className="shrink-0 py-3 pl-4 text-[16px] font-medium text-fg transition-colors hover:text-red disabled:opacity-50">
                        {state === "sending" ? "Sending…" : NEWSLETTER_URL ? "Subscribe" : "Email to join"} <span aria-hidden>→</span>
                    </button>
                </div>
            </form>
            {!NEWSLETTER_URL && <p id="newsletter-hint" className="mt-3 text-[14px] leading-relaxed text-bone/55">Opens an email draft for you to send.</p>}
            <div role="status" className="text-[14px] leading-relaxed text-bone/65">
                {state === "draft" && <p className="mt-3">Send the email to join the mailing list. If it didn&apos;t open, email <a href={`mailto:${CONTACT_EMAIL}`} className="underline underline-offset-4">{CONTACT_EMAIL}</a>.</p>}
                {state === "sent" && <p className="mt-3">Signup request sent. We can&apos;t confirm your subscription here.</p>}
            </div>
            {state === "error" && <p role="alert" className="mt-3 text-[14px] leading-relaxed text-fg">Unable to send your signup request. Try again or email <a href={`mailto:${CONTACT_EMAIL}`} className="underline underline-offset-4">{CONTACT_EMAIL}</a>.</p>}
        </div>
    );
}
