import type { Metadata } from "next";
import SubPage from "@/components/SubPage";
import Recruiting from "@/components/Recruiting";
import Banner from "@/components/Banner";

export const metadata: Metadata = { title: "Get Involved" };

export default function GetInvolvedPage() {
    return (
        <SubPage
            title="Get Involved"
            banner={<Banner src="/brand/campus.webp" alt="Cornell campus in the fall" title="Get involved" />}
            intro="We recruit engineers, product managers, and designers every semester. Applicants build an AI project over three weeks.">
            <Recruiting />
        </SubPage>
    );
}
