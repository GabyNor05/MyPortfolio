import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Moon, Sun } from "lucide-react";

export function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

const links = [
  { id: "projects", label: "Projects" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];

const Navbar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem("theme") || "dark"; } catch { return "dark"; }
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try { localStorage.setItem("theme", theme); } catch { /* storage unavailable */ }
  }, [theme]);

  const go = (id) => {
    if (pathname !== "/") {
      navigate("/");
      setTimeout(() => scrollToSection(id), 150);
    } else {
      scrollToSection(id);
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b-[0.5px] border-[var(--border)] backdrop-blur-[18px] bg-base-100/80">
      <div className="mx-auto max-w-6xl px-4 py-2 flex items-center justify-between gap-3">
        <button
          className="font-display text-xl sm:text-2xl text-base-content"
          onClick={() => { navigate("/"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
        >
          gaby <span className="text-primary">norris</span>
        </button>
        <nav className="flex items-center gap-3 sm:gap-6 text-[13px] sm:text-[14px] text-neutral tracking-wide">
          {links.map((l) => (
            <button key={l.id} onClick={() => go(l.id)}
              className="hover:text-primary border-b border-transparent hover:border-primary transition-all duration-200">
              {l.label}
            </button>
          ))}
        </nav>
        <button
          type="button"
          aria-label="Toggle light or dark theme"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="flex items-center gap-[6px] bg-base-300 border-[0.5px] border-[var(--border-mid)] rounded-pill px-3 py-[5px] text-[12px] text-neutral hover:text-base-content transition-all duration-200"
        >
          {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
          <span className="hidden sm:inline">{theme === "dark" ? "Light" : "Dark"} mode</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
