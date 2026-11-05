import React from "react";
import { sheet } from "../../../data/portfolioData";
import { useDice, signed } from "../../../lib/dice";

export default function AbilityScores() {
  const { roll } = useDice();
  return (
    <section className="abilities" aria-label="Ability scores">
      {sheet.abilities.map((a) => {
        const mod = Math.floor((a.score - 10) / 2);
        return (
          <div className="ability" key={a.name}>
            <div className="ability-name">{a.name}</div>
            <button type="button" className="mod roll" aria-label={`Roll ${a.name} check, d20 ${signed(mod)}`} onClick={() => roll(a.name, mod, 20)}>{signed(mod)}</button>
            <div className="score">{a.score}</div>
          </div>
        );
      })}
    </section>
  );
}
