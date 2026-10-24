import type { SketchName } from "@/lib/work";
import { cn } from "@/lib/utils";

// Illustrations of what each tool looks like in use. They are drawn, not
// screenshots, and every one is labelled as such in its caption.

type P = { accent: string };

function Frame({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) {
    return (
        <div className={cn("overflow-hidden rounded-[6px] border border-bone/12 bg-night text-[14px] shadow-[0_1px_0_rgba(0,0,0,0.04),0_12px_40px_-24px_rgba(0,0,0,0.25)]", className)}>
            <div className="flex items-center justify-between border-b border-bone/10 bg-night-2 px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.08em] text-bone/50">
                <span>{title}</span>
                <span>Illustration</span>
            </div>
            {children}
        </div>
    );
}

const Mark = ({ ok, accent }: { ok: boolean | "warn"; accent: string }) => (
    <span
        className="inline-flex size-5 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold text-white"
        style={{ background: ok === true ? accent : ok === "warn" ? "#d9a21b" : "#d01f17" }}
        aria-label={ok === true ? "pass" : ok === "warn" ? "review" : "fail"}
    >
        {ok === true ? "✓" : ok === "warn" ? "!" : "×"}
    </span>
);

function BridgeReview({ accent }: P) {
    const rows = [
        { f: "Total assets", v: "$4,812,330", c: 98, s: "“Total Assets  4,812,330”", d: "2025 YTD Balance Sheet.xlsx" },
        { f: "Total liabilities", v: "$2,904,115", c: 95, s: "rebuilt from 6 line items; balances to $0", d: "2025 YTD Balance Sheet.xlsx" },
        { f: "Revenue, year to date", v: "$1,276,940", c: 91, s: "Jan–Sep monthly columns, summed", d: "2025 P&L.pdf" },
        { f: "Year founded", v: "2011", c: 88, s: "formation date on file", d: "State business registry" },
        { f: "Employees", v: "42", c: 61, s: "headcount estimate", d: "People Data Labs" },
    ];
    return (
        <Frame title="Review your details · Financials">
            <div className="divide-y divide-bone/10">
                {rows.map((r) => {
                    const low = r.c < 75;
                    return (
                        <div key={r.f} className={cn("grid grid-cols-[1fr_auto] gap-x-4 gap-y-1.5 px-4 py-3.5 md:grid-cols-[10rem_8rem_1fr_auto] md:items-center", low && "bg-[#d9a21b]/[0.07]")}>
                            <span className="text-bone/60">{r.f}</span>
                            <span className="order-first col-span-2 font-mono text-[15px] font-semibold text-fg md:order-none md:col-span-1">{r.v}</span>
                            <span className="col-span-2 min-w-0 md:col-span-1">
                                <span className="flex items-center gap-2">
                                    <span className="h-1 w-16 shrink-0 overflow-hidden rounded-full bg-bone/10">
                                        <span className="block h-full" style={{ width: `${r.c}%`, background: low ? "#d9a21b" : accent }} />
                                    </span>
                                    <span className="font-mono text-[12px] text-bone/50">{r.c}%</span>
                                </span>
                                <span className="mt-1 block truncate text-[12.5px] text-bone/50">
                                    {r.s} · <span className="underline decoration-bone/25 underline-offset-2">{r.d}</span>
                                </span>
                            </span>
                            <span className="row-start-1 flex gap-1.5 md:row-start-auto">
                                {["✓", "✎", "×"].map((g, i) => (
                                    <span
                                        key={g}
                                        className="flex size-7 items-center justify-center rounded-[4px] border border-bone/12 text-[13px] text-bone/60"
                                        style={i === 0 && !low ? { background: accent, borderColor: accent, color: "#fff" } : undefined}
                                    >
                                        {g}
                                    </span>
                                ))}
                            </span>
                        </div>
                    );
                })}
            </div>
            <div className="flex items-center justify-between border-t border-bone/10 px-4 py-3 text-[12.5px] text-bone/50">
                <span>Balance sheet check: assets = liabilities + equity ✓</span>
                <span>1 field needs a look</span>
            </div>
        </Frame>
    );
}

function InvestcorpDigest({ accent }: P) {
    const tiers = [
        {
            t: "High",
            c: accent,
            items: [
                {
                    co: "Company A · packaging",
                    e: "Two outlets report the company is preparing a Chapter 11 filing.",
                    x: "Seen before: two medium-tier events in March (supplier dispute, CFO exit). Suggested next step: review the position and the covenant package this week.",
                },
            ],
        },
        {
            t: "Medium",
            c: "#5b7bb0",
            items: [
                { co: "Company F · specialty chemicals", e: "State regulator opens an inquiry into a discharge permit." },
                { co: "Company K · logistics", e: "Union vote scheduled at the two largest depots." },
            ],
        },
        { t: "Low", c: "#a9b8cf", items: [{ co: "14 events logged", e: "Industry commentary and routine disclosures. No action." }] },
    ];
    return (
        <Frame title="CLO news monitor · Week of 13 April">
            <div className="divide-y divide-bone/10">
                {tiers.map((tier) => (
                    <div key={tier.t} className="grid gap-3 px-4 py-4 md:grid-cols-[6rem_1fr]">
                        <span className="flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.08em]" style={{ color: tier.c }}>
                            <span className="size-2" style={{ background: tier.c }} />
                            {tier.t}
                        </span>
                        <div className="space-y-3">
                            {tier.items.map((it) => (
                                <div key={it.co}>
                                    <p className="font-semibold text-fg">{it.co}</p>
                                    <p className="text-bone/70">{it.e}</p>
                                    {"x" in it && it.x && <p className="mt-1.5 border-l-2 pl-3 text-[13px] text-bone/55" style={{ borderColor: tier.c }}>{it.x}</p>}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </Frame>
    );
}

function Bubble({ me, children, accent }: { me?: boolean; children: React.ReactNode; accent: string }) {
    return (
        <div className={cn("flex", me && "justify-end")}>
            <div
                className={cn("max-w-[85%] rounded-[14px] px-3.5 py-2.5 leading-snug", me ? "rounded-br-[4px] text-white" : "rounded-bl-[4px] bg-night-2 text-bone")}
                style={me ? { background: accent } : undefined}
            >
                {children}
            </div>
        </div>
    );
}

function TreasuryChat({ accent }: P) {
    const banks = [
        { b: "Bank 4", h: 31 },
        { b: "Bank 2", h: 22 },
        { b: "Bank 5", h: 9 },
        { b: "Bank 1", h: 6 },
        { b: "Bank 3", h: 3 },
    ];
    return (
        <Frame title="Treasury assistant · mock data">
            <div className="space-y-3 px-4 py-4">
                <Bubble me accent={accent}>Which banks were slowest to reply this quarter?</Bubble>
                <Bubble accent={accent}>
                    <p>Bank 4 took 31 hours on average and missed two of twelve weeks. Bank 2 was next at 22 hours.</p>
                    <div className="mt-3 space-y-1.5">
                        {banks.map((x) => (
                            <div key={x.b} className="grid grid-cols-[3.5rem_1fr_2.5rem] items-center gap-2 font-mono text-[11.5px] text-bone/60">
                                <span>{x.b}</span>
                                <span className="h-2.5 rounded-[2px]" style={{ width: `${(x.h / 31) * 100}%`, background: accent, opacity: 0.35 + (x.h / 31) * 0.65 }} />
                                <span className="text-right">{x.h}h</span>
                            </div>
                        ))}
                    </div>
                </Bubble>
            </div>
        </Frame>
    );
}

function Checks({ title, head, sub, rows, foot, accent }: { title: string; head: string; sub: string; rows: { k: string; v: string; ok: boolean | "warn" }[]; foot: string; accent: string }) {
    return (
        <Frame title={title}>
            <div className="border-b border-bone/10 px-4 py-3.5">
                <p className="font-semibold text-fg">{head}</p>
                <p className="text-[13px] text-bone/55">{sub}</p>
            </div>
            <div className="divide-y divide-bone/10">
                {rows.map((r) => (
                    <div key={r.k} className="flex items-start gap-3 px-4 py-3">
                        <Mark ok={r.ok} accent={accent} />
                        <div className="min-w-0">
                            <p className="text-fg">{r.k}</p>
                            <p className="text-[13px] text-bone/55">{r.v}</p>
                        </div>
                    </div>
                ))}
            </div>
            <div className="border-t border-bone/10 bg-night-2 px-4 py-3 text-[13px] text-bone/70">{foot}</div>
        </Frame>
    );
}

function QuickfiInsurance({ accent }: P) {
    return (
        <Checks
            accent={accent}
            title="Certificate check"
            head="Certificate of liability insurance"
            sub="Borrower #1042 · received from insurer 9:14 am · matched by account number"
            rows={[
                { k: "Policy type", v: "Commercial general liability, as the contract requires", ok: true },
                { k: "Coverage amount", v: "$2,000,000 per occurrence; contract minimum $1,000,000", ok: true },
                { k: "Policy dates", v: "Active, expires 31 Mar 2026", ok: true },
                { k: "Equipment listed", v: "Serial number on the contract not found on the certificate", ok: false },
            ]}
            foot="Follow-up drafted to the insurer asking for the equipment serial number. Record stays open until it arrives."
        />
    );
}

function QuickfiVendor({ accent }: P) {
    return (
        <Checks
            accent={accent}
            title="Vendor due diligence"
            head="Northfield Equipment Co."
            sub="Requested for a new equipment loan · 7 checks"
            rows={[
                { k: "Secretary of State", v: "Registered 2009, status active", ok: true },
                { k: "OFAC sanctions list", v: "No match", ok: true },
                { k: "Dun & Bradstreet", v: "Entity found, low risk score", ok: true },
                { k: "Google Maps & web", v: "Commercial address matches, website live", ok: true },
                { k: "Adverse news", v: "One 2019 article about a contract dispute, since settled", ok: "warn" },
                { k: "Conflict of interest", v: "No shared owners or addresses with the borrower", ok: true },
            ]}
            foot="Low risk, with one item for a person to read before approving."
        />
    );
}

function Cu25Chat({ accent }: P) {
    const code = "font-mono text-[12px] text-bone/55";
    return (
        <Frame title="Agent with cu25">
            <div className="space-y-3 px-4 py-4">
                <Bubble me accent={accent}>Can you get us a room for our club meeting next Thursday, 5 to 6pm? About 20 people.</Bubble>
                <Bubble accent={accent}>
                    <p>That&apos;s an event for an organization, so it goes through 25Live. Three rooms are free for 20+:</p>
                    <p className={cn(code, "mt-2")}>cu25 rooms 2026-10-29 17:00 18:00 --people 20</p>
                    <ul className="mt-2 space-y-0.5 text-[13.5px]">
                        <li>Gates Hall G01 · seats 40</li>
                        <li>Phillips Hall 203 · seats 24</li>
                        <li>Upson Hall 116 · seats 30</li>
                    </ul>
                </Bubble>
                <Bubble me accent={accent}>Gates G01.</Bubble>
                <Bubble accent={accent}>
                    <p>The form needs two answers before I can send it:</p>
                    <ul className="mt-1.5 list-disc space-y-0.5 pl-5 text-[13.5px]">
                        <li>Will food be served at this event?</li>
                        <li>Will anyone under 18 attend?</li>
                    </ul>
                </Bubble>
                <Bubble me accent={accent}>Pizza, yes. No minors.</Bubble>
                <Bubble accent={accent}>
                    <p>Food unlocked one more question: who&apos;s providing it? Once you tell me, I&apos;ll show you the full request to approve before anything is sent.</p>
                    <p className={cn(code, "mt-2")}>cu25 submit request.json  → preview, confirm code 3f9a1c0b2e</p>
                </Bubble>
            </div>
        </Frame>
    );
}

function ReckonCheck({ accent }: P) {
    return (
        <Frame title="Pull request #142 · Retry failed webhook deliveries">
            <div className="divide-y divide-bone/10">
                <div className="flex items-start gap-3 px-4 py-3.5">
                    <span className="mt-1 size-2.5 shrink-0 rounded-full bg-[#d9a21b]" />
                    <div>
                        <p className="font-semibold text-fg">Reckon comprehension <span className="font-normal text-bone/50">· pending, merge blocked</span></p>
                        <p className="mt-1 text-bone/70">Explain to merge. In your own words, how does this change:</p>
                        <ol className="mt-1.5 list-decimal space-y-0.5 pl-5 text-[13.5px] text-bone/70">
                            <li>decide when a failed delivery is retried, and when it gives up?</li>
                            <li>keep a retried webhook from being processed twice?</li>
                        </ol>
                    </div>
                </div>
                <div className="px-4 py-3.5">
                    <p className="text-[12.5px] text-bone/45">reviewer</p>
                    <p className="text-bone/80">Failures go into a queue with exponential backoff, up to five tries, then they&apos;re marked dead and we alert.</p>
                </div>
                <div className="px-4 py-3.5">
                    <p className="text-[12.5px] text-bone/45">Reckon</p>
                    <p className="text-bone/80">Not yet. You&apos;ve covered when it retries. What stops the same delivery being handled twice if the first attempt actually succeeded?</p>
                </div>
                <div className="px-4 py-3.5">
                    <p className="text-[12.5px] text-bone/45">reviewer</p>
                    <p className="text-bone/80">Each delivery carries its ID, and the handler skips any ID it has already recorded, so a retry of a success is a no-op.</p>
                </div>
                <div className="flex items-center gap-3 bg-night-2 px-4 py-3">
                    <Mark ok accent={accent} />
                    <p className="text-fg">Reckon comprehension <span className="text-bone/50">· passed, merge unblocked</span></p>
                </div>
            </div>
        </Frame>
    );
}

const SKETCHES: Record<SketchName, (p: P) => React.ReactNode> = {
    "bridge-review": BridgeReview,
    "investcorp-digest": InvestcorpDigest,
    "treasury-chat": TreasuryChat,
    "quickfi-insurance": QuickfiInsurance,
    "quickfi-vendor": QuickfiVendor,
    "cu25-chat": Cu25Chat,
    "reckon-check": ReckonCheck,
};

export default function Sketch({ name, accent }: { name: SketchName; accent: string }) {
    const S = SKETCHES[name];
    return <S accent={accent} />;
}
