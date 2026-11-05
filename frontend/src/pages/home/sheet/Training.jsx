import React from "react";
import { sheet } from "../../../data/portfolioData";

export default function Training() {
  return (
    <aside className="panel training" aria-label="Proficiencies and training">
      {sheet.training.map((g) => (
        <div className="tr-group" key={g.title}>
          <div className="tr-title">{g.title}</div>
          <div className="tr-items">{g.items}</div>
        </div>
      ))}
      <div className="panel-title" style={{ paddingTop: 12 }}>Proficiencies &amp; training</div>
    </aside>
  );
}
