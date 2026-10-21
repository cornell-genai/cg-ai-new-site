import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Backdrop from "@/components/Backdrop";
import Halftone from "@/components/Halftone";
import Log from "@/components/Log";
import { Card, CardHead } from "@/components/Card";
import { RecruitingChip } from "@/components/Recruiting";
import { ACTIVE_BUILDS, MEMBERS, PROJECTS } from "@/lib/data";

function More({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <Link href={href} className="group mt-5 inline-flex items-center gap-1.5 text-[16px] text-ink-2 transition-colors hover:text-ink">
            {children}
            <span className="transition-transform duration-300 group-hover:translate-x-0.5">→</span>
        </Link>
    );
}

export default function Home() {
    return (
        <>
            <Backdrop />
            <Nav />

            <main className="relative z-10 mx-auto max-w-[1180px] px-4">
                <Card className="mx-auto mt-6 max-w-[560px] md:mt-10">
                    <CardHead title="Cornell GenAI" chip={<RecruitingChip />} />
                    <div className="h-[340px] md:h-[420px]">
                        <Halftone src="/brand/campus-src.jpg" alt="Cornell campus in the fall" pitch={4} focus={[0.74, 0.35]} fade="bottom" />
                    </div>
                    <div className="px-6 pb-6">
                        <h1 className="text-[clamp(1.9rem,4.4vw,2.4rem)] leading-[1.1] tracking-[-0.025em]">Generative AI at Cornell</h1>
                        <p className="mt-6 text-[clamp(1.2rem,2.4vw,1.35rem)] leading-[1.3] tracking-[-0.01em]">
                            A student-run team of engineers, product managers, and designers building AI products with industry partners and for Cornell.
                        </p>
                        <Log
                            className="mt-8"
                            lines={ACTIVE_BUILDS.map((b) => `{ ${b.name}, ${b.members.length} ${b.members.length === 1 ? "member" : "members"} }`)}
                            footer={`↳ ${ACTIVE_BUILDS.length} projects in progress`}
                        />
                    </div>
                </Card>

                <div className="mt-4 grid grid-cols-1 gap-4 md:mt-6 md:grid-cols-3">
                    <Card>
                        <CardHead title="Team" chip={`${MEMBERS.length}_members`} />
                        <div className="aspect-[400/220]">
                            <Halftone src="/brand/team-src.jpg" alt="Members of Cornell GenAI" pitch={3} fade="bottom" />
                        </div>
                        <div className="px-6 pb-6">
                            <p className="text-[17px] leading-[1.4]">Engineers, product managers, and designers, recruited each semester.</p>
                            <More href="/team">Meet the team</More>
                        </div>
                    </Card>

                    <Card>
                        <CardHead title="Projects" chip={`${PROJECTS.filter((p) => p.status === "Shipped").length}_shipped`} />
                        <div className="px-6 pb-6">
                            <p className="text-[17px] leading-[1.4]">Semester-long builds with Cisco, Charter, QuickFi, Vero, and Gradial, plus tools for Cornell.</p>
                            <Log className="mt-5" lines={PROJECTS.map((p) => `{ ${p.title}, ${p.partner} }`)} />
                            <More href="/projects">All projects</More>
                        </div>
                    </Card>

                    <Card>
                        <CardHead title="Get involved" chip={<RecruitingChip />} />
                        <div className="px-6 pb-6">
                            <p className="text-[17px] leading-[1.4]">
                                We recruit every semester. Applicants build an AI project over three weeks; there are engineering and design tracks.
                            </p>
                            <Log className="mt-5" lines={["{ Engineering track }", "{ Design & Marketing track }", "{ Coffee chats with members }"]} />
                            <More href="/get-involved">How to apply</More>
                        </div>
                    </Card>
                </div>
            </main>

            <Footer />
        </>
    );
}
