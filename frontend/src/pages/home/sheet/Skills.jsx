import React from "react";
import { useSettings } from "../../../lib/useSettings";
import { useDice, signed } from "../../../lib/dice";

export default function Skills({ embedded = false }) {
  const { roll } = useDice();
  const { skills, extraSkills } = useSettings();
  return (
    <section className={embedded ? "sk-embed" : "panel colB"} aria-label="Skills">
      <div className="sk-head"><span style={{ width: 26 }}>Prof</span><span style={{ flexGrow: 1 }}>Skill</span><span style={{ width: 48, textAlign: "right" }}>Bonus</span></div>
      {skills.map((s) => (
        <div className="sk-row" key={s.name}>
          <span className="sk-prof" aria-label={s.proficient ? "Proficient" : "Not proficient"}><span className={`dot ${s.proficient ? "on" : ""}`} /></span>
          <span className="sk-name">{s.name}</span>
          <button type="button" className="sk-bonus roll" aria-label={`Roll ${s.name}, d20 ${signed(s.bonus)}`} onClick={() => roll(s.name, s.bonus, 20)}>{signed(s.bonus)}</button>
        </div>
      ))}
      {embedded && extraSkills.map((x) => (
        <div className="sk-row" key={x.name}>
          <span className="sk-prof" aria-label={x.proficient ? "Proficient" : "Not proficient"}><span className={`dot ${x.proficient ? "on" : ""}`} /></span>
          <span className="sk-name">{x.name}</span>
          <button type="button" className="sk-bonus roll" aria-label={`Roll ${x.name}, d20 ${signed(x.bonus)}`} onClick={() => roll(x.name, x.bonus, 20)}>{signed(x.bonus)}</button>
        </div>
      ))}
      {!embedded && <div className="panel-title">Skills</div>}
    </section>
  );
}
