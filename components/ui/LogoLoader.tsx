import { cn } from "@/lib/utils";

// SVG animation is used because the mobile rules in globals.css disable CSS
// animation, and it also runs before hydration on streamed loading routes.
const LOOP = "1.4s";
const APPEAR = { begin: "0.3s", dur: "0.2s" };
const DIM = 0.18;

const RISER = "5,44 16,44 44,4 33,4";
const ARMS = ["7,15 18,15 19.95,17.79 14.45,25.64", "23.35,38.36 28.85,30.5 38.3,44 27.3,44"];
// Each slice overlaps the next so no seam shows across the lit stroke.
const RISER_SLICES = [
  "5,44 16,44 22.02,35.4 11.02,35.4",
  "10.6,36 21.6,36 27.62,27.4 16.62,27.4",
  "16.2,28 27.2,28 33.22,19.4 22.22,19.4",
  "21.8,20 32.8,20 38.82,11.4 27.82,11.4",
  "27.4,12 38.4,12 44,4 33,4",
];

const repeat = { attributeName: "opacity", dur: LOOP, repeatCount: "indefinite" };

const ARM_PULSE = { ...repeat, values: `${DIM};1;1;${DIM}`, keyTimes: "0;0.12;0.82;1" };
// The lit slices fade out as one group, so their overlaps never show.
const RISER_FADE = { ...repeat, values: "1;1;0;0", keyTimes: "0;0.82;0.98;1" };

function sliceRise(start: number) {
  return { ...repeat, values: "0;0;1;1", keyTimes: `0;${start};${start + 0.12};1` };
}

function Appear({ children }: { children: React.ReactNode }) {
  return (
    <g opacity="0">
      <animate attributeName="opacity" from="0" to="1" fill="freeze" {...APPEAR} />
      {children}
    </g>
  );
}

export function LogoLoader({
  size = 48,
  label = "Loading",
  className,
}: {
  size?: number;
  label?: string;
  className?: string;
}) {
  return (
    <span role="status" className={cn("inline-flex", className)}>
      <span className="sr-only">{label}</span>
      <svg
        aria-hidden="true"
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="currentColor"
        className="motion-reduce:hidden"
      >
        <Appear>
          <polygon points={RISER} opacity={DIM} />
          {ARMS.map((points) => (
            <polygon key={points} points={points} opacity={DIM}>
              <animate {...ARM_PULSE} />
            </polygon>
          ))}
          <g>
            <animate {...RISER_FADE} />
            {RISER_SLICES.map((points, i) => (
              <polygon key={points} points={points} opacity={0}>
                <animate {...sliceRise(0.1 + i * 0.1)} />
              </polygon>
            ))}
          </g>
        </Appear>
      </svg>
      <svg
        aria-hidden="true"
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="currentColor"
        className="hidden motion-reduce:block"
      >
        <Appear>
          <polygon points={RISER} />
          {ARMS.map((points) => (
            <polygon key={points} points={points} />
          ))}
        </Appear>
      </svg>
    </span>
  );
}
