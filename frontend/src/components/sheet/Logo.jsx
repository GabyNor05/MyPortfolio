import React from "react";

// d20 outline with GN and a small cross, in the current accent colour.
// variant "inside": cross above the GN. variant "steeple": cross rising from the top point.
export default function Logo({ size = 96, variant = "inside" }) {
  const steeple = variant === "steeple";
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" role="img" aria-label="GN logo">
      <g transform={steeple ? "translate(0 9) scale(1 .91)" : undefined}>
        <polygon points="50,5 91,28 91,72 50,95 9,72 9,28" stroke="currentColor" strokeWidth="3.5" strokeLinejoin="round" />
        <g stroke="currentColor" strokeWidth="2" opacity=".5" strokeLinejoin="round" strokeLinecap="round">
          <polyline points="28,60 72,60 50,95 28,60" /><line x1="9" y1="28" x2="28" y2="60" /><line x1="91" y1="28" x2="72" y2="60" />
          {!steeple && <><line x1="50" y1="5" x2="28" y2="60" /><line x1="50" y1="5" x2="72" y2="60" /></>}
        </g>
      </g>
      {steeple
        ? <g stroke="currentColor" strokeWidth="3.5" strokeLinecap="round"><line x1="50" y1="0" x2="50" y2="16" /><line x1="44" y1="5" x2="56" y2="5" /></g>
        : <g stroke="currentColor" strokeWidth="3.5" strokeLinecap="round"><line x1="50" y1="17" x2="50" y2="42" /><line x1="40" y1="25" x2="60" y2="25" /></g>}
      <text x="50" y={steeple ? 66 : 70} textAnchor="middle" fontFamily="'Roboto Condensed',Arial,sans-serif" fontWeight="700" fontSize="23" fill="currentColor">GN</text>
    </svg>
  );
}
