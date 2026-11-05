import React from "react";

export default function D20({ size = 26, className = "", stroke = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true" className={className}>
      <polygon points="50,4 92,28 92,72 50,96 8,72 8,28" fill="none" stroke={stroke} strokeWidth="7" />
      <polygon points="50,24 78,68 22,68" fill="none" stroke={stroke} strokeWidth="7" />
    </svg>
  );
}
