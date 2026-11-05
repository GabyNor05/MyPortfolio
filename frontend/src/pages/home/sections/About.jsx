import React from "react";
import { FaLinkedin } from "react-icons/fa";
import { Code, Palette, Sparkles } from "lucide-react";
import { pageContent, techStack, confidenceRating } from "../../../data/portfolioData";
import { LINKEDIN_URL } from "../../../lib/firebaseConfig";
import Button from "../../../components/button/Button";

const icons = { code: <Code />, palette: <Palette />, sparkles: <Sparkles /> };
const ids = ["content-002", "content-003", "content-004"];
const level = (n) => confidenceRating.find((r) => { const [a, b] = r.range.split("-").map(Number); return n >= a && n <= b; })?.level;

const About = () => (
  <section id="about" className="w-full max-w-6xl px-4 py-16 scroll-mt-16">
    <h2 className="font-display text-4xl sm:text-5xl">About me</h2>
    <div className="mt-6 grid gap-5 md:grid-cols-3">
      {pageContent.filter((c) => ids.includes(c.id)).map((c) => (
        <div key={c.id} className="rounded-lg bg-base-200 border-[0.5px] border-[var(--border)] p-5">
          <div className="text-primary">{icons[c.media?.name]}</div>
          <h3 className="font-display text-2xl mt-2">{c.title}</h3>
          <p className="mt-2 text-sm text-neutral">{c.description === "..." ? "Coming soon." : c.description}</p>
        </div>
      ))}
    </div>

    <h3 className="font-display text-3xl mt-12">Tech stack</h3>
    <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {techStack.map((t) => (
        <div key={t.name} title={t.context} className="rounded-md bg-base-200 border-[0.5px] border-[var(--border)] p-4">
          <div className="flex justify-between text-sm"><span>{t.name}</span><span className="text-[var(--text-3)]">{level(t.confidence)}</span></div>
          <progress className="progress progress-primary w-full mt-2" value={t.confidence} max="10" />
        </div>
      ))}
    </div>

    {LINKEDIN_URL && (
      <div className="mt-8">
        <Button colour="secondary" icon={<FaLinkedin />} label="Find me on LinkedIn" link={LINKEDIN_URL} />
      </div>
    )}
  </section>
);

export default About;
