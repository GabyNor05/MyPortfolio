import React from "react";
import { FaLinkedin } from "react-icons/fa";
import { MessageSquare, FolderOpen } from "lucide-react";
import headshot from "../../../assets/home/headshot.jpg";
import { LINKS } from "../../../lib/siteConfig";
import { pageContent } from "../../../data/portfolioData";
import { scrollToTab } from "../tabBus";
import AbilityScores from "./AbilityScores";

export default function Hero() {
  const intro = pageContent.find((c) => c.id === "content-001").description;
  return (
    <div className="hero-wrap">
      <section className="panel hero" aria-label="Introduction">
        <div className="hero-text">
          <div className="eyebrow">Hi, I'm</div>
          <h1 className="h1">Gaby Norris</h1>
          <div className="sub">Developer / User Experience Designer</div>
          <p className="lede">{intro}</p>
          <div className="btn-row">
            <button type="button" className="solid" onClick={() => scrollToTab("projects")}><FolderOpen size={15} />View projects</button>
            <button type="button" className="thin" style={{ minHeight: 36, padding: "0 18px" }} onClick={() => scrollToTab("contact")}><MessageSquare size={14} />Get in touch</button>
            <a className="thin" style={{ minHeight: 36, padding: "0 18px" }} href={LINKS.linkedin} target="_blank" rel="noopener noreferrer"><FaLinkedin size={14} />LinkedIn</a>
          </div>
        </div>
        <div className="hero-photo"><img src={headshot} alt="Portrait of Gaby Norris" /></div>
      </section>
      <AbilityScores />
    </div>
  );
}
