import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaGithub, FaBehance } from "react-icons/fa";
import { Volume2, Pause, Play, List, Sun, Moon } from "lucide-react";
import headshot from "../../assets/home/headshot.jpg";
import voiceover from "../../assets/home/converted_V1.mp3";
import { LINKS, CAMPAIGN } from "../../lib/siteConfig";
import { useDice } from "../../lib/dice";
import { useTheme } from "../../lib/useTheme";
import { scrollToTab } from "../../pages/home/tabBus";

export default function Header() {
  const navigate = useNavigate();
  const { toggleDrawer, drawerOpen } = useDice();
  const [theme, toggleTheme] = useTheme();
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  const toggleVoice = () => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) a.pause();
    else a.play().catch((e) => console.error("Playback failed:", e));
    setPlaying(!playing);
  };

  return (
    <header className="hdr">
      <div className="hdr-in">
        <div className="hdr-id">
          <img src={headshot} alt="Portrait of Gaby Norris" />
          <div style={{ minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <Link to="/" className="hdr-name">Gaby Norris</Link>
              <Link to="/auth" className="manage">Manage</Link>
            </div>
            <div className="rc" style={{ fontSize: 13, color: "var(--text-2)", marginTop: 3 }}>Interactive Developer / UX Designer</div>
            <div className="rc" style={{ fontSize: 11, color: "var(--muted)" }}>Level 3</div>
          </div>
        </div>

        <div className="hdr-actions">
          <a className="thin" href={LINKS.github} target="_blank" rel="noopener noreferrer"><FaGithub size={14} />GitHub</a>
          <a className="thin" href={LINKS.behance} target="_blank" rel="noopener noreferrer"><FaBehance size={14} />Behance</a>
          <audio ref={audioRef} src={voiceover} onEnded={() => setPlaying(false)} />
          <button type="button" className="thin" onClick={toggleVoice}>
            {playing ? <Pause size={14} /> : <Volume2 size={14} />}Hear my story
          </button>
          <div className="campaign">
            <div className="campaign-text"><b style={{ letterSpacing: ".06em", textTransform: "uppercase", marginRight: 6 }}>Campaign:</b><span style={{ color: "var(--text-2)" }}>{CAMPAIGN}</span></div>
            <button type="button" aria-label="Open the quest log" onClick={() => { navigate("/"); setTimeout(() => scrollToTab("projects"), 50); }}><Play size={13} /></button>
            <button type="button" aria-label="Open the game log drawer" aria-expanded={drawerOpen} onClick={toggleDrawer}><List size={14} /></button>
          </div>
          <button type="button" className="thin icon-btn" aria-label="Toggle light or dark theme" onClick={toggleTheme}>
            {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
          </button>
        </div>
      </div>
    </header>
  );
}
