import type { Metadata } from "next";
import SubPage from "@/components/SubPage";
import Banner from "@/components/Banner";
import Newsletter from "@/components/Newsletter";
import { CONTACT_EMAIL } from "@/lib/data";

export const metadata: Metadata = { title: "Get involved" };

// For prospective members, carried over from the old site's Apply page. Dates,
// apply links and coffee chats only matter while recruiting is open, so they
// live in the mailing-list copy above instead.
const ROLES = [
    {
        title: "Developer",
        body: "Build AI systems with our industry partners and for students at Cornell. Developers work in small teams on one client project each semester.",
        lookingFor: ["Technical depth in software or ML", "A record of shipping projects", "A problem-solving mindset"],
    },
    {
        title: "Business and operations",
        body: "A broad role. Depending on your strengths, you might work on outreach and partnerships, operations and events, marketing, recruiting, or sponsorship and finance.",
        lookingFor: ["Organization and follow-through", "Outreach and partnership building", "Product and sales instincts"],
    },
];

const WAYS = [
    {
        title: "Sponsor us",
        body: "Sponsorship funds compute, events, and student projects. Sponsors get early access to recruiting, invitations to our events, and direct contact with student members.",
        cta: "Discuss sponsorship",
        subject: "Sponsorship",
    },
    {
        title: "Partner on a project",
        body: "Bring us a problem AI could help solve. Each semester, we partner with a few organizations. A team of our engineers and researchers, each selected through a technical interview, works with you to deliver a working system by the end of the term.",
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

            <div className="mt-20 grid grid-cols-1 gap-12 border-t border-bone/12 pt-20 md:grid-cols-2 md:gap-x-10 md:gap-y-0">
                {WAYS.map((w) => (
                    <section key={w.title} className="md:row-span-3 md:grid md:grid-rows-subgrid">
                        <h2 className="text-[clamp(1.6rem,2.6vw,2.2rem)] font-semibold tracking-[-0.035em] text-fg">{w.title}</h2>
                        <p className="mt-4 text-[17px] leading-relaxed text-bone/65">{w.body}</p>
                        <a
                            href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(w.subject)}`}
                            className="group mt-6 inline-flex min-h-11 items-center gap-2 self-start justify-self-start text-[16px] font-medium text-fg transition-colors hover:text-red"
                        >
                            <span className="underline decoration-red underline-offset-[0.3em]">{w.cta}</span><span aria-hidden>→</span>
                        </a>
                    </section>
                ))}
            </div>

            <section className="mt-20 border-t border-bone/12 pt-20">
                <h2 className="text-[clamp(1.6rem,2.6vw,2.2rem)] font-semibold tracking-[-0.035em] text-fg">Join as a member</h2>
                <p className="mt-4 max-w-2xl text-[17px] leading-relaxed text-bone/65">
                    We recruit at the start of each semester for two roles.
                </p>
                <div className="mt-10 grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-x-10 md:gap-y-0">
                    {ROLES.map((r) => (
                        <div key={r.title} className="md:row-span-4 md:grid md:grid-rows-subgrid">
                            <h3 className="text-[20px] font-semibold tracking-[-0.02em] text-fg">{r.title}</h3>
                            <p className="mt-3 text-[16px] leading-relaxed text-bone/65">{r.body}</p>
                            <p className="mt-6 font-mono text-[12px] uppercase tracking-[0.1em] text-bone-2">What we look for</p>
                            <ul className="mt-3 space-y-2 text-[15px] text-bone/75">
                                {r.lookingFor.map((item) => (
                                    <li key={item} className="flex items-center gap-3">
                                        <span aria-hidden className="size-1.5 shrink-0 bg-red" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </section>

        </SubPage>
    );
}
