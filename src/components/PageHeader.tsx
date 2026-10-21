import GrainField from "./GrainField";
import Corners from "./Corners";
import { MaskLines, Reveal } from "./Reveal";

export default function PageHeader({
    index,
    title,
    meta,
    intro,
    palette,
    seed = 0,
    pixel = 1,
}: {
    index: string;
    title: string;
    meta: string;
    intro: React.ReactNode;
    palette: readonly string[];
    seed?: number;
    pixel?: number;
}) {
    return (
        <>
            <section className="px-2 pt-14 md:px-3">
                <div className="relative h-[52svh] min-h-[380px] overflow-hidden rounded-[18px] text-paper">
                    <GrainField palette={palette} seed={seed} pixel={pixel} grain={pixel > 1 ? 0.35 : 0.24} scale={0.3} speed={0.8} />
                    <Corners className="text-paper/90" />
                    <div className="label absolute inset-x-0 top-0 flex h-[52px] items-center justify-between border-b border-paper/15 px-6 text-paper/80">
                        <span>({index})</span>
                        <span>{meta}</span>
                    </div>
                    <h1 className="absolute bottom-5 left-5 text-[clamp(4rem,15vw,15rem)] font-medium leading-[0.8] tracking-[-0.06em] md:bottom-6 md:left-6">
                        <MaskLines lines={[title]} delay={0.05} />
                    </h1>
                </div>
            </section>
            <section className="mx-auto grid grid-cols-12 gap-4 px-4 pt-16 md:px-6 md:pt-24">
                <Reveal delay={0.3} className="col-span-12 text-[clamp(1.5rem,2.6vw,2.5rem)] font-medium leading-[1.08] tracking-[-0.03em] md:col-span-8 md:col-start-5">
                    {intro}
                </Reveal>
            </section>
        </>
    );
}
