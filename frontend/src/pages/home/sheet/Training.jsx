import React from "react";
import { useSettings } from "../../../lib/useSettings";

export default function Training() {
  const { training } = useSettings();
  return (
    <aside className="panel training" aria-label="Proficiencies and training">
      {training.map((g) => (
        <div className="tr-group" key={g.title}>
          <div className="tr-title">{g.title}</div>
          <div className="tr-items">{g.items}</div>
        </div>
      ))}
      <div className="panel-title" style={{ paddingTop: 12 }}>Tools</div>
    </aside>
  );
}
