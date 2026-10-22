// Single source of truth for site content. Update this file each semester.

export const CONTACT_EMAIL = "admin@cornellgenai.dev";
export const GITHUB_URL = "https://github.com/Cornell-Gen-AI";

export type Team = "Board" | "Members" | "Business" | "Alumni";

export type Member = {
    name: string;
    role?: string;
    team: Team;
    image?: string;
    linkedIn?: string;
};

const board: Member[] = [
    { name: "Morgan Nelson Stuart", role: "President", image: "/team/morgan.webp", linkedIn: "https://www.linkedin.com/in/morgan-nstuart/" },
    { name: "Asad Abbas Rizvi", role: "Vice President", image: "/team/asad.webp", linkedIn: "https://www.linkedin.com/in/asad-rizvi-02a1782a2" },
    { name: "Merek Kaden Soriano", role: "Head of Business", image: "/team/merek.webp", linkedIn: "https://www.linkedin.com/in/merek-soriano-0ba570291/" },
    { name: "Charlie Xue", role: "Head Engineer" },
    { name: "Saiakhil Chilaka", role: "Head Engineer" },
    { name: "JD Krasnik", role: "Head of Research" },
].map((m) => ({ ...m, team: "Board" as const }));

const members: Member[] = [
    { name: "Surya Chandrakasan" },
    { name: "Pratyush Saxena" },
    { name: "Anmol Karan", image: "/team/anmol.webp" },
    { name: "Yashnil Saha" },
    { name: "Trishia Khandelwal" },
    { name: "Bhavan Sai Balusu" },
    { name: "Arshdeep Kaur", image: "/team/arshdeep.webp", linkedIn: "https://www.linkedin.com/in/arshdeepkaur13/" },
    { name: "Daniel Sachs", role: "Founding Member", image: "/team/daniel.webp", linkedIn: "https://www.linkedin.com/in/daniel-m-sachs/" },
    { name: "Krish Jana" },
    { name: "Mihir Joshi" },
    { name: "Aritro Ganguly" },
    { name: "Ashwin Aggarwal" },
    { name: "Sarah Li" },
    { name: "Andrew Visconti" },
    { name: "Aiden Chung" },
    { name: "Ryan Ginsburg" },
    { name: "Chris Jia" },
    { name: "Oduna Akonzee" },
    { name: "Hendry Xu" },
    { name: "Avinash Senthil" },
    { name: "Saanvi Movva" },
    { name: "Idhant Gode" },
    { name: "Caden Ruan" },
    { name: "Andy Do" },
    { name: "Winston Wang" },
    { name: "Kona Sullivan" },
    { name: "Alexei Manuel" },
    { name: "David Lee", image: "/team/david.webp", linkedIn: "https://www.linkedin.com/in/dave-lee-716318242/" },
    { name: "Audrey Lewellen", image: "/team/audrey.webp", linkedIn: "https://www.linkedin.com/in/audrey-lewellen-686823355/" },
].map((m) => ({ ...m, team: "Members" as const }));

const business: Member[] = [
    { name: "Mohammad Mustafa Shoukat" },
    { name: "Kaelin Braverman" },
    { name: "Breanna Eng" },
].map((m) => ({ ...m, team: "Business" as const }));

const alumni: Member[] = [
    { name: "Erik Pedersen", image: "/team/erik.webp", linkedIn: "https://www.linkedin.com/in/erikzhangpedersen/" },
    { name: "Mahdi Choudhury", image: "/team/mahdi.webp", linkedIn: "https://www.linkedin.com/in/mahdi-choudhury-h/" },
    { name: "Akul Maheshwari", image: "/team/akul.webp", linkedIn: "https://www.linkedin.com/in/akul-maheshwari/" },
    { name: "Thurushi Kiyara Rajapakse", image: "/team/thurushi.webp", linkedIn: "https://www.linkedin.com/in/thurushi-rajapakse" },
    { name: "Aleks Dzudzevic", image: "/team/alek.webp" },
    { name: "Brandon Xu", image: "/team/brandon.webp", linkedIn: "https://www.linkedin.com/in/brandon-xu-284748322/" },
    { name: "Eddie Hu" },
    { name: "Mateo del Rio Lanse", image: "/team/mateo.webp", linkedIn: "https://www.linkedin.com/in/mdelriolanse" },
    { name: "Nicole Luo", image: "/team/nicole.webp", linkedIn: "https://www.linkedin.com/in/nicoleluo7/" },
    { name: "Christina Maria Joseph" },
    { name: "Lauren Amelie Ah-Hot" },
    { name: "Zahrizhal Ali, Jr" },
    { name: "Dhruv Mandalik" },
    { name: "Zach Riiff", image: "/team/zach.webp", linkedIn: "https://www.linkedin.com/in/zach-riiff-828018325/" },
    { name: "Alex Kozik", image: "/team/alex.webp", linkedIn: "https://www.linkedin.com/in/alex-kozik/" },
    { name: "Rei Meguro" },
    { name: "Tanner Brendan Blake" },
].map((m) => ({ ...m, team: "Alumni" as const }));

export const MEMBERS: Member[] = [...board, ...members, ...business, ...alumni];
export const CURRENT_MEMBERS = MEMBERS.filter((m) => m.team !== "Alumni");
export const TEAMS: Team[] = ["Board", "Members", "Business", "Alumni"];

export type Project = {
    slug: string;
    title: string;
    partner: string;
    area: "Research" | "Engineering" | "Frontier";
    summary: string;
    /** Link to the blog post or demo once published. */
    link?: string;
};

// This semester. Demos get published as they ship.
export const CURRENT: Project[] = [
    {
        slug: "microduck",
        title: "Microduck",
        partner: "Pollen Robotics",
        area: "Frontier",
        summary: "Open-source contributions and reinforcement learning on Pollen Robotics' Microduck robot.",
    },
    {
        slug: "trading-agent",
        title: "Trading agent",
        partner: "Internal",
        area: "Frontier",
        summary: "An autonomous trading agent we're building to run live.",
    },
    {
        slug: "long-horizon-agents",
        title: "Long-horizon agents",
        partner: "Research",
        area: "Research",
        summary: "Research on getting agents to hold up over long, multi-step tasks.",
    },
];

// Past work, written up as blog posts.
export const PAST: Project[] = [
    {
        slug: "cisco-red-teaming",
        title: "Agentic red teaming",
        partner: "Cisco",
        area: "Engineering",
        summary: "Agents that probe AI systems for vulnerabilities.",
    },
    {
        slug: "investcorp-esg",
        title: "ESG news monitoring",
        partner: "Investcorp",
        area: "Engineering",
        summary: "Monitoring news for ESG signals across a portfolio.",
    },
    {
        slug: "nysfp-data",
        title: "Data aggregation & maintenance",
        partner: "NYSFP",
        area: "Engineering",
        summary: "An automated data aggregator and service maintainer.",
    },
    {
        slug: "quickfi-insurance",
        title: "Insurance verification agent",
        partner: "QuickFi",
        area: "Engineering",
        summary: "Requests, reads, and validates commercial insurance certificates.",
        link: "https://drive.google.com/file/u/0/d/1Pu6QSW2ClZg3em3bRcolzeS73srP9z-p/view",
    },
    {
        slug: "quickfi-vendors",
        title: "Vendor due diligence",
        partner: "QuickFi",
        area: "Engineering",
        summary: "Automated vendor checks across public records and risk data.",
        link: "https://drive.google.com/file/u/0/d/1Pu6QSW2ClZg3em3bRcolzeS73srP9z-p/view",
    },
];

export type Partner = { name: string; logo?: string; /** Logo height in px; wide wordmarks sit smaller. */ h?: number; /** Show the name beside a mark-only logo. */ label?: boolean };

export const PARTNERS: Partner[] = [
    { name: "Cisco", logo: "/logos/cisco.png", h: 30 },
    { name: "Investcorp", logo: "/logos/investcorp.png", h: 15 },
    { name: "QuickFi", logo: "/logos/quickfi.png", h: 26 },
    { name: "Pollen Robotics", logo: "/logos/pollen.svg", h: 30, label: true },
    { name: "Bridge", logo: "/logos/bridge.png", h: 24 },
    { name: "Charter", logo: "/logos/charter.png", h: 26 },
    { name: "Vero", logo: "/logos/vero.png", h: 26 },
    { name: "Gradial" },
    { name: "NYSFP" },
];

export const partner = (name: string) => PARTNERS.find((p) => p.name === name);

export const RECRUITING = {
    cycle: "Spring 2026",
    timeline: [
        { date: "2026-01-20", label: "Coffee chats open" },
        { date: "2026-01-21", label: "Applications open" },
        { date: "2026-01-25", label: "Club Fest" },
        { date: "2026-01-29", label: "Info session", location: "Stimson Hall" },
        { date: "2026-02-01", label: "Info session", location: "Gates Hall G01" },
        { date: "2026-02-07", label: "Applications due" },
    ],
    tracks: [
        {
            title: "Engineering",
            blurb: "Build AI products with partners like QuickFi, Charter, and Cisco.",
            lookingFor: ["Software or ML experience", "Projects you've built"],
            url: "https://docs.google.com/forms/d/e/1FAIpQLSczHtve7uF-9Vm6RsD28WlanNAmP8ORY1jg9hk9pveuuJwe-Q/viewform",
        },
        {
            title: "Design & Marketing",
            blurb: "Brand, content, and community.",
            lookingFor: ["Design or content portfolio", "Clear communication"],
            url: "https://forms.gle/DRq6W7sHwkhnjn7x5",
        },
    ],
    coffeeChatUrl:
        "https://docs.google.com/forms/d/e/1FAIpQLSeT6zY3ZnLLzLh00GOcP-MQwYadRs49YOLukcxny0kytQCyAg/viewform",
    faq: [
        {
            q: "Who we look for",
            a: "Drive, then technical depth, then fit.",
        },
        {
            q: "The application",
            a: "Build an AI application in three weeks. Any idea.",
        },
        {
            q: "Commitment",
            a: "Small teams, one partner project per semester.",
        },
    ],
};
