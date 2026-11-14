import React, { createContext, lazy, Suspense, useCallback, useContext, useEffect, useRef, useState } from "react";

const Dice3D = lazy(() => import("../components/sheet/Dice3D"));

const DiceContext = createContext(null);

export function DiceProvider({ children }) {
  const [rolling, setRolling] = useState(false);
  const [trayOpen, setTrayOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [log, setLog] = useState([]);
  const [stage, setStage] = useState(null);
  const timer = useRef(null);
  const busy = useRef(false);

  useEffect(() => () => clearTimeout(timer.current), []);

  // roll("Bugs save", +4, 20) -> "Bugs save: d20 (13) + 4 = 17"
  const roll = useCallback((label, mod = 0, sides = 20) => {
    if (busy.current) return;
    busy.current = true;
    setRolling(true);
    const d = 1 + Math.floor(Math.random() * sides);
    const total = d + mod;
    const complete = () => {
      let text = mod === 0 && /^d\d+$/.test(label)
        ? `${label}: ${d}`
        : `${label}: d${sides} (${d}) ${mod >= 0 ? "+" : "-"} ${Math.abs(mod)} = ${total}`;
      if (sides === 20 && d === 20) text += " Natural 20!";
      if (sides === 20 && d === 1) text += " Natural 1";
      setLog((l) => [{ id: Date.now() + Math.random(), total: String(total), text }, ...l].slice(0, 20));
      setRolling(false);
      setTrayOpen(true);
      busy.current = false;
    };
    const reduced = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (sides === 20 && !reduced) {
      // 3D d20: the dice lands on the number, then the result is logged
      setStage({ id: Date.now() + Math.random(), value: d, onSettled: complete });
    } else {
      timer.current = setTimeout(complete, 650);
    }
  }, []);

  const value = {
    rolling, roll, log, last: log[0] || null,
    trayOpen, toggleTray: () => setTrayOpen((v) => !v),
    drawerOpen, toggleDrawer: () => setDrawerOpen((v) => !v), closeDrawer: () => setDrawerOpen(false),
  };
  return (
    <DiceContext.Provider value={value}>
      {children}
      {stage && (
        <Suspense fallback={null}>
          <Dice3D key={stage.id} value={stage.value} onSettled={stage.onSettled} onDone={() => setStage((cur) => (cur && cur.id === stage.id ? null : cur))} />
        </Suspense>
      )}
    </DiceContext.Provider>
  );
}

export const useDice = () => useContext(DiceContext);
export const signed = (n) => `${n >= 0 ? "+" : "-"}${Math.abs(n)}`;
