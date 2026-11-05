import React from "react";
import { FileDown } from "lucide-react";
import D20 from "./D20";
import { useDice } from "../../lib/dice";

const DICE = [4, 6, 8, 10, 12, 20];
// Put your CV PDF in frontend/public/ and set its filename here to make the button download it.
const CV_FILE = "";

export default function DiceTray() {
  const { rolling, roll, last, log, trayOpen, toggleTray } = useDice();
  return (
    <div className="fab-wrap">
      {trayOpen && (
        <div className="tray" role="region" aria-label="Dice tray">
          <div className="rc" style={{ fontWeight: 700, fontSize: 12, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--accent)" }}>Dice tray</div>
          <div aria-live="polite" style={{ marginTop: 8, minHeight: 62 }}>
            <div className="tray-total">{last ? last.total : "–"}</div>
            <div className="rc" style={{ fontSize: 14, color: "var(--text-2)" }}>{last ? last.text : "Click any modifier or die to roll."}</div>
          </div>
          <div className="dice-btns">
            {DICE.map((s) => (
              <button key={s} type="button" className="thin" style={{ minWidth: 44, justifyContent: "center" }} onClick={() => roll(`d${s}`, 0, s)}>d{s}</button>
            ))}
          </div>
          <div style={{ marginTop: 12, borderTop: "1px solid var(--line-soft)", paddingTop: 8 }}>
            {log.slice(1, 5).map((l) => <div key={l.id} className="rc" style={{ fontSize: 13, lineHeight: 1.6, color: "var(--muted)" }}>{l.text}</div>)}
          </div>
        </div>
      )}
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        {CV_FILE ? (
          <a className="fab ghost" href={`./${CV_FILE}`} download aria-label="Download my CV as a PDF"><FileDown size={18} /></a>
        ) : null}
        <button type="button" className="fab" onClick={toggleTray} aria-label="Open the dice tray" aria-expanded={trayOpen}>
          <D20 className={rolling ? "spin" : ""} />
        </button>
      </div>
    </div>
  );
}
