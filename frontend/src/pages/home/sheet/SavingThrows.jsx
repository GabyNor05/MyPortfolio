import React from "react";
import { sheet } from "../../../data/portfolioData";
import { useDice, signed } from "../../../lib/dice";

export default function SavingThrows() {
  const { roll } = useDice();
  return (
    <section className="panel saves" aria-label="Saving throws">
      <div className="saves-grid">
        {sheet.saves.map((s) => (
          <div className="save" key={s.name}>
            <div className="save-pill">
              <span className={`dot ${s.proficient ? "on" : ""}`} aria-label={s.proficient ? "Proficient save" : "Not proficient"} />
              <span className="save-name">{s.name}</span>
              <button type="button" className="circle roll" aria-label={`Roll ${s.name} saving throw, d20 ${signed(s.bonus)}`} onClick={() => roll(`${s.name} save`, s.bonus, 20)}>{signed(s.bonus)}</button>
            </div>
          </div>
        ))}
      </div>
      <div className="notes">
        {sheet.saveNotes.map((n, i) => (
          <div className="note" key={n.text}><span className={`hex ${i ? "alt" : ""}`} aria-hidden="true">{n.kind}</span><span>{n.text}</span></div>
        ))}
      </div>
      <div className="panel-title">Saving throws</div>
    </section>
  );
}
