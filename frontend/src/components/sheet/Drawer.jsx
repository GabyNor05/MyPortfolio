import React from "react";
import { X } from "lucide-react";
import { useDice } from "../../lib/dice";

export default function Drawer() {
  const { drawerOpen, closeDrawer, log } = useDice();
  if (!drawerOpen) return null;
  return (
    <div className="drawer-wrap">
      <div className="drawer-scrim" onClick={closeDrawer} aria-hidden="true" />
      <aside className="drawer" role="dialog" aria-label="Game log">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span className="cz" style={{ fontWeight: 700, fontSize: 20, color: "var(--text)" }}>Game log</span>
          <button type="button" className="thin icon-btn" onClick={closeDrawer} aria-label="Close the drawer"><X size={14} /></button>
        </div>
        <div className="rc" style={{ fontSize: 13, color: "var(--muted)" }}>Every roll you make on the sheet appears here.</div>
        <div style={{ borderTop: "1px solid var(--line-soft)" }}>
          {log.length === 0 && <div className="log-line">No rolls yet. Click a modifier to roll.</div>}
          {log.map((l) => <div key={l.id} className="log-line">{l.text}</div>)}
        </div>
      </aside>
    </div>
  );
}
