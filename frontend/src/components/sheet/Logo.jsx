import React from "react";
import { useSettings } from "../../lib/useSettings";

// Plain d20 outline with GN, in the current accent colour.
export default function Logo({ size = 96 }) {
  const { logoData } = useSettings();
  if (logoData) return <img src={logoData} width={size} height={size} alt="Logo" style={{ objectFit: "contain" }} />;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" role="img" aria-label="GN logo">
      <polygon points="50,5 91,28 91,72 50,95 9,72 9,28" stroke="currentColor" strokeWidth="3.5" strokeLinejoin="round" />
      <g stroke="currentColor" strokeWidth="2" opacity=".5" strokeLinejoin="round" strokeLinecap="round">
        <polyline points="50,5 28,60 72,60 50,5" /><line x1="9" y1="28" x2="28" y2="60" /><line x1="91" y1="28" x2="72" y2="60" /><line x1="28" y1="60" x2="50" y2="95" /><line x1="72" y1="60" x2="50" y2="95" />
      </g>
      <text x="50" y="59" textAnchor="middle" fontFamily="'Roboto Condensed',Arial,sans-serif" fontWeight="700" fontSize="26" fill="currentColor">GN</text>
    </svg>
  );
}
