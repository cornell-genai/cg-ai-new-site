import type { Metadata } from "next";
import SubPage from "@/components/SubPage";
import Recruiting from "@/components/Recruiting";

export const metadata: Metadata = { title: "Get Involved" };

export default function GetInvolvedPage() {
    return (
        <SubPage title="Get Involved" intro="We recruit engineers, product managers, and designers every semester. Applicants build an AI project over three weeks.">
            <Recruiting />
        </SubPage>
    );
}
