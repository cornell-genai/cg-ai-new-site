import type { Metadata } from "next";
import SubPage from "@/components/SubPage";
import Banner from "@/components/Banner";
import { CONTACT_EMAIL } from "@/lib/data";

export const metadata: Metadata = { title: "Get involved" };

const WAYS = [
    {
        title: "Sponsor us!",
        body: "We'd be so grateful for your support. Sponsorship goes straight into compute, events, and the projects our members dream up. As a sponsor, you'd get early access to our recruiting, a seat at our events, and a direct line to a bunch of students who love building with AI.",
        cta: "Let's talk sponsorship",
        subject: "Sponsorship",
    },
    {
        title: "Let's build something together!",
        body: "Got a problem you think AI could crack? We'd love to hear about it. Each semester we team up with a few partners, and a group of our engineers and researchers works alongside you to ship something real by the end of the term.",
        cta: "Tell us about your idea",
        subject: "Project collaboration",
    },
];

export default function GetInvolvedPage() {
    return (
        <SubPage title="Get involved" banner={<Banner src="/brand/campus.webp" alt="Cornell campus in the fall" title="Get involved" />}>
            <div className="border-l-2 border-red pl-5">
                <p className="text-[clamp(1.4rem,2.4vw,2rem)] font-semibold leading-snug tracking-[-0.03em] text-white">
                    Thanks for your interest! Recruiting for F26 has wrapped up.
                </p>
                <p className="mt-2 text-[17px] text-bone/60">We open applications again next semester and would love to see you then.</p>
            </div>

            <div className="mt-20 grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-10">
                {WAYS.map((w) => (
                    <section key={w.title}>
                        <h2 className="text-[clamp(1.6rem,2.6vw,2.2rem)] font-semibold tracking-[-0.035em] text-white">{w.title}</h2>
                        <p className="mt-4 text-[17px] leading-relaxed text-bone/65">{w.body}</p>
                        <a
                            href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(w.subject)}`}
                            className="group mt-6 inline-flex items-center gap-2 border-b border-red pb-1 text-[16px] font-medium text-white transition-colors hover:text-red"
                        >
                            {w.cta} <span className="transition-transform duration-300 group-hover:translate-x-0.5">→</span>
                        </a>
                    </section>
                ))}
            </div>

            <p className="mt-20 text-[15px] text-bone/45">
                Questions, ideas, or just want to say hi? <a href={`mailto:${CONTACT_EMAIL}`} className="text-bone/80 underline decoration-bone/25 underline-offset-4 hover:text-white">{CONTACT_EMAIL}</a>
            </p>
        </SubPage>
    );
}
