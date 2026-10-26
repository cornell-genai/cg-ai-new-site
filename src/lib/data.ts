// Single source of truth for site content. Update this file each semester.

export const CONTACT_EMAIL = "admin@cornellgenai.dev";
export const GITHUB_URL = "https://github.com/cornell-genai";
/**
 * Where the mailing-list form posts (a field named "email"), e.g. Buttondown's
 * "https://buttondown.com/api/emails/embed-subscribe/<username>". Until it is
 * set, the form opens a pre-filled email to CONTACT_EMAIL instead.
 */
export const NEWSLETTER_URL = "";
/** Member count shown on the home page. Set by hand: the roster below isn't complete. */
export const MEMBER_COUNT = "40+";

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
    { name: "Charlie Xue", role: "Head Engineer", image: "/team/charlie.webp" },
    { name: "Saiakhil Chilaka", role: "Head Engineer", image: "/team/saiakhil.webp" },
    { name: "JD Krasnick", role: "Head of Research", image: "/team/jd.webp" },
].map((m) => ({ ...m, team: "Board" as const }));

const members: Member[] = [
    { name: "Surya Chandrakasan", image: "/team/surya.webp" },
    { name: "Pratyush Saxena", image: "/team/pratyush.webp" },
    { name: "Anmol Karan", image: "/team/anmol.webp" },
    { name: "Yashnil Saha", image: "/team/yashnil.webp" },
    { name: "Trishia Khandelwal", image: "/team/trishia.webp" },
    { name: "Bhavan Sai Balusu", image: "/team/bhavan.webp" },
    { name: "Arshdeep Kaur", image: "/team/arshdeep.webp", linkedIn: "https://www.linkedin.com/in/arshdeepkaur13/" },
    { name: "Daniel Sachs", role: "Founding Member", image: "/team/daniel.webp", linkedIn: "https://www.linkedin.com/in/daniel-m-sachs/" },
    { name: "Krish Jana", image: "/team/krish.webp" },
    { name: "Mihir Joshi", image: "/team/mihir.webp" },
    { name: "Aritro Ganguly", image: "/team/aritro.webp" },
    { name: "Ashwin Aggarwal", image: "/team/ashwin.webp" },
    { name: "Sarah Li", image: "/team/sarah.webp" },
    { name: "Andrew Visconti", image: "/team/andrew.webp" },
    { name: "Aiden Chung", image: "/team/aiden.webp" },
    { name: "Ryan Ginsburg", image: "/team/ryan.webp", linkedIn: "https://www.linkedin.com/in/ryan-ginsburg-91404026b/" },
    { name: "Chris Jia", linkedIn: "https://www.linkedin.com/in/chris-jia1/" },
    { name: "Oduna Akonzee", image: "/team/oduna.webp", linkedIn: "https://www.linkedin.com/in/oduna-akonzee-4b93782a3/" },
    { name: "Hendry Xu", image: "/team/hendry.webp", linkedIn: "https://www.linkedin.com/in/hendryxu/" },
    { name: "Avinash Senthil", linkedIn: "https://www.linkedin.com/in/avinash-senthil-a81375299/" },
    { name: "Saanvi Movva", image: "/team/saanvi.webp" },
    { name: "Idhant Gode", linkedIn: "https://www.linkedin.com/in/idhant-gode/" },
    { name: "Caden Ruan", image: "/team/caden.webp", linkedIn: "https://www.linkedin.com/in/cadenruan3/" },
    { name: "Andy Do", image: "/team/andy.webp", linkedIn: "https://www.linkedin.com/in/andybdo/" },
    { name: "Winston Wang", image: "/team/winston.webp", linkedIn: "https://www.linkedin.com/in/winstonawang/" },
    { name: "Kona Sullivan", image: "/team/kona.webp", linkedIn: "https://www.linkedin.com/in/kona-sullivan/" },
    { name: "Alexei Manuel", image: "/team/alexei.webp", linkedIn: "https://www.linkedin.com/in/alexeimanuel/" },
    { name: "David Lee", image: "/team/david.webp", linkedIn: "https://www.linkedin.com/in/dave-lee-716318242/" },
    { name: "Audrey Lewellen", image: "/team/audrey.webp", linkedIn: "https://www.linkedin.com/in/audrey-lewellen-686823355/" },
].map((m) => ({ ...m, team: "Members" as const }));

const business: Member[] = [
    { name: "Mohammad Mustafa Shoukat", linkedIn: "https://www.linkedin.com/in/mohammad-mustafa-shoukat-534b0020b/" },
    { name: "Kaelin Braverman", image: "/team/kaelin.webp", linkedIn: "https://www.linkedin.com/in/kaelin-braverman/" },
    { name: "Breanna Eng", image: "/team/breanna.webp", linkedIn: "https://www.linkedin.com/in/breannaeng/" },
].map((m) => ({ ...m, team: "Business" as const }));

const alumni: Member[] = [
    { name: "Erik Pedersen", role: "Ex Vice President", image: "/team/erik.webp", linkedIn: "https://www.linkedin.com/in/erikzhangpedersen/" },
    { name: "Alex Kozik", image: "/team/alex.webp", linkedIn: "https://www.linkedin.com/in/alex-kozik/" },
    { name: "Jacob Phelan", role: "YC Founder", image: "/team/jacob.webp", linkedIn: "https://www.linkedin.com/in/jacob-phelan-9359222a5" },
    { name: "Thurushi Kiyara Rajapakse", image: "/team/thurushi.webp", linkedIn: "https://www.linkedin.com/in/thurushi-rajapakse" },
    { name: "Christina Maria Joseph", image: "/team/christina.webp", linkedIn: "https://www.linkedin.com/in/christinamjoseph" },
    { name: "Brandon Xu", image: "/team/brandon.webp", linkedIn: "https://www.linkedin.com/in/brandon-xu-284748322/" },
    { name: "Mateo del Rio Lanse", image: "/team/mateo.webp", linkedIn: "https://www.linkedin.com/in/mdelriolanse" },
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
