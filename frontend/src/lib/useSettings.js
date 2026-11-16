import { useSyncExternalStore } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db, isFirebaseConfigured } from "./firebase";
import { LINKS, CAMPAIGN } from "./siteConfig";
import { pageContent, sheet } from "../data/portfolioData";

const TECH = "I really think technology is cool. It has its risks and its dangers, but what it has done for the world is amazing, and above all impactful. Then there's the feeling of unboxing something new. It doesn't have to be the latest thing, just new to me, like a power bank or anything that's going to make my life easier. Unboxing is one of my favourite things. I also love watching how fast it moves. The moment I decide I want a phone, it's already outdated, and by the time it reaches the store there's a newer model. That's just how technology works, and it fascinates me how much the industry has grown and how much is possible with it.";
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
  experience: sheet.experience,
  skills: sheet.skills.map((s) => ({ name: s.name, bonus: s.level, proficient: s.level >= 7 })),
  extraSkills: sheet.extraSkills,
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
      cache = { ...DEFAULTS, ...d, links: { ...DEFAULTS.links, ...(d.links || {}) } };
      subs.forEach((f) => f());
    }
  }, (e) => console.warn("Settings not loaded:", e.message));
}
const subscribe = (f) => { subs.add(f); start(); return () => subs.delete(f); };

export const useSettings = () => useSyncExternalStore(subscribe, () => cache, () => DEFAULTS);
