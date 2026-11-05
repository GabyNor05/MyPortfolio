import React, { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, getDocs, orderBy, query, doc, setDoc, deleteDoc } from "firebase/firestore";
import { auth, db, isFirebaseConfigured } from "../../../lib/firebase";
import { ADMIN_EMAIL } from "../../../lib/firebaseConfig";
import { projectData } from "../../../data/portfolioData";

const Dashboard = () => {
  const [user, setUser] = useState(undefined);
  const [messages, setMessages] = useState([]);
  const [note, setNote] = useState("");

  useEffect(() => {
    if (!isFirebaseConfigured) return;
    return onAuthStateChanged(auth, setUser);
  }, []);

  const isAdmin = user?.email === ADMIN_EMAIL;

  const load = async () => {
    try {
      const snap = await getDocs(query(collection(db, "messages"), orderBy("createdAt", "desc")));
      setMessages(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (e) { setNote(e.message); }
  };
  useEffect(() => { if (isAdmin) load(); }, [isAdmin]);

  const seed = async () => {
    try {
      for (const p of projectData) await setDoc(doc(db, "projects", p.id), p);
      setNote(`Copied ${projectData.length} projects into Firestore.`);
    } catch (e) { setNote(e.message); }
  };
  const remove = async (id) => { await deleteDoc(doc(db, "messages", id)); load(); };

  if (!isFirebaseConfigured) return <main className="max-w-2xl mx-auto px-4 py-20 text-neutral">Firebase isn't configured yet.</main>;
  if (user === undefined) return <main className="px-4 py-20 text-center">Loading…</main>;
  if (!isAdmin) return <main className="max-w-2xl mx-auto px-4 py-20 text-neutral">Not authorised. <a className="link" href="#/auth">Sign in</a> with the owner account.</main>;

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-4xl">Dashboard</h1>
        <button className="btn btn-sm btn-ghost" onClick={() => signOut(auth)}>Sign out</button>
      </div>
      <div className="mt-6 flex gap-3 flex-wrap">
        <button className="btn btn-primary btn-sm" onClick={seed}>Copy local projects to Firestore</button>
        <button className="btn btn-outline btn-sm" onClick={load}>Refresh messages</button>
      </div>
      {note && <p className="mt-3 text-sm text-neutral">{note}</p>}
      <h2 className="font-display text-2xl mt-8">Messages ({messages.length})</h2>
      <div className="mt-3 grid gap-3">
        {messages.map((m) => (
          <div key={m.id} className="rounded-md bg-base-200 border-[0.5px] border-[var(--border)] p-4">
            <div className="flex justify-between text-sm"><b>{m.name}</b><span className="text-[var(--text-3)]">{m.reason}</span></div>
            <a className="text-primary text-sm" href={`mailto:${m.email}`}>{m.email}</a>
            <p className="mt-2 text-neutral whitespace-pre-wrap">{m.message}</p>
            <button className="btn btn-xs btn-ghost mt-2" onClick={() => remove(m.id)}>Delete</button>
          </div>
        ))}
        {messages.length === 0 && <p className="text-neutral">No messages yet.</p>}
      </div>
    </main>
  );
};

export default Dashboard;
