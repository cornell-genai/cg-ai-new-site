import type { Metadata } from "next";
import SubPage from "@/components/SubPage";
import Banner from "@/components/Banner";
import { CONTACT_EMAIL } from "@/lib/data";

export const metadata: Metadata = { title: "Get involved" };

const WAYS = [
    {
        title: "Sponsor us",
        body: "Sponsorship funds compute, events, and the projects our members take on. Sponsors get early access to our recruiting pipeline, a seat at our events, and a direct line to students building with AI every day.",
        cta: "Become a sponsor",
        subject: "Sponsorship",
    },
    {
        title: "Bring us a project",
        body: "Have a problem AI should be able to solve? We take on a small number of partner projects each semester. A team of engineers and researchers works with you for the semester and ships a working system, not a slide deck.",
        cta: "Propose a project",
        subject: "Project collaboration",
    },
];

export default function GetInvolvedPage() {
    return (
        <SubPage title="Get involved" banner={<Banner src="/brand/campus.webp" alt="Cornell campus in the fall" title="Get involved" />}>
            <div className="border-l-2 border-red pl-5">
                <p className="text-[clamp(1.4rem,2.4vw,2rem)] font-semibold leading-snug tracking-[-0.03em] text-white">
                    Recruiting for the F26 cycle is closed.
                </p>
                <p className="mt-2 text-[17px] text-bone/60">Applications open again next semester. Check back then.</p>
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
                Anything else: <a href={`mailto:${CONTACT_EMAIL}`} className="text-bone/80 underline decoration-bone/25 underline-offset-4 hover:text-white">{CONTACT_EMAIL}</a>
            </p>
        </SubPage>
    );
}
