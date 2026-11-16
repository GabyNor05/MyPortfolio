import React, { useState } from "react";
import { useSettings } from "../../../lib/useSettings";
import { useDice, signed } from "../../../lib/dice";

export default function AbilityScores() {
  const { roll } = useDice();
  const { abilities } = useSettings();
  const [tip, setTip] = useState(null);
  return (
    <section className="abilities" aria-label="Ability scores">
      {abilities.map((a) => {
        const rated = typeof a.score === "number";
        const mod = typeof a.bonus === "number" ? a.bonus : rated ? Math.floor((a.score - 10) / 2) : 0;
        const has = rated || typeof a.bonus === "number";
        const note = a.note || "Not rated yet.";
        return (
          <div className="ability" key={a.name} onMouseLeave={() => setTip((t) => (t === a.name ? null : t))}>
            <div className="ability-name">{a.name}</div>
            <button type="button" className={`mod ${has ? "roll" : "unrated"}`} aria-label={has ? `Roll ${a.name} check, d20 ${signed(mod)}` : `${a.name} not rated yet. ${note}`}
              onClick={() => (has ? roll(a.name, mod, 20) : setTip(tip === a.name ? null : a.name))}
              onMouseEnter={() => !has && setTip(a.name)} onFocus={() => !has && setTip(a.name)} onBlur={() => setTip(null)}>{has ? signed(mod) : "--"}</button>
            <div className="score">{rated ? a.score : "--"}</div>
            {!has && tip === a.name && <div className="ab-tip" role="tooltip">{note}</div>}
          </div>
        );
      })}
    </section>
  );
}
