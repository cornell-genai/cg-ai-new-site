// Project write-ups for the Projects page. Each post is a list of blocks; a
// plain string is a paragraph and may hold [links](https://...).

export type SketchName = "bridge-review" | "treasury-chat" | "quickfi-insurance" | "quickfi-vendor" | "cu25-chat" | "reckon-check";

export type Block =
    | string
    | { h: string }
    | { list: string[] }
    | { quote: string; by: string }
    | { flow: { label: string; note?: string }[]; caption?: string }
    | { stats: { value: string; label: string }[] }
    | { rows: { label: string; body: string }[]; caption?: string }
    /** plate: set a light screenshot on a dark plate tinted with the post accent. */
    | { figure: string; alt: string; caption: string; plate?: boolean }
    | { sketch: SketchName; caption: string }
    | { people: { name: string; did: string }[] }
    | { links: { label: string; href: string; note?: string }[] };

export type Post = {
    slug: string;
    title: string;
    partner: string;
    when: string;
    tag: string;
    dek: string;
    team: string[];
    /** A wide (about 1.9:1) banner in public/work/<slug>/. */
    banner: string;
    /** The partner's colour, used for diagrams and rules. Must read on dark. */
    accent: string;
    /** Where the work stands, in a few words. */
    status: string;
    stack: string[];
    body: Block[];
};

export const POSTS: Post[] = [
    {
        slug: "investcorp",
        banner: "/work/investcorp/banner.webp",
        accent: "#4d8ef0",
        status: "In use at Investcorp",
        stack: ["Python", "LangChain", "Azure OpenAI", "Microsoft Azure"],
        title: "Credit-risk monitoring and treasury analytics for Investcorp",
        partner: "Investcorp",
        when: "Spring 2026",
        tag: "client",
        dek: "An ESG materiality classifier sorts portfolio news by credit impact. A treasury agent extracts rate quotes and response times from bank emails for natural-language queries.",
        team: ["Mateo del Rio Lanse", "Surya Chandrakasan", "Bhavan Sai Balusu", "Yashnil Saha", "Thurushi Kiyara Rajapakse", "Morgan Nelson Stuart", "Sarah Li", "JD Krasnick", "Dhruv Mandalik", "Aleks Dzudzevic", "Eddie Hu", "Andrew Visconti"],
        body: [
            "Investcorp is a global alternative investment firm. In February, their technical lead walked us through possible uses for AI across the firm. We chose two self-contained pilots that could be built without weeks of security reviews, and twelve of us split into two teams to work on them. Both had to use Python, run on Investcorp's Azure infrastructure, and work from the command line before we built dashboards.",
            { h: "Pilot one: ESG materiality classification" },
            "One of Investcorp's businesses manages collateralized loan obligations (CLOs), funds made up of loans to multiple companies, usually 75 to 100 of them. If one of those companies gets sued, loses a factory to a flood or loses its CEO, the credit team wants to know before the news shows up in the price of the loan. Before this project, the credit team kept up with this news mostly by hand.",
            "We needed a definition of materiality before we could build a useful classifier. For the credit team, an environmental, social or governance (ESG) event mattered if it could affect a company's ability to repay its debt. A controversy that briefly moved the share price did not carry the same weight as a lawsuit that could bankrupt the company. We used that distinction to define three credit-risk tiers.",
            {
                rows: [
                    { label: "High", body: "A real chance of hurting the company's ability to pay its debt soon, such as bankruptcy filings, major lawsuits, enforcement actions or supply chain breaks. These come with a short analysis and a suggested next step." },
                    { label: "Medium", body: "Worth watching but not yet worth acting on, such as early litigation, governance concerns or sector headwinds. These get a short summary and are tracked in case they grow." },
                    { label: "Low", body: "Logged for the record, without inbox notifications." },
                ],
                caption: "Materiality tiers reflect credit risk rather than share price or general ESG sentiment.",
            },
            "The system runs weekly rather than in real time because credit events tend to build over days and weeks. A weekly report is easier to read carefully than a stream of alerts.",
            {
                flow: [
                    { label: "News feeds", note: "the sources the credit team already reads" },
                    { label: "Classifier", note: "High, Medium or Low by effect on credit" },
                    { label: "Weekly report", note: "analysis for High, summaries for Medium" },
                    { label: "Memory", note: "every event logged by company and industry" },
                ],
                caption: "The event history feeds back into the classifier the following week.",
            },
            "A weekly report also needed context from earlier weeks. Three medium-tier events for the same company in a month could justify a higher tier even if no single event would. We logged events by company and industry so the classifier could use that history on the next run. We also designed a feedback path for the credit team to correct classifications, rather than rely on our judgement of what mattered.",
            { h: "Analyst workspace and portfolio views" },
            "The pilot grew into a product the credit team uses. The analyst workspace ranks every company in the portfolio by how quickly its ESG risk is getting worse. Each row shows how fast events are arriving, whether things are escalating or settling down, the worst severity so far and an overall score. Selecting a company shows its timeline of events, its exposure across environmental, social and governance issues, and how its risk has moved over the last few months.",
            { figure: "/work/investcorp/workspace.webp", alt: "The analyst workspace: a table of portfolio companies ranked by ESG deterioration, with velocity, trend, event count, peak severity and score, and below it an event timeline, ESG exposure and risk trajectory for the selected company.", caption: "The analyst workspace, shown with sample data.", plate: true },
            "A second page tracks the system itself. It shows how many events have been classified and how many are waiting, and which companies have had no news coverage lately. Private companies can go weeks without coverage, and a company with no news may still be in trouble. The page also shows how events split across severity and pillar, and how confident the classifier is. Events the classifier is unsure about go to a review queue for a person to check.",
            { figure: "/work/investcorp/analytics.webp", alt: "The analytics overview: portfolio companies, recent coverage and coverage gaps; pipeline status; event volume over seven days; severity distribution; pillar breakdown; classification confidence and event type breakdown.", caption: "The analytics overview, with coverage, pipeline health and classifier performance. Sample data.", plate: true },
            "The portfolio view lists every company tracked across the CLO funds. For each one it shows the sector, how much Investcorp has lent, which funds hold the loan, whether the company is close to breaching a covenant, and when it last appeared in the news. An analyst can start here when a company's name comes up in a meeting.",
            { figure: "/work/investcorp/portfolio.webp", alt: "The portfolio companies table: company, sector, exposure in millions of dollars, CLO funds, covenant status (clear, near threshold, flagged) and days since the last event, with materiality and industry filters and CSV export.", caption: "The portfolio view, with exposure, funds, covenant status and the latest event for each company. Sample data.", plate: true },
            { h: "Scoping and deployment" },
            "Over spring break, we scoped the first version across six workstreams: requirements, architecture, the materiality framework, news sources, prior art, and the feedback loop. Everything runs through Investcorp's own Azure OpenAI deployment. Their portfolio data never leaves their cloud.",
            { h: "Pilot two: treasury email extraction" },
            "Investcorp's treasury team requests indicative rates from banks each week. Replies arrive in a shared inbox as body text or attachments, sometimes late or not at all. The team previously read and consolidated these replies manually.",
            "Our agent monitors the inbox, extracts each bank's quoted rate and response time, and writes them to a database. Those were the two metrics treasury prioritized. A natural-language query interface answers questions such as which banks responded slowest this quarter. It can also chart the results.",
            {
                flow: [
                    { label: "Weekly outreach", note: "same subject line every time" },
                    { label: "Replies land", note: "in the email body or in attachments" },
                    { label: "Agent reads", note: "rate quoted, time to reply" },
                    { label: "Database", note: "one row per bank per week" },
                    { label: "Ask in English", note: "answers and charts" },
                ],
            },
            { sketch: "treasury-chat", caption: "Illustration of the treasury chat, with mock data. We built and tested the agent against mock bank inboxes, so no real quotes were ever on our laptops." },
            { h: "What we took away" },
            "The hardest design work was deciding what counted as material credit risk. A classifier that found every ESG headline would still leave the credit team to decide which events could affect repayment. Defining the tiers gave us a target for the classifier and a reason to leave low-impact events out of the inbox.",
            "Keeping the first version small let us exercise the complete workflow, from collecting news to producing a weekly report, rather than partially cover every market and signal. We also built on Investcorp's Azure infrastructure and model deployment from the start, so there was no deployment migration to do at the end.",
        ],
    },
    {
        slug: "foresight",
        banner: "/work/foresight/banner.webp",
        accent: "#e5483f",
        status: "AAAI-27 student abstract",
        stack: ["PyTorch", "Laya (421M)", "Pokémon Showdown", "poke-env"],
        title: "ForeSight: calibrated opponent modeling in Pokémon",
        partner: "Research",
        when: "Fall 2026",
        tag: "research",
        dek: "ForeSight fine-tunes Laya (421M parameters) to forecast opponent actions in Pokémon and uses the probabilities in depth-two expectimax search.",
        team: ["Saiakhil Chilaka"],
        body: [
            "Saiakhil Chilaka built ForeSight to test a small learned opponent model as an alternative to hand-written heuristics and per-turn LLM queries. The aim was to guide lookahead search without the latency and API cost of those queries.",
            "ForeSight fine-tunes [Laya](https://github.com/NandhaKishorM/laya), a 421M-parameter \"System One\" decision model that answers multiple-choice questions in a single pass rather than generating text. It assigns probabilities to the opponent's available actions, which a depth-two expectimax search uses to weight each branch.",
            {
                flow: [
                    { label: "Battle state", note: "both sides' Pokémon, HP, moves, the last few turns" },
                    { label: "Forecast", note: "Laya gives a probability for each opponent action in 36 to 84 ms" },
                    { label: "Look ahead", note: "depth-2 expectimax weights each branch by those probabilities" },
                    { label: "Move", note: "about 3 s per turn on a laptop" },
                ],
                caption: "One turn of ForeSight.",
            },
            "Saiakhil generated the training data at no cost by logging decisions from a few thousand battles between simple bots on a local Pokémon Showdown server. Fine-tuning only the top four of Laya's 28 layers took about 35 minutes on an Apple laptop.",
            {
                stats: [
                    { value: "72–80%", label: "of opponent moves predicted correctly, up from 43% zero-shot" },
                    { value: "75%", label: "accuracy on Abyssal, a benchmark bot it never saw in training" },
                    { value: "56.5%", label: "wins in 200 games against Abyssal, with no LLM" },
                    { value: "$0", label: "in API calls" },
                ],
            },
            "Calibration matters because the search weights branches by their forecast probabilities. Predictions assigned 70% confidence are correct about 70% of the time.",
            { figure: "/work/foresight/reliability_laya_gen8.png", alt: "Reliability diagram: forecast probability against observed frequency, close to the diagonal for both held-out bots and Abyssal.", caption: "Calibration of the fine-tuned forecaster. Points near the dashed diagonal mean the stated confidence matches how often it's right." },
            { h: "Forecast accuracy and win rate" },
            "ForeSight's 56.5% win rate against Abyssal is comparable to PokéLLMon (56%), an LLM-based agent, and below PokéChamp (64 to 70%). Looking one additional turn ahead improves performance by 13 to 20 points over one-step play, the clearest effect in the experiments.",
            "Better forecasts did not produce more wins with the search we used. A simple damage heuristic played at least as well, and a uniform opponent-action model, which treats every available move as equally likely, won 55.5% of its games compared with ForeSight's 56.5%. The rough battle simulator and limited search depth were the bottlenecks in these experiments. Improving forecast accuracy alone would not address them, so the next round of work focuses on those two components.",
            { figure: "/work/foresight/accuracy_breakdown_laya_gen8.png", alt: "Bar charts of top-1 accuracy by turn number and by number of options, well above chance throughout.", caption: "Forecast accuracy by stage of the game and by how many options the opponent had. The black ticks mark chance." },
            { h: "Earlier pilots" },
            "ForeSight grew out of a series of small, cheap pilots, each testing one question. In one, a small model reranked an LLM agent's moves in the text game ALFWorld, and success went from 34.6% to 48.4%. Others tried to predict poker actions and human Pokémon players zero-shot, which only partly worked. The repo has a write-up of every pilot's result, good or bad, along with the cost of every API call the pilots made. None of them cost more than a few dollars.",
            { links: [
                { label: "Code and results", href: "https://github.com/akhilc08/aaai-27", note: "every number in the abstract traces to a file" },
                { label: "The abstract (PDF)", href: "https://github.com/akhilc08/aaai-27/blob/main/paper/paper.pdf" },
            ] },
        ],
    },
    {
        slug: "bridge",
        banner: "/work/bridge/banner.webp",
        accent: "#6f8fe8",
        status: "Delivered",
        stack: ["FastAPI", "IBM Docling", "OpenAI", "Supabase", "Next.js"],
        title: "Financial document extraction for Bridge",
        partner: "Bridge",
        when: "Fall 2025",
        tag: "client",
        dek: "A document extraction pipeline prefills Bridge's loan applications with source references and confidence scores for borrower review.",
        team: ["Asad Abbas Rizvi", "Arshdeep Kaur", "Yashnil Saha", "Tanner Brendan Blake"],
        body: [
            "[Bridge](https://www.bridge.co) runs a marketplace where businesses ask for financing and lenders respond. Before a lender sees anything, a borrower fills in a long request with company basics, sponsors, and pages of numbers from balance sheets and income statements. Almost all of this is already in documents the borrower has, so the borrower ends up typing it in a second time. We wanted to prefill those requests accurately enough that borrowers could trust and check the results.",
            { h: "How a borrower uses it" },
            {
                flow: [
                    { label: "Upload", note: "statements, spreadsheets and decks, plus a few basics" },
                    { label: "Process", note: "the documents are read in the background while the borrower keeps going" },
                    { label: "Review", note: "every field shows its source and a confidence score" },
                    { label: "Submit", note: "accept, edit or reject each one, then send" },
                ],
            },
            "Borrowers submit these financials under their own names, so each extracted value includes its source line and confidence score for review before submission.",
            { sketch: "bridge-review", caption: "Illustration of the review screen, with made-up numbers." },
            { h: "Initial extraction pipeline" },
            "The first version used IBM Docling to parse PDFs, spreadsheets, Word files and slides, then passed the text to an LLM for field extraction. Field accuracy was 40 to 52% against hand-checked answers.",
            "In the failed extractions, the model sometimes chose an old year-end statement over current figures or copied only part of a liability. Empty year-to-date columns led to incorrect revenue, and missing fields were sometimes filled with estimates that appeared nowhere in the documents.",
            { h: "Table extraction and validation" },
            "The revised pipeline extracts values directly from tables and reserves the LLM for fields that require reasoning. Reducing the LLM's role improved accuracy without requiring a larger model.",
            {
                flow: [
                    { label: "Read tables", note: "cash, receivables, revenue and similar fields, straight from the cells" },
                    { label: "Ask the model", note: "only for fields that need judgement" },
                    { label: "Clean up", note: "drop invented estimates, rebuild totals from their parts" },
                    { label: "Check the math", note: "assets must equal liabilities plus equity, within $1 or 0.1%" },
                    { label: "Score", note: "confidence goes up when the numbers balance and down sharply when they don't" },
                    { label: "Tidy", note: "45+ messy fields reduced to 28 clean ones" },
                ],
                caption: "The extraction pipeline after the rewrite.",
            },
            "The balance-sheet identity, assets = liabilities + equity, provides an arithmetic consistency test for the extracted totals. If a total doesn't match its parts, the pipeline recomputes the parts in proportion and lowers the confidence score, so the borrower knows to check that field. We also made the pipeline always prefer the most recent document. That change alone fixed a surprising number of errors.",
            {
                stats: [
                    { value: "40–52% → 85–95%", label: "of fields correct against hand-checked answers" },
                    { value: "67s → ~20s", label: "to process a document" },
                    { value: "45 → 28", label: "fields in the output, after removing duplicates and noise" },
                ],
            },
            { h: "Making it faster" },
            "Every request originally sent the whole document to the model, taking 67 seconds per document. We considered embedding-based retrieval, then found a simpler way to choose the context. Requests for financial fields only needed the tables, while requests for company details needed the opening, where names and addresses appear. Restricting the inputs improved accuracy and made processing three to four times faster, with no vector database to run.",
            { h: "Architecture and field-level provenance" },
            "Supabase edge functions handle authentication, uploads and job creation. A FastAPI service handles document parsing, schema population, confidence scoring and field-level provenance. Source references and confidence scores remain attached to each field through the review UI.",
            "We also started filling gaps from public data, such as SEC filings and company records from People Data Labs. We respected robots.txt and stuck to public sources. We wanted to use LinkedIn data but couldn't.",
            { h: "What we learned" },
            "Several of the first version's errors came from choices we could make explicit. The model sometimes preferred an older statement or filled a missing field with an estimate. Recency rules and direct table extraction reduced how much of that work we left to the model.",
            "Accounting checks gave us another way to challenge the output. Assets had to equal liabilities plus equity, but a balance sheet that balanced could still contain an incorrectly extracted value. We kept source lines and confidence scores on every field so borrowers could verify and correct the extraction, even when the arithmetic was consistent.",
        ],
    },
    {
        slug: "quickfi",
        banner: "/work/quickfi/banner.webp",
        accent: "#81c241",
        status: "Delivered, extended in 2026",
        stack: ["Flask", "Supabase", "OpenAI", "Perplexity", "Dun & Bradstreet", "OFAC"],
        title: "Insurance validation and vendor due diligence for QuickFi",
        partner: "QuickFi",
        when: "Spring 2025 – Spring 2026",
        tag: "client",
        dek: "Two agents automate commercial insurance certificate validation and vendor due diligence for QuickFi's equipment finance platform.",
        team: ["Merek Kaden Soriano", "David Lee", "Erik Pedersen", "Brandon Xu", "Alex Kozik", "Nicole Luo", "Audrey Lewellen", "Morgan Nelson Stuart", "Zach Riiff", "Arshdeep Kaur", "Jonathan Zhang", "Mateo del Rio Lanse", "Eddie Hu"],
        body: [
            "QuickFi builds an embedded lending platform for business equipment finance. Equipment makers and banks use it to offer loans at the point where the equipment is sold. When we met QuickFi in early 2025, two routine tasks were taking up their operations team's time, and the work grew as the business grew.",
            "The first was insurance. Every borrower has to keep commercial insurance on the equipment, and someone had to confirm it. That meant emailing the insurer, waiting for a certificate, opening the PDF, checking it against the contract, updating the record, and following up on anything missing.",
            "The second was vendors. Before QuickFi pays for a piece of equipment, it needs to know the seller is a real, registered business that isn't on a sanctions list or in the news for fraud. That research was slow and done differently every time. We built an agent for each task.",
            { h: "Insurance certificates" },
            {
                flow: [
                    { label: "Request", note: "the agent emails the insurer from a template" },
                    { label: "Watch", note: "the agent monitors a secure inbox and matches each certificate to the borrower" },
                    { label: "Read", note: "an LLM pulls out policy type, coverage, dates and equipment" },
                    { label: "Check", note: "against that contract's specific requirements" },
                    { label: "File", note: "the certificate is stored, the record updated, and follow-ups sent if anything is missing" },
                ],
                caption: "Once a certificate arrives, the remaining steps run without a person in the loop.",
            },
            { sketch: "quickfi-insurance", caption: "Illustration of a certificate check, with made-up details." },
            "Different insurers sent different certificate layouts, so the first extraction attempt was not always reliable. The reader needed fallbacks, while the surrounding workflow had to handle missing attachments and out-of-order replies without losing track of the borrower. We built that workflow on Flask and Supabase.",
            { h: "Vendor checks" },
            "The vendor agent runs independent checks and combines the results into a risk report for manual review. The checks include conflict-of-interest detection, such as whether a borrower owns the equipment vendor.",
            { sketch: "quickfi-vendor", caption: "Illustration of a vendor report, with a made-up vendor." },
            "Secretary of State registries varied from state to state and changed without warning, so each needed a separate scraper and ongoing maintenance. Entity resolution meant handling names such as \"Acme Equipment Inc.\" in one source and \"ACME EQUIPMENT, INCORPORATED\" in another. We used fuzzy matching to decide when two records referred to the same company. Google and Dun & Bradstreet rate limits also required request batching and retries.",
            { h: "Who built what" },
            {
                people: [
                    { name: "Merek Soriano", did: "led the insurance project" },
                    { name: "Erik Pedersen", did: "built the certificate validator, which classifies certificates and checks them against QuickFi's standards, and set up storage and the code connecting email, validation and the backend" },
                    { name: "Brandon Xu", did: "built the API endpoints for borrower lookup, certificate upload and expiry dates" },
                    { name: "Alex Kozik", did: "built the data models and the templated request and follow-up emails" },
                    { name: "Nicole Luo", did: "built the inbox monitor that matches incoming certificates to borrowers" },
                    { name: "David Lee", did: "led the vendor project" },
                    { name: "Audrey Lewellen", did: "built the Google Maps and Search checks and the adverse-news pipeline" },
                    { name: "Morgan Stuart", did: "built the Dun & Bradstreet integration, conflict-of-interest detection and the risk scoring" },
                    { name: "Zach Riiff", did: "built the backend for vendor records and the external checks" },
                    { name: "Arshdeep Kaur", did: "built the APIs that talk to outside data sources" },
                    { name: "Jonathan Zhang", did: "built the Secretary of State and OFAC lookups" },
                ],
            },
            {
                quote: "We were delighted to partner with the Generative AI at Cornell team on these two projects which show the tremendous capabilities of these talented Cornell students to use emerging new Agentic AI technology to improve long-standing business models in banking and finance.",
                by: "Bill Verhelle, CEO of QuickFi (Cornell Law '98)",
            },
            { h: "Spring 2026" },
            "QuickFi asked us back, and Mateo, Brandon and Eddie continued extending the vendor pipeline.",
            { links: [{ label: "Read the original case study (PDF)", href: "https://drive.google.com/file/d/1Pu6QSW2ClZg3em3bRcolzeS73srP9z-p/view" }] },
        ],
    },
    {
        slug: "for-cornell",
        banner: "/work/for-cornell/banner.webp",
        accent: "#e5483f",
        status: "Open source, in beta",
        stack: ["Python", "pydantic", "MCP", "TypeScript", "Probot", "Supabase"],
        title: "cu25 and Reckon Review",
        partner: "For the Cornell community",
        when: "Summer – Fall 2026",
        tag: "open source",
        dek: "cu25 is a CLI and MCP server for Cornell room reservations. Reckon Review is a GitHub App that checks reviewers' understanding of a pull request before it can merge.",
        team: ["Asad Abbas Rizvi"],
        body: [
            { h: "cu25: booking rooms from the terminal" },
            "Cornell's 25Live event request form has conditional fields and requires two days' notice. Library study rooms use a separate booking system. cu25 provides a command-line tool for direct use and an MCP server for AI agents. It routes study-space and small-group requests to the library system and organization events to 25Live.",
            { sketch: "cu25-chat", caption: "Illustration of an agent using cu25. The room, questions and reference are examples." },
            "Hard-coding the room form would tie cu25 to one version of 25Live's questions and follow-up rules. Reading the form live lets cu25 return the current questions and options when information is missing.",
            {
                rows: [
                    { label: "Live form schema", body: "cu25 reads the form's fields, questions, follow-up rules and date limits live from 25Live, which had 164 form rules at last count. If the form changes, cu25 notices and says so instead of submitting something wrong." },
                    { label: "Missing answers", body: "When an answer is missing, cu25 returns the question in the form's own words and options, so the agent asks you. It never invents an answer about food, guests or alcohol." },
                    { label: "Preview, then confirm", body: "Submitting without a confirmation code only shows you exactly what would be sent. The code is a fingerprint of that exact request, so the request that goes out is the one you approved." },
                    { label: "No saved password", body: "You log in once in your own browser with NetID and Duo. There's no server and no saved password. Requests stay Tentative until a real scheduler approves them." },
                ],
            },
            "Library spaces in Olin, Uris, Catherwood, Mann and Carpenter need no login. cu25 first lists the free spaces with each one's open times, then books one under your own name and Cornell email.",
            "The tests replay real, sanitised responses from 25Live and the libraries to check that cu25 behaves exactly like the website. One test copies a past event, takes it through the check, preview and confirm steps, and checks that the request cu25 sends matches what the browser sent, field for field.",
            { h: "Reckon Review: explain what you merge" },
            "Reckon Review is a GitHub App that checks whether reviewers understand the code they merge, including changes written by AI. It identifies two to four important decisions in a pull request and blocks the merge until someone with write access explains how the change works in their own words, rather than restating the diff. A separate model grades the explanation. A passing answer unblocks the merge. If the explanation is incomplete, Reckon names the specific gap to address.",
            {
                flow: [
                    { label: "PR opens", note: "written by a person or by AI" },
                    { label: "Find the decisions", note: "2 to 4 that matter, using a map of how the change fits the codebase" },
                    { label: "Explain", note: "a reviewer replies in their own words" },
                    { label: "Graded", note: "a pass unblocks the merge. Otherwise Reckon names the one gap" },
                ],
            },
            { sketch: "reckon-check", caption: "Illustration of Reckon on a pull request. The change and the replies are examples." },
            "In the webhook illustration, explaining the retry schedule leaves duplicate delivery unanswered. Reckon's follow-up asks for the missing reasoning before it marks the check as passed.",
            "Reckon skips changes that don't need an explanation. Docs, lockfiles and tiny diffs pass on their own, and so do changes that only touch styles, assets, tests or config. Changes to code that many other files depend on are graded more strictly. If you push a typo fix after passing and the decisions haven't changed, your pass carries over.",
            "Reckon builds an in-memory dependency graph from the repository at the PR's head revision to identify changes to widely used code. The graph is discarded after a few seconds, and no source code is stored.",
            { h: "Code and feedback" },
            "Both tools are free, open source, and in beta. For feedback on either tool, open a GitHub issue or talk to us at a meeting.",
            { links: [
                { label: "cu25 on GitHub", href: "https://github.com/Archdiner/25live-mcp", note: "pip install, then cu25 login" },
                { label: "Reckon Review on GitHub", href: "https://github.com/Archdiner/reckon-review" },
                { label: "Install Reckon Review", href: "https://github.com/apps/reckon-review/installations/new", note: "free during the beta" },
            ] },
        ],
    },
    {
        slug: "outreach-crm",
        banner: "/work/outreach-crm/banner.webp",
        accent: "#e0574c",
        status: "In private pilot",
        stack: ["TypeScript", "Next.js", "Postgres", "Vercel AI SDK", "Claude", "MCP", "Claude Code"],
        title: "Outreach CRM: a networking pipeline your own AI agent can work in",
        partner: "Independent project",
        when: "Summer – Fall 2026",
        tag: "product",
        dek: "A spreadsheet-style CRM for students doing networking outreach. AI drafts each message from what the CRM knows about you and the recipient. You review and send it, and any MCP agent can work the pipeline with you.",
        team: ["Morgan Nelson Stuart"],
        body: [
            "Most students who land a job through networking keep track of it in a spreadsheet: who they messaged, what they said, who replied, and who is owed a follow-up. The spreadsheet doesn't remind anyone, and every message starts from a blank page. Morgan Stuart built Outreach CRM to replace that spreadsheet with a pipeline that updates itself and drafts the next message from what it already knows.",
            "The rule from the first design doc is that AI drafts and the person sends. The CRM writes drafts, fills gaps and preps calls. By default, a person reads every message and sends it themselves.",
            "Every screenshot here comes from a demo workspace. Its owner is a fictional Cornell student, and every person in it is invented. The companies are real names, used only as outreach targets.",
            { h: "The pipeline" },
            "The main screen is a register of people, companies and job applications. Each contact's stage comes from what has been logged against them: first outreach, a reply, a call scheduled, a call held, a referral, or a thread gone dormant. Logging \"I sent this\" or \"they replied\" moves the stage and records the date, so nobody updates status columns by hand. The tiles across the top count each stage and flag threads that have gone stale.",
            { figure: "/work/outreach-crm/pipeline.webp", alt: "The people register: stage counts across the top, five drafts waiting for review, and a table of contacts with title, company, seniority, stage badges, last activity and draft status.", caption: "The people register in the demo workspace. Every person shown is invented.", plate: true },
            "Companies are records of their own, sorted into tiers and hand-picked folders. A company page rolls up everyone you know there, how far each conversation has gone, any alumni among your contacts, and your applications to it.",
            { figure: "/work/outreach-crm/company.webp", alt: "A company page in split view: the list of target companies by tier on the left, and on the right the company's profile, a rollup of people, replies and applications, and a table of two contacts with their stages.", caption: "A company page, with the people you know there and where each conversation stands. Demo data.", plate: true },
            { h: "Drafts grounded in what's on file" },
            "Each draft is written from two sources: a sender profile and the contact's record. The profile holds who you are, a paragraph in your own words, your outreach templates, the hours you can meet and your résumé. The contact's record holds their role, the company and the conversation so far.",
            {
                flow: [
                    { label: "Context", note: "who you are, how you write, when you can meet" },
                    { label: "Contact", note: "role, company, the thread so far" },
                    { label: "Draft", note: "written against your template and the facts on file" },
                    { label: "Review", note: "edit it, send it yourself" },
                    { label: "Log", note: "\"I sent this\" moves the stage" },
                ],
                caption: "How a message gets from the CRM to the recipient.",
            },
            "A draft may only use facts the CRM holds. When the record is thin, the draft gets shorter rather than reaching for a detail nobody wrote down. A made-up fact about someone can embarrass you in the first minute of a call, so the CRM leaves it out.",
            { figure: "/work/outreach-crm/drafts.webp", alt: "The Drafts page: a form to request a draft for a contact and format, and a list of generated LinkedIn messages waiting for review, each labeled with its contact and step.", caption: "Drafts wait here until someone reads, edits and sends them. Demo data.", plate: true },
            "When a reply comes in, it goes on the contact's thread, and the next step is one button.",
            { figure: "/work/outreach-crm/conversation.webp", alt: "A contact's page: name, title and company, stage badges, buttons to ask an agent for call prep, and a LinkedIn thread of three messages with controls to log the next response.", caption: "One contact's thread, with the next step ready to log. Demo data.", plate: true },
            { h: "Bring your own agent" },
            "The CRM is also an MCP server. Claude Code, Claude Desktop, ChatGPT, Codex and other MCP clients can connect to it, and each one signs in through the app's own OAuth flow. Once connected, an agent can read and update the same records a person edits in the browser.",
            "The Agent page has a prompt gallery of commands for that agent: set up a new workspace, add people you've spotted, capture a batch of job postings, find people at a company, draft messages for one company, or prep for a call. The CRM writes each prompt from data it already holds, and the user's own agent does the work. The CRM spends nothing on those runs, and people use the agent they already pay for. The prompts are written to avoid duplicate work. An agent searches for a name before adding it, and it leaves an email field blank rather than guessing.",
            { figure: "/work/outreach-crm/agent.webp", alt: "The prompt gallery: a search box and cards for commands such as Set up this workspace, Add companies and people you have spotted, Draft messages for this company and Capture job postings, each with buttons to copy the prompt and open Claude or ChatGPT.", caption: "The prompt gallery. Each card copies a ready-made command into Claude or ChatGPT.", plate: true },
            { h: "agentlink: running work on your own Mac" },
            "A web page can't start a program on your computer, so a button in the CRM couldn't run an agent. Morgan built agentlink to close that gap: a small background agent for macOS that you pair with an app once, using a one-time code. After that it polls the app every few seconds. When a task is waiting, it runs Claude Code headless, with only that app's tools and inside time and budget limits the app sets. It reports progress and a typed result back.",
            "Work can also start without a click. When a call is logged as scheduled, the CRM can queue a prep brief for the call. The task expires at the call time, so the brief is ready before the call or it doesn't run. Nothing in agentlink is specific to the CRM. Any web app can use it by implementing the same small HTTP contract, and it's open source.",
            { h: "Built for more than one person" },
            "The CRM was built as a multi-user product from its first commit. Every record belongs to a workspace, a workspace can have contributors, and anything a contributor adds waits for the owner's review before it joins the pipeline. Uploaded documents are treated as data, never as instructions to the model. All model calls go through one gateway, so changing the drafting model is a one-line config change.",
            {
                rows: [
                    { label: "Workspaces", body: "The tenancy boundary. Everything belongs to exactly one, and a solo user is a workspace of one." },
                    { label: "Contributors", body: "Teammates who can add people and companies. Their additions are queued for the owner to accept or reject." },
                    { label: "Agent access", body: "Agents sign in through the app's own OAuth server, with dynamic client registration and PKCE, and act as the person who connected them." },
                    { label: "Decisions on record", body: "Nine architecture decision records, from how models are reached to where the app is hosted. A reversed decision gets a new record that links back to the old one." },
                ],
            },
            { h: "What Morgan took away" },
            "Handing the AI work to the user's own agent changed what the product had to be. The CRM's job became keeping accurate records and writing good prompts. Searching, reading and drafting at scale happen in an agent the user already runs, and the CRM doesn't pay for them.",
            "Limiting drafts to facts on file made them shorter and safer to send. A short message that's accurate is better than a longer one with a detail the model guessed.",
            { links: [
                { label: "agentlink on GitHub", href: "https://github.com/XxMorganxX/agentlink", note: "the open-source Mac agent" },
            ] },
        ],
    },
];
