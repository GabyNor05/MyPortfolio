import React from "react";
import { useSettings } from "../../../lib/useSettings";
import { useDice } from "../../../lib/dice";

export default function Languages() {
  const { roll } = useDice();
  const { languages } = useSettings();
  return (
    <section className="panel lang" aria-label="Languages">
      {languages.map((l) => (
        <div className="lang-row" key={l.name}>
          <div className="lang-pill">{l.name}</div>
          <button type="button" className="circle roll" aria-label={`Roll ${l.name}, d20 +${l.level}`} onClick={() => roll(l.name, l.level, 20)}>{l.level}</button>
        </div>
      ))}
      <div className="panel-title" style={{ paddingTop: 0 }}>Languages</div>
    </section>
  );
}
