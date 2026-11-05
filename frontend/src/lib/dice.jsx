import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

const DiceContext = createContext(null);

export function DiceProvider({ children }) {
  const [rolling, setRolling] = useState(false);
  const [trayOpen, setTrayOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [log, setLog] = useState([]);
  const timer = useRef(null);
  const busy = useRef(false);

  useEffect(() => () => clearTimeout(timer.current), []);

  // roll("Bugs save", +4, 20) -> "Bugs save: d20 (13) + 4 = 17"
  const roll = useCallback((label, mod = 0, sides = 20) => {
    if (busy.current) return;
    busy.current = true;
    setRolling(true);
    timer.current = setTimeout(() => {
      const d = 1 + Math.floor(Math.random() * sides);
      const total = d + mod;
      let text = mod === 0 && /^d\d+$/.test(label)
        ? `${label}: ${d}`
        : `${label}: d${sides} (${d}) ${mod >= 0 ? "+" : "-"} ${Math.abs(mod)} = ${total}`;
      if (sides === 20 && d === 20) text += " Natural 20!";
      if (sides === 20 && d === 1) text += " Natural 1";
      setLog((l) => [{ id: Date.now() + Math.random(), total: String(total), text }, ...l].slice(0, 20));
      setRolling(false);
      setTrayOpen(true);
      busy.current = false;
    }, 650);
  }, []);

  const value = {
    rolling, roll, log, last: log[0] || null,
    trayOpen, toggleTray: () => setTrayOpen((v) => !v),
    drawerOpen, toggleDrawer: () => setDrawerOpen((v) => !v), closeDrawer: () => setDrawerOpen(false),
  };
  return <DiceContext.Provider value={value}>{children}</DiceContext.Provider>;
}

export const useDice = () => useContext(DiceContext);
export const signed = (n) => `${n >= 0 ? "+" : "-"}${Math.abs(n)}`;
