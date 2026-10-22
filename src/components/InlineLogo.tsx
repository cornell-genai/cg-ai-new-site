import { partner } from "@/lib/data";

// A partner's logo set inline with running text, sized to the line. Falls
// back to the name when there's no logo.
export default function InlineLogo({ name }: { name: string }) {
    const p = partner(name);
    if (!p?.logo) return <span className="text-white">{name}</span>;
    const scale = (p.h ?? 26) / 26;
    return (
        <span className="mx-[0.12em] inline-flex items-center gap-[0.25em] whitespace-nowrap align-[-0.12em] text-white" title={p.name}>
            <img
                src={p.logo}
                alt={p.label ? "" : p.name}
                style={{ height: `${0.82 * scale}em` }}
                className="inline-block w-auto"
            />
            {p.label && <span>{p.name}</span>}
        </span>
    );
}
