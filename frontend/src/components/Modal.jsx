import React, { useEffect } from "react";

// Small centred pop-up used for confirmations and warnings.
export default function Modal({ title, children, onClose, actions }) {
  useEffect(() => {
    const k = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [onClose]);
  return (
    <div className="cv-back" role="dialog" aria-modal="true" aria-label={title} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="cv-modal">
        <h2 className="h2" style={{ fontSize: 22, margin: 0 }}>{title}</h2>
        <div className="quote" style={{ margin: 0 }}>{children}</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>{actions}</div>
      </div>
    </div>
  );
}
