import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db, isFirebaseConfigured } from "./firebase";
import { projectData } from "../data/portfolioData";

const visible = (p) => p.hidden !== true;

// Shows local data instantly, then swaps in Firestore data if the collection has any.
export function useProjects() {
  const [projects, setProjects] = useState(() => projectData.filter(visible));
  const [source, setSource] = useState("local");

  useEffect(() => {
    if (!isFirebaseConfigured) return;
    let cancelled = false;
    getDocs(collection(db, "projects"))
      .then((snap) => {
        if (cancelled || snap.empty) return;
        const local = Object.fromEntries(projectData.map((p) => [p.id, p]));
        setProjects(snap.docs.map((d) => {
          const data = d.data(), base = local[d.id] || {};
          // Keep images from the code version when the saved copy has none.
          return {
            id: d.id, ...data,
            thumbnail: data.thumbnail || base.thumbnail || "",
            gallery: data.gallery && data.gallery.length ? data.gallery : base.gallery || [],
          };
        }).filter(visible));
        setSource("firestore");
      })
      .catch((err) => console.warn("Firestore unavailable, using local data:", err.message));
    return () => { cancelled = true; };
  }, []);

  return { projects, source };
}

export const isRealUrl = (u) =>
  typeof u === "string" && /^https?:\/\//.test(u) && !u.includes("...") && !u.endsWith(".”");
