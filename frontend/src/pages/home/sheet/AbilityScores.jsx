import React from "react";
import { useSettings } from "../../../lib/useSettings";
import { useDice, signed } from "../../../lib/dice";

export default function AbilityScores() {
  const { roll, addLog, drawerOpen, toggleDrawer } = useDice();
  const { abilities } = useSettings();
  return (
    <section className="abilities" aria-label="Ability scores">
      {abilities.map((a) => {
        const rated = typeof a.score === "number";
        const mod = typeof a.bonus === "number" ? a.bonus : rated ? Math.floor((a.score - 10) / 2) : 0;
        const has = rated || typeof a.bonus === "number";
        return (
          <div className="ability" key={a.name}>
            <div className="ability-name">{a.name}</div>
            <button type="button" className="mod roll" aria-label={has ? `Roll ${a.name} check, d20 ${signed(mod)}` : `${a.name} not rated yet, press to read why`} onClick={() => { if (has) roll(a.name, mod, 20); else { addLog({ kind: "sys", text: `${a.name}: ${a.note || "Not rated yet."}` }); if (!drawerOpen) toggleDrawer(); } }}>{has ? signed(mod) : "--"}</button>
            <div className="score">{rated ? a.score : "--"}</div>
          </div>
        );
      })}
    </section>
  );
}
