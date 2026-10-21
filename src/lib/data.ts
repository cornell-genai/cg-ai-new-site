// Single source of truth for site content. Update this file each semester.

export const CONTACT_EMAIL = "admin@cornellgenai.dev";
export const GITHUB_URL = "https://github.com/Cornell-Gen-AI";

export type Team = "E-Board" | "Admin" | "Engineering";

export type Member = {
    name: string;
    role: string;
    team: Team;
    image?: string;
    linkedIn?: string;
};

export const MEMBERS: Member[] = [
    { name: "Daniel Sachs", role: "Founding President", team: "E-Board", image: "/team/daniel.webp", linkedIn: "https://www.linkedin.com/in/daniel-m-sachs/" },
    { name: "Erik Pedersen", role: "Vice President", team: "E-Board", image: "/team/erik.webp", linkedIn: "https://www.linkedin.com/in/erikzhangpedersen/" },
    { name: "Morgan Stuart", role: "Lead Engineer + NME Chair", team: "E-Board", image: "/team/morgan.webp", linkedIn: "https://www.linkedin.com/in/morgan-nstuart/" },
    { name: "Merek Soriano", role: "Head of Corporate Partnerships", team: "E-Board", image: "/team/merek.webp", linkedIn: "https://www.linkedin.com/in/merek-soriano-0ba570291/" },
    { name: "David Lee", role: "Head of Product", team: "E-Board", image: "/team/david.webp", linkedIn: "https://www.linkedin.com/in/dave-lee-716318242/" },

    { name: "Mahdi Choudhury", role: "Treasurer", team: "Admin", image: "/team/mahdi.webp", linkedIn: "https://www.linkedin.com/in/mahdi-choudhury-h/" },
    { name: "Akul Maheshwari", role: "DEI Chair", team: "Admin", image: "/team/akul.webp", linkedIn: "https://www.linkedin.com/in/akul-maheshwari/" },

    { name: "Bhavan Sai Balusu", role: "Credit Document AI", team: "Engineering" },
    { name: "Surya Chandrakasan", role: "Credit Document AI", team: "Engineering" },
    { name: "Trishia Khandelwal", role: "Credit Document AI", team: "Engineering" },
    { name: "Thurushi Kiyara Rajapakse", role: "Credit Document AI", team: "Engineering", image: "/team/thurushi.webp", linkedIn: "https://www.linkedin.com/in/thurushi-rajapakse" },
    { name: "Aleks Dzudzevic", role: "Credit Document AI", team: "Engineering", image: "/team/alek.webp" },
    { name: "Brandon Xu", role: "Vendor Due Diligence AI", team: "Engineering", image: "/team/brandon.webp", linkedIn: "https://www.linkedin.com/in/brandon-xu-284748322/" },
    { name: "Eddie Hu", role: "Vendor Due Diligence AI", team: "Engineering" },
    { name: "Audrey Lewellen", role: "Vendor Due Diligence AI", team: "Engineering", image: "/team/audrey.webp", linkedIn: "https://www.linkedin.com/in/audrey-lewellen-686823355/" },
    { name: "Mateo del Rio Lanse", role: "Vendor Due Diligence AI", team: "Engineering", image: "/team/mateo.webp", linkedIn: "https://www.linkedin.com/in/mdelriolanse" },
    { name: "Nicole Luo", role: "Invoice AI Analysis", team: "Engineering", image: "/team/nicole.webp", linkedIn: "https://www.linkedin.com/in/nicoleluo7/" },
    { name: "Pratyush Saxena", role: "Invoice AI Analysis", team: "Engineering" },
    { name: "Anmol Karan", role: "Invoice AI Analysis", team: "Engineering", image: "/team/anmol.webp" },
    { name: "Christina Maria Joseph", role: "Invoice AI Analysis", team: "Engineering" },
    { name: "Lauren Amelie Ah-Hot", role: "Invoice AI Analysis", team: "Engineering" },
    { name: "Zahrizhal Ali, Jr", role: "QuickFi", team: "Engineering" },
    { name: "Dhruv Mandalik", role: "Vero", team: "Engineering" },
    { name: "Zach Riiff", role: "Vero", team: "Engineering", image: "/team/zach.webp", linkedIn: "https://www.linkedin.com/in/zach-riiff-828018325/" },
    { name: "Alex Kozik", role: "Vero", team: "Engineering", image: "/team/alex.webp", linkedIn: "https://www.linkedin.com/in/alex-kozik/" },
    { name: "Rei Meguro", role: "Vero", team: "Engineering" },
    { name: "Yashnil Saha", role: "Bridge", team: "Engineering" },
    { name: "Asad Abbas Rizvi", role: "Bridge", team: "Engineering", image: "/team/asad.webp", linkedIn: "https://www.linkedin.com/in/asad-rizvi-02a1782a2" },
    { name: "Tanner Brendan Blake", role: "Bridge", team: "Engineering" },
    { name: "Arshdeep Kaur", role: "Bridge", team: "Engineering", image: "/team/arshdeep.webp", linkedIn: "https://www.linkedin.com/in/arshdeepkaur13/" },
];

export const TEAMS: Team[] = ["E-Board", "Admin", "Engineering"];

// Active build teams, derived from engineering roles so the two never drift.
export const ACTIVE_BUILDS = Array.from(
    MEMBERS.filter((m) => m.team === "Engineering").reduce((acc, m) => {
        acc.set(m.role, [...(acc.get(m.role) ?? []), m]);
        return acc;
    }, new Map<string, Member[]>()),
).map(([name, members]) => ({ name, members }));

export type Project = {
    slug: string;
    title: string;
    partner: string;
    status: "Shipped" | "In development";
    description: string;
    link?: string;
};

export const PROJECTS: Project[] = [
    {
        slug: "classgpt",
        title: "ClassGPT",
        partner: "Cornell",
        status: "In development",
        description:
            "A Cornell-exclusive platform that lets professors set up AI tutors grounded in their own course material. Students join supported classes and get tutoring tailored to what they're being taught.",
    },
    {
        slug: "insurance-verification",
        title: "Insurance Verification Agent",
        partner: "QuickFi",
        status: "Shipped",
        description:
            "Reaches out to insurance providers, requests commercial certificates, validates contract-specific coverage, handles follow-ups, and files every document tagged for compliance.",
        link: "https://drive.google.com/file/u/0/d/1Pu6QSW2ClZg3em3bRcolzeS73srP9z-p/view",
    },
    {
        slug: "vendor-due-diligence",
        title: "Vendor Due Diligence",
        partner: "QuickFi",
        status: "Shipped",
        description:
            "Verifies vendors by cross-referencing public business records, risk databases, and online presence, then flags high-risk scores, inactive registrations, or adverse news for review.",
        link: "https://drive.google.com/file/u/0/d/1Pu6QSW2ClZg3em3bRcolzeS73srP9z-p/view",
    },
];

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
