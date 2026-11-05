import React from "react";
import { sheet } from "../../../data/portfolioData";
import { useDice, signed } from "../../../lib/dice";

const label = (lvl) => (lvl >= 7 ? "Highly proficient" : lvl >= 4 ? "Proficient" : "Learning");

export default function Skills() {
  const { roll } = useDice();
  return (
    <section className="panel colB" aria-label="Skills">
      <div className="sk-head"><span style={{ width: 26 }}>Prof</span><span style={{ flexGrow: 1 }}>Skill</span><span style={{ width: 48, textAlign: "right" }}>Bonus</span></div>
      {sheet.skills.map((s) => (
        <div className="sk-row" key={s.name}>
          <span className="sk-prof" aria-label={label(s.level)}><span className={`dot ${s.level >= 7 ? "on" : ""}`} /></span>
          <span className="sk-name">{s.name}</span>
          <button type="button" className="sk-bonus roll" aria-label={`Roll ${s.name}, d20 ${signed(s.level)}`} onClick={() => roll(s.name, s.level, 20)}>{signed(s.level)}</button>
        </div>
      ))}
      <div className="panel-title">Skills</div>
    </section>
  );
}
