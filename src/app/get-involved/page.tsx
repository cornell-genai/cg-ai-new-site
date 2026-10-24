import type { Metadata } from "next";
import SubPage from "@/components/SubPage";
import Banner from "@/components/Banner";
import Newsletter from "@/components/Newsletter";
import { CONTACT_EMAIL } from "@/lib/data";

export const metadata: Metadata = { title: "Get involved" };

const WAYS = [
    {
        title: "Sponsor us",
        body: "Sponsorship funds compute, events, and student projects. Sponsors get early access to recruiting, invitations to our events, and direct contact with student members.",
        cta: "Discuss sponsorship",
        subject: "Sponsorship",
    },
    {
        title: "Partner on a project",
        body: "Bring us a problem AI could help solve. Each semester, we partner with a few organizations, and a team of our engineers and researchers works with you to deliver a working system by the end of the term.",
        cta: "Propose a project",
        subject: "Project collaboration",
    },
];

export default function GetInvolvedPage() {
    return (
        <SubPage title="Get involved" banner={<Banner src="/brand/campus.webp" alt="Cornell campus in the fall" title="Get involved" />}>
            <section className="grid gap-8 md:grid-cols-2 md:gap-10">
                <div>
                    <h2 className="text-[clamp(1.6rem,2.6vw,2.2rem)] font-semibold tracking-[-0.035em] text-fg">Join the mailing list</h2>
                    <p className="mt-4 text-[17px] leading-relaxed text-bone/65">
                        Applications for fall 2026 are closed. Join the mailing list and we&apos;ll email you when applications open, along with new project write-ups. We send a few emails each semester.
                    </p>
                </div>
                <div className="md:pt-14"><Newsletter /></div>
            </section>

            <div className="mt-20 grid grid-cols-1 gap-12 border-t border-bone/12 pt-20 md:grid-cols-2 md:gap-10">
                {WAYS.map((w) => (
                    <section key={w.title}>
                        <h2 className="text-[clamp(1.6rem,2.6vw,2.2rem)] font-semibold tracking-[-0.035em] text-fg">{w.title}</h2>
                        <p className="mt-4 text-[17px] leading-relaxed text-bone/65">{w.body}</p>
                        <a
                            href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(w.subject)}`}
                            className="group mt-6 inline-flex items-center gap-2 border-b border-red pb-1 text-[16px] font-medium text-fg transition-colors hover:text-red"
                        >
                            {w.cta} <span className="transition-transform duration-300 group-hover:translate-x-0.5">→</span>
                        </a>
                    </section>
                ))}
            </div>

            <p className="mt-20 text-[15px] text-bone/45">
                Questions or ideas? <a href={`mailto:${CONTACT_EMAIL}`} className="text-bone/80 underline decoration-bone/25 underline-offset-4 hover:text-fg">{CONTACT_EMAIL}</a>
            </p>
        </SubPage>
    );
}
