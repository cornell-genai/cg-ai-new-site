// Project write-ups for the Projects page. Each post is a list of blocks; a
// plain string is a paragraph and may hold [links](https://...).


export type SketchName = "bridge-review" | "investcorp-digest" | "treasury-chat" | "quickfi-insurance" | "quickfi-vendor" | "cu25-chat" | "reckon-check";

export type Block =
    | string
    | { h: string }
    | { list: string[] }
    | { quote: string; by: string }
    | { flow: { label: string; note?: string }[]; caption?: string }
    | { stats: { value: string; label: string }[] }
    | { rows: { label: string; body: string }[]; caption?: string }
    | { figure: string; alt: string; caption: string }
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
    /** The partner's colour for diagrams and rules on the white page. */
    accent: string;
    body: Block[];
};

export const POSTS: Post[] = [
    {
        slug: "investcorp",
        banner: "/work/investcorp/banner.webp",
        accent: "#13294b",
        title: "Reading the news and the inbox for Investcorp",
        partner: "Investcorp",
        when: "Spring 2026",
        tag: "client",
        dek: "Two pilots with a global investment firm: an agent that watches the news for its loan portfolio and sorts events by how much they matter to credit, and one that turns a treasury inbox into a database you can ask questions.",
        team: ["Mateo del Rio Lanse", "Surya Chandrakasan", "Bhavan Sai Balusu", "Yashnil Saha", "Thurushi Kiyara Rajapakse", "Morgan Nelson Stuart", "Sarah Li", "JD Krasnik", "Dhruv Mandalik", "Aleks Dzudzevic", "Eddie Hu", "Andrew Visconti"],
        body: [
            "Investcorp is a global alternative investment firm. In February their technical lead walked us through a long list of places AI could help, and we picked two to start with for a very practical reason: each one could stand on its own without weeks of security reviews. Both had to be Python, both run on Investcorp's own Azure cloud, and both had to be useful from a command line before anyone built a dashboard.",
            "Twelve of us split into two teams.",
            { h: "Pilot one: which headlines actually matter" },
            "One of Investcorp's businesses runs CLOs. A CLO is a fund made of loans to a lot of companies at once, usually 75 to 100 of them. If one of those companies gets sued, loses a factory to a flood or watches its CEO walk out, the credit team wants to know before it shows up in the price of the loan. Today, keeping up with all of that is mostly manual.",
            "The tempting version of this project is a firehose: every ESG headline about every company. Nobody wants that. The thing we kept coming back to was that an event matters here only if it might change whether a company can pay back its debt. A small controversy that dents the share price for a day isn't the same as a lawsuit that could bankrupt the company. So the core of the system is a classifier that sorts every event into one of three tiers by its effect on credit.",
            {
                rows: [
                    { label: "High", body: "A real chance of hurting the company's ability to pay its debt soon: bankruptcy filings, major lawsuits, enforcement actions, supply chain breaks. These come with a short analysis and a suggested next step." },
                    { label: "Medium", body: "Worth watching but not acting on yet: early litigation, governance worries, sector headwinds. A short summary, and tracked in case it grows." },
                    { label: "Low", body: "Logged for the record and kept out of everyone's inbox." },
                ],
                caption: "The three tiers, measured against credit risk rather than share price or general ESG sentiment.",
            },
            "It runs weekly, not in real time. That surprised some of us at first, but credit events tend to build over days and weeks, and a calm weekly report gets read more carefully than a stream of pings.",
            {
                flow: [
                    { label: "News feeds", note: "the sources the credit team already reads" },
                    { label: "Classifier", note: "High, Medium or Low by effect on credit" },
                    { label: "Weekly report", note: "analysis for High, summaries for Medium" },
                    { label: "Memory", note: "every event logged by company and industry" },
                ],
                caption: "The pipeline. The memory feeds back into the classifier the following week.",
            },
            "That memory is what makes it more than a news alert. If a company shows up with three medium-tier events in a month, none of which would raise an eyebrow alone, the pattern can push it up a tier. We also designed a way for the credit team to correct the classifier when it gets one wrong, so it improves on their judgement rather than ours.",
            { sketch: "investcorp-digest", caption: "Illustration of the weekly report. The companies and events are made up; the real portfolio stays inside Investcorp." },
            "Over spring break the team split into six workstreams (requirements, architecture, the materiality framework, news sources, prior art, and the feedback loop) so we came back with a fully scoped first version instead of a pile of open questions. Everything runs through Investcorp's own Azure OpenAI deployment. Their portfolio data never leaves their cloud, and we were fine with that.",
            { h: "Pilot two: the treasury inbox" },
            "Every week Investcorp's treasury team emails a list of banks asking for indicative rates. The answers trickle back into a shared inbox: some in the body of the email, some in attachments, some late, some never. Making sense of it meant reading every reply by hand.",
            "We built an agent that watches the inbox, pulls out the rate each bank quoted and how long it took to reply, and files both into a database. On top of that sits a chat you can ask in plain English, like which banks have been slowest this quarter, and it will draw you the chart. Those two numbers, how fast and at what rate, were the ones the team told us mattered most.",
            {
                flow: [
                    { label: "Weekly outreach", note: "same subject line every time" },
                    { label: "Replies land", note: "body text or attachments" },
                    { label: "Agent reads", note: "rate quoted, time to reply" },
                    { label: "Database", note: "one row per bank per week" },
                    { label: "Ask in English", note: "answers and charts" },
                ],
            },
            { sketch: "treasury-chat", caption: "Illustration of the treasury chat, on mock data. We built and tested against pretend bank inboxes so no real quotes ever touched our laptops." },
            { h: "What we took away" },
            {
                list: [
                    "Start narrow. Our first instinct was to cover every market and every signal. Starting from a small set of factors and proving the whole loop end to end was more convincing than half of everything.",
                    "Define \"important\" before you build anything. Most of the hard thinking in the news pilot went into the materiality tiers, not the code.",
                    "Work inside the client's walls. Building on their cloud and their models from day one meant there was nothing to migrate at the end.",
                ],
            },
        ],
    },
    {
        slug: "foresight",
        banner: "/work/foresight/banner.webp",
        accent: "#d01f17",
        title: "ForeSight: a small model that guesses your opponent's next move",
        partner: "Research",
        when: "Fall 2026",
        tag: "research",
        dek: "An AAAI-27 student abstract from one of our head engineers. A 421M-parameter model, trained for 35 minutes on a laptop, forecasts what a Pokémon opponent will do next and drives a lookahead search with no LLM and no API calls.",
        team: ["Saiakhil Chilaka"],
        body: [
            "To choose a good move, you have to guess what the other side will do. Chess engines guess with hand-written rules and an exact simulator. LLM agents guess by asking a very large model, which is slow, costs money every turn and isn't great at saying how sure it is. Saiakhil wanted to know if there was something in between.",
            "ForeSight takes a small \"System One\" decision model ([Laya](https://github.com/NandhaKishorM/laya), 421M parameters), the kind that answers a multiple-choice question in one fast pass instead of writing text, and fine-tunes it to predict the opponent's next action with a probability attached. A depth-two lookahead search then uses those probabilities to weigh every future it imagines.",
            {
                flow: [
                    { label: "Battle state", note: "both sides' Pokémon, HP, moves, the last few turns" },
                    { label: "Forecast", note: "Laya gives a probability for each opponent action, 36–84 ms" },
                    { label: "Look ahead", note: "depth-2 expectimax weighs each branch by those odds" },
                    { label: "Move", note: "about 3 s per turn on a laptop" },
                ],
                caption: "One turn of ForeSight.",
            },
            "The training data cost nothing. Saiakhil ran a few thousand battles between simple bots on a local Pokémon Showdown server, logged every decision and fine-tuned only the top four of Laya's 28 layers for about 35 minutes on an Apple laptop.",
            {
                stats: [
                    { value: "72–80%", label: "of opponent moves predicted correctly, up from 43% zero-shot" },
                    { value: "75%", label: "on Abyssal, a benchmark bot it never saw in training" },
                    { value: "56.5%", label: "wins in 200 games against Abyssal, with no LLM" },
                    { value: "$0", label: "in API calls" },
                ],
            },
            "The part we like most is that the forecasts are calibrated. When ForeSight says it's 70% sure, it's right about 70% of the time. That's what makes the probabilities usable inside a search instead of just a guess with a number stuck on it.",
            { figure: "/work/foresight/reliability_laya_gen8.png", alt: "Reliability diagram: forecast probability against observed frequency, close to the diagonal for both held-out bots and Abyssal.", caption: "Calibration of the fine-tuned forecaster. Points near the dashed diagonal mean the stated confidence matches how often it's right." },
            { h: "The honest scoreboard" },
            "56.5% against Abyssal matches PokéLLMon (56%), an agent built on a large language model, and trails PokéChamp (64–70%). Looking one extra turn ahead adds 13 to 20 points over one-step play, which is the clearest effect in the whole project.",
            "There's also a result most papers would quietly leave out. Better forecasts did not turn into more wins. With the same search, a free rule of thumb about damage played at least as well, and even a model that assumed every opponent move was equally likely won 55.5% of its games. The bottleneck turned out to be the rough battle simulator and the shallow search, not the forecaster. We think that's worth knowing, and it's where the next round of work goes.",
            { figure: "/work/foresight/accuracy_breakdown_laya_gen8.png", alt: "Bar charts of top-1 accuracy by turn number and by number of options, well above chance throughout.", caption: "Forecast accuracy by stage of the game and by how many options the opponent had. The black ticks are chance." },
            { h: "How it got here" },
            "ForeSight grew out of a run of small, cheap pilots, each one a single question. Could a small model rerank an LLM agent's moves in the text game ALFWorld? Yes: success went from 34.6% to 48.4%. Could it predict poker actions or human Pokémon players zero-shot? Only partly. Every pilot's result, good or bad, is written up in the repo, along with the cost of every API call they made. None of them cost more than a few dollars.",
            { links: [
                { label: "Code and results", href: "https://github.com/akhilc08/aaai-27", note: "every number in the abstract traces to a file" },
                { label: "The abstract (PDF)", href: "https://github.com/akhilc08/aaai-27/blob/main/paper/paper.pdf" },
            ] },
        ],
    },
    {
        slug: "bridge",
        banner: "/work/bridge/banner.webp",
        accent: "#1c2541",
        title: "Teaching a loan application to read a balance sheet",
        partner: "Bridge",
        when: "Fall 2025",
        tag: "client",
        dek: "Borrowers on Bridge's marketplace used to type their financials in by hand. We built the engine that reads their documents and fills in the form, with a source for every number, and took its accuracy from about half to 85–95%.",
        team: ["Asad Abbas Rizvi", "Arshdeep Kaur", "Yashnil Saha", "Tanner Brendan Blake"],
        body: [
            "[Bridge](https://www.bridge.co) runs a marketplace where businesses ask for financing and lenders respond. Before a lender sees anything, a borrower fills in a long request: company basics, sponsors, and pages of numbers from balance sheets and income statements. Almost all of it is already sitting in documents the borrower has on hand. They just have to type it in again.",
            "Our question for the fall: could the form fill itself in from those documents, accurately enough that a borrower would trust it?",
            { h: "How it feels to use" },
            {
                flow: [
                    { label: "Upload", note: "statements, spreadsheets and decks, plus a few basics" },
                    { label: "Process", note: "the documents are read in the background while the borrower keeps going" },
                    { label: "Review", note: "every field shows its source and how sure we are" },
                    { label: "Submit", note: "accept, edit or reject each one, then send" },
                ],
            },
            "We were strict about that review step. A borrower is putting their name to these numbers, so the tool's job is to save typing, not to have opinions. Every value comes with the line in the document it came from and a confidence score, and nothing gets submitted without a person looking at it.",
            { sketch: "bridge-review", caption: "Illustration of the review screen, with made-up numbers." },
            { h: "The first version got half of it right" },
            "Our first pass did what most first passes do. Parse the documents (we used IBM's Docling, which handles PDFs, spreadsheets, Word files and slides), hand the text to a language model and ask for the fields. Measured against hand-checked answers, it scored between 40 and 52 percent.",
            "Digging through the misses was humbling. The model preferred an old year-end statement over this year's numbers. It copied part of a liability instead of the full amount. When a year-to-date column was empty, it got revenue wrong. And now and then it filled a gap with an \"estimated\" value that wasn't in any document at all.",
            { h: "What got us to 85–95%" },
            "The fix wasn't a bigger model. It was using the model for less. Anything that can be read straight off a table now is, and the language model only handles fields that need some reasoning. After that, ordinary arithmetic checks its work.",
            {
                flow: [
                    { label: "Read tables", note: "cash, receivables, revenue and the like, straight from the cells" },
                    { label: "Ask the model", note: "only for fields that need judgement" },
                    { label: "Clean up", note: "drop invented estimates, rebuild totals from their parts" },
                    { label: "Check the math", note: "assets must equal liabilities plus equity, within $1 or 0.1%" },
                    { label: "Score", note: "confidence goes up when things balance, down sharply when they don't" },
                    { label: "Tidy", note: "45+ messy fields down to 28 clean ones" },
                ],
                caption: "The extraction pipeline after the rewrite.",
            },
            "The balance sheet became our best friend. It has to balance, so it's a free test of whether we read it right. If the total doesn't match its parts, we recompute the parts in proportion and the confidence drops, so the borrower knows to look twice. We also taught it to always prefer the most recent document, which fixed a surprising number of errors on its own.",
            {
                stats: [
                    { value: "40–52% → 85–95%", label: "of fields correct against hand-checked answers" },
                    { value: "67s → ~20s", label: "to process a document" },
                    { value: "45 → 28", label: "fields in the output, without the duplicates and noise" },
                ],
            },
            { h: "Making it fast" },
            "The first version took 67 seconds per document because every request sent the whole document to the model. We considered building full retrieval with embeddings, then realised we didn't need it. Financial fields now only see the tables, and company details only see the opening of each document, where names and addresses live. Smaller inputs meant faster answers, and the answers got better too, because the model had less to wade through. It came out three to four times faster with no vector database to run.",
            { h: "Every number has a receipt" },
            "Underneath, the work is split cleanly. Supabase edge functions handle who and when: logins, uploads, creating jobs. A FastAPI service handles what and why: reading documents, filling the schema, scoring and tracking where each value came from. Every field carries its source document and a confidence score all the way to the screen.",
            "We also started filling in gaps from public data, like SEC filings and company records from People Data Labs, while respecting robots.txt and sticking to public sources. We wanted LinkedIn too. LinkedIn had other ideas.",
            { h: "If you're building something like this" },
            {
                list: [
                    "Read the tables before you write a prompt. A lot of \"AI extraction\" is really just parsing.",
                    "Let arithmetic grade the model. Financial statements come with built-in checks; use them.",
                    "Show your sources. People trust a number they can trace, and they fix the ones that look wrong.",
                ],
            },
        ],
    },
    {
        slug: "quickfi",
        banner: "/work/quickfi/banner.webp",
        accent: "#4e8a1f",
        title: "Taking the paperwork out of equipment finance with QuickFi",
        partner: "QuickFi",
        when: "Spring 2025 – Spring 2026",
        tag: "client",
        dek: "Two agents for QuickFi's lending platform: one that chases, reads and checks borrowers' insurance certificates, and one that vets equipment vendors against public records, sanctions lists and the news.",
        team: ["Merek Kaden Soriano", "David Lee", "Erik Pedersen", "Brandon Xu", "Alex Kozik", "Nicole Luo", "Audrey Lewellen", "Morgan Nelson Stuart", "Zach Riiff", "Arshdeep Kaur", "Jonathan Zhang", "Mateo del Rio Lanse", "Eddie Hu"],
        body: [
            "QuickFi builds an embedded lending platform for business equipment finance, used by equipment makers and banks to offer loans right where the equipment is sold. When we met them in early 2025, two chores were eating their operations team's time, and neither got easier as the business grew.",
            "The first was insurance. Every borrower has to keep commercial insurance on the equipment, and someone had to prove it: email the insurer, wait for a certificate, open the PDF, check it against the contract, update the record, and chase anything missing. The second was vendors. Before QuickFi pays for a piece of equipment, it needs to know the seller is a real, registered business that isn't on a sanctions list or in the news for fraud. That research was slow and different every time.",
            "We built an agent for each.",
            { h: "Insurance certificates, start to finish" },
            {
                flow: [
                    { label: "Request", note: "the agent emails the insurer from a template" },
                    { label: "Watch", note: "a secure inbox is monitored and matched to the borrower" },
                    { label: "Read", note: "an LLM pulls policy type, coverage, dates and equipment" },
                    { label: "Check", note: "against that contract's specific requirements" },
                    { label: "File", note: "stored, the record updated, follow-ups sent if anything's missing" },
                ],
                caption: "When a certificate arrives, everything after it happens without a person in the loop.",
            },
            { sketch: "quickfi-insurance", caption: "Illustration of a certificate check, with made-up details." },
            "The hard part was variety. Every insurer formats certificates differently, so the reader needed fallback strategies for when the first approach came back confused. Email is messy too: attachments go missing and replies arrive out of order, so every step had to fail gracefully rather than drop a borrower on the floor. It all runs on Flask and Supabase.",
            { h: "Vendor checks, all at once" },
            "For vendors the agent runs a set of independent checks and pulls the results into one risk report for the team to review.",
            { sketch: "quickfi-vendor", caption: "Illustration of a vendor report, with a made-up vendor." },
            "Secretary of State websites were our nemesis. Every state's is different, and they change without warning, so each needed its own scraper and some upkeep. Names were the other headache: \"Acme Equipment Inc.\" in one database is \"ACME EQUIPMENT, INCORPORATED\" in another, so we wrote fuzzy matching to decide when two records are the same company. Google and Dun & Bradstreet both have rate limits, which taught us a lot about batching and retries.",
            "One check we're particularly happy with looks for conflicts of interest, such as a borrower buying equipment from a company they also own.",
            { h: "Who built what" },
            {
                people: [
                    { name: "Merek Soriano", did: "led the insurance project" },
                    { name: "Erik Pedersen", did: "built the certificate validator that classifies certificates and checks them against QuickFi's standards; set up storage and the glue between email, validation and the backend" },
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
            { h: "Round two" },
            "QuickFi asked us back. In spring 2026 Mateo, Brandon and Eddie picked the vendor pipeline up again to keep extending it. It's nice when the thing you built gets used enough that people want more of it.",
            { links: [{ label: "Read the original case study (PDF)", href: "https://drive.google.com/file/d/1Pu6QSW2ClZg3em3bRcolzeS73srP9z-p/view" }] },
        ],
    },
    {
        slug: "for-cornell",
        banner: "/work/for-cornell/banner.webp",
        accent: "#b31b1b",
        title: "Two small tools for the people around us",
        partner: "For the Cornell community",
        when: "Summer – Fall 2026",
        tag: "open source",
        dek: "cu25 lets you (or an agent) book a Cornell room or a library study space from the terminal. Reckon Review won't let a pull request merge until a person can explain what it does. Both are free and open source.",
        team: ["Asad Abbas Rizvi"],
        body: [
            "Not everything we build has a client. Some of it starts with an annoyance on campus or in our own repos. These two started that way, and both are free for anyone to use.",
            { h: "cu25: booking a room without the form" },
            "If you've ever run a club at Cornell, you know the room request form. It's long, the questions change depending on your earlier answers (yes, there will be pizza; no, there will not be alcohol), and it wants two days' notice you didn't realise you needed. Meanwhile, booking a study room in Olin is a different website entirely.",
            "cu25 puts both behind one tool. It's a command line program and an MCP server, so you can run it yourself or hand it to an AI agent. The first thing it does is work out which system you actually need: a library study space for studying or a small group, or a 25Live request for an organization's event.",
            { sketch: "cu25-chat", caption: "Illustration of an agent using cu25. The room, questions and reference are examples." },
            "A few rules shaped everything else.",
            {
                rows: [
                    { label: "Read, don't hard-code", body: "The form's fields, questions, follow-up rules and date limits are read live from 25Live, which has 164 form rules at last count. If the form changes, cu25 notices and says so instead of quietly submitting something wrong." },
                    { label: "Ask, don't guess", body: "When something's missing, cu25 returns the question in the form's own words and options, so the agent asks you. It never invents an answer about food, guests or alcohol." },
                    { label: "Preview, then confirm", body: "Submitting without a confirmation code only shows you exactly what would be sent. The code is a fingerprint of that exact request, so what you approved is what goes out." },
                    { label: "Nothing stored", body: "You log in once in your own browser with NetID and Duo. There's no server and no saved password, and requests stay Tentative until a real scheduler approves them." },
                ],
            },
            "Library spaces in Olin, Uris, Catherwood, Mann and Carpenter need no login at all. cu25 lists what's free first, with each space's open times, and books it under your own name and Cornell email.",
            "To make sure it behaves exactly like the website, the tests replay real, sanitised 25Live and library responses. One test copies a past event, walks it through check, preview and confirm, and checks that the request cu25 sends matches what the browser sent, field for field.",
            { h: "Reckon Review: explain what you merge" },
            "More and more of the code we ship is written with AI, in classes, on project teams and in client repos. AI reviewers are good at asking whether the code is right. Nobody was asking whether the person merging it understands it.",
            "Reckon Review is a GitHub App that does. When a pull request opens, it breaks the change into the two to four decisions that actually matter and blocks the merge. Someone with write access replies in their own words, explaining how it works rather than restating the diff. A separate model grades the answer. If it's there, the check goes green. If not, Reckon names the one gap and you take another pass.",
            {
                flow: [
                    { label: "PR opens", note: "written by anyone, or anything" },
                    { label: "Find the decisions", note: "2–4 that matter, using a map of how the change fits the codebase" },
                    { label: "Explain", note: "a reviewer replies in their own words" },
                    { label: "Graded", note: "pass: merge unblocked. Not yet: it names the one gap" },
                ],
            },
            { sketch: "reckon-check", caption: "Illustration of Reckon on a pull request. The change and the replies are examples." },
            "It tries hard not to be annoying. Docs, lockfiles and tiny diffs pass on their own, and so do changes that only touch styles, assets, tests or config. Changes to code that lots of other files depend on get graded more strictly. If you push a typo fix after passing and the decisions haven't changed, your pass carries over.",
            "It also tries hard not to keep anything. To work out what's load-bearing, Reckon reads the repo at the PR's head and builds a map of what references what. That map lives in memory for a few seconds and is thrown away. It stores no source code.",
            { h: "Use them" },
            "Both are in beta and we'd love to hear where they trip up. Open an issue, or find us at a meeting.",
            { links: [
                { label: "cu25 on GitHub", href: "https://github.com/Archdiner/25live-mcp", note: "pip install, then cu25 login" },
                { label: "Reckon Review on GitHub", href: "https://github.com/Archdiner/reckon-review" },
                { label: "Install Reckon Review", href: "https://github.com/apps/reckon-review/installations/new", note: "free during the beta" },
            ] },
        ],
    },
];

const WPM = 230;

export function readMinutes(post: Post) {
    const text = [post.dek, ...post.body.map((b) => (typeof b === "string" ? b : JSON.stringify(b)))].join(" ");
    return Math.max(1, Math.round(text.split(/\s+/).length / WPM));
}
