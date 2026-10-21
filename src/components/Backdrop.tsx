import Halftone from "./Halftone";

// The faint halftone field behind every page.
export default function Backdrop() {
    return (
        <div aria-hidden className="pointer-events-none fixed inset-0 -z-0 opacity-80">
            <Halftone pitch={8} fade="edges" seed={3} tones={["#aab2f6", "#c4c9f8", "#d9dcfa", "#e6e8fb"]} />
        </div>
    );
}
