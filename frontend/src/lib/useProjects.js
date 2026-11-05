import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db, isFirebaseConfigured } from "./firebase";
import { projectData } from "../data/portfolioData";

// Shows local data instantly, then swaps in Firestore data if the collection has any.
export function useProjects() {
  const [projects, setProjects] = useState(projectData);
  const [source, setSource] = useState("local");

  useEffect(() => {
    if (!isFirebaseConfigured) return;
    let cancelled = false;
    getDocs(collection(db, "projects"))
      .then((snap) => {
        if (cancelled || snap.empty) return;
        setProjects(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setSource("firestore");
      })
      .catch((err) => console.warn("Firestore unavailable, using local data:", err.message));
    return () => { cancelled = true; };
  }, []);

  return { projects, source };
}

export const isRealUrl = (u) =>
  typeof u === "string" && /^https?:\/\//.test(u) && !u.includes("...") && !u.endsWith(".”");
