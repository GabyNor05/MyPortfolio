import React from "react";
import { FaGithub, FaBehance } from "react-icons/fa";
import Button from "../../../components/button/Button";
import VoiceoverBtn from "../../../components/button/VoiceoverBtn";
import Headshot from "../../../assets/home/headshot.jpg";
import { pageContent } from "../../../data/portfolioData";

const hero = pageContent.find((c) => c.id === "content-001");

const Hero = () => (
  <section id="hero" className="w-full max-w-6xl px-4 py-12 sm:py-20 flex flex-col-reverse md:flex-row items-center justify-between gap-10">
    <div className="md:w-1/2">
      <p className="text-lg text-[var(--text-3)]">Hi, I'm</p>
      <h1 className="font-display text-6xl sm:text-7xl leading-none">
        <span className="text-primary">Gaby</span> Norris
      </h1>
      <h2 className="mt-3 text-xl text-[var(--text-3)]">Interactive Developer &amp; UX Designer</h2>
      <p className="mt-4 text-neutral max-w-prose">{hero.description}</p>
      <div className="flex flex-row flex-wrap gap-3 mt-6">
        <Button colour="primary" icon={<FaGithub />} label="GitHub" link="https://github.com/GabyNor05" />
        <Button colour="secondary" icon={<FaBehance />} label="Behance" link="https://www.behance.net/gabynorris1" />
        <VoiceoverBtn />
      </div>
    </div>
    <img
      src={Headshot}
      alt="Gaby Norris"
      className="rounded-full w-52 h-52 sm:w-64 sm:h-64 object-cover ring-2 ring-primary/40 shadow-[0_0_60px_var(--glow)]"
    />
  </section>
);

export default Hero;
