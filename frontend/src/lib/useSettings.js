import { useSyncExternalStore } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db, isFirebaseConfigured } from "./firebase";
import { LINKS, CAMPAIGN } from "./siteConfig";
import { pageContent, sheet } from "../data/portfolioData";

const TECH = "I really think technology is cool. It has its risks and its dangers, but what it has done for the world is amazing, and above all impactful. Then there's the feeling of unboxing something new. It doesn't have to be the latest thing, just new to me, like a power bank or anything that's going to make my life easier. Unboxing is one of my favourite things. I also love watching how fast it moves. The moment I decide I want a phone, it's already outdated, and by the time it reaches the store there's a newer model. That's just how technology works, and it fascinates me how much the industry has grown and how much is possible with it.";
const EDU = /^(bachelor|diploma|degree|honours|master|certificate|national senior)/i;
const pc = (id) => pageContent.find((c) => c.id === id) || {};

// Everything editable from the admin. Firestore (settings/site) overrides these live.
export const DEFAULTS = {
  name: "Gaby Norris",
  role: "Developer / User Experience Designer",
  bottomLine: "Final year · Bachelor of Creative Technologies",
  campaign: CAMPAIGN,
  intro: pc("content-001").description,
  links: { ...LINKS },
  voiceUrl: "",
  logoData: "",
  about: [
    { id: "dev", label: "Developer", heading: pc("content-002").title, text: pc("content-002").description },
    { id: "des", label: "Designer", heading: pc("content-003").title, text: pc("content-003").description },
    { id: "tink", label: "Tinkerer", heading: pc("content-004").title, text: TECH },
  ],
  education: sheet.experience.filter((x) => EDU.test(x.role)),
  experience: sheet.experience.filter((x) => !EDU.test(x.role)),
  skills: sheet.skills.map((s) => ({ name: s.name, bonus: s.level, proficient: s.level >= 7 })),
  extraSkills: sheet.extraSkills,
  abilities: sheet.abilities.map((a) => ({ name: a.name, score: a.score, bonus: null, note: a.name === "Maintenance" ? "Not rated yet. I have not had much experience maintaining projects after launch (only one so far), and I am keen to build it." : "" })),
  saves: sheet.saves,
  saveNotes: sheet.saveNotes,
  languages: sheet.languages,
  training: sheet.training,
  cloudName: "",
  uploadPreset: "",
  replyTemplate: "",
  cvLinks: { dev: "", ux: "", hybrid: "" },
  contactIntro: pc("content-006").description || "",
  facts: [
    "My cat has strong opinions about my keyboard, usually during a Merge.",
    "Unboxing something new is one of my favourite things. The box is half the fun.",
    "I tutor, so I will explain something until it actually clicks.",
    "I design in Figma first, then build it in React.",
    "Music is one of my proficient skills.",
    "Whenever I decide I want a new phone, a newer model is already out.",
    "I study Interactive Development and UX Design at Open Window Institute.",
    "I believe the best design solves a problem before it looks good.",
  ],
};

let cache = DEFAULTS;
const subs = new Set();
let started = false;

function start() {
  if (started || !isFirebaseConfigured) return;
  started = true;
  onSnapshot(doc(db, "settings", "site"), (s) => {
    if (s.exists()) {
      const d = s.data();
      if (!d.education && Array.isArray(d.experience)) { d.education = d.experience.filter((x) => EDU.test(x.role || "")); d.experience = d.experience.filter((x) => !EDU.test(x.role || "")); }
      cache = { ...DEFAULTS, ...d, links: { ...DEFAULTS.links, ...(d.links || {}) }, cvLinks: { ...DEFAULTS.cvLinks, ...(d.cvLinks || {}) } };
      subs.forEach((f) => f());
    }
  }, (e) => console.warn("Settings not loaded:", e.message));
}
const subscribe = (f) => { subs.add(f); start(); return () => subs.delete(f); };

export const useSettings = () => useSyncExternalStore(subscribe, () => cache, () => DEFAULTS);
