import React from "react";
import { sheet } from "../../../data/portfolioData";
import { useDice, signed } from "../../../lib/dice";

export default function AbilityScores() {
  const { roll } = useDice();
  return (
    <section className="abilities" aria-label="Ability scores">
      {sheet.abilities.map((a) => {
        const rated = typeof a.score === "number";
        const mod = rated ? Math.floor((a.score - 10) / 2) : 0;
        return (
          <div className="ability" key={a.name}>
            <div className="ability-name">{a.name}</div>
            <button type="button" className="mod roll" aria-label={rated ? `Roll ${a.name} check, d20 ${signed(mod)}` : `${a.name} not rated yet`} onClick={() => rated && roll(a.name, mod, 20)}>{rated ? signed(mod) : "--"}</button>
            <div className="score">{rated ? a.score : "--"}</div>
          </div>
        );
      })}
    </section>
  );
}
