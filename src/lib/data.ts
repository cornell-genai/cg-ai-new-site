// Single source of truth for site content. Update this file each semester.

export const CONTACT_EMAIL = "admin@cornellgenai.dev";
export const GITHUB_URL = "https://github.com/cornell-genai";
/**
 * Where the mailing-list form posts (a field named "email"), e.g. Buttondown's
 * "https://buttondown.com/api/emails/embed-subscribe/<username>". Until it is
 * set, the form opens a pre-filled email to CONTACT_EMAIL instead.
 */
export const NEWSLETTER_URL = "";

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
    { name: "Alex Kozik", image: "/team/alex.webp", linkedIn: "https://www.linkedin.com/in/alex-kozik/" },
    { name: "Jacob Phelan", role: "YC Founder", linkedIn: "https://www.linkedin.com/in/jacob-phelan-9359222a5" },
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
