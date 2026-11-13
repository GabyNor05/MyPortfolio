import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, getDocs, orderBy, query, doc, setDoc, deleteDoc } from "firebase/firestore";
import { Plus, Pencil, Trash2, Download, UploadCloud, Eye, EyeOff, LogOut, ArrowLeft, LayoutDashboard, FolderKanban, Inbox, HelpCircle } from "lucide-react";
import { auth, db, isFirebaseConfigured } from "../../../lib/firebase";
import { ADMIN_EMAIL } from "../../../lib/firebaseConfig";
import { projectData } from "../../../data/portfolioData";

const TYPES = ["UX Design", "Interactive Development", "Personal Project", "Hackathon"];
const lines = (v) => v.split("\n").map((x) => x.trim()).filter(Boolean);
const slug = (t) => "proj-" + (t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || Date.now());

const blank = () => ({ id: "", title: "", type: TYPES[0], solution: "", year: new Date().getFullYear(), shortDescription: "", fullDescription: "", tagline: "", role: "", status: "", hidden: false, tools: [], team: [], highlights: [], actions: [], thumbnail: "", reflection: "" });

// form <-> project conversion (arrays become editable text)
const toForm = (p) => ({ ...blank(), ...p, tools: (p.tools || []).join(", "), team: (p.team || []).join("\n"), highlights: (p.highlights || []).join("\n"), actions: (p.actions || []).map((a) => `${a.label} | ${a.url}`).join("\n") });
const fromForm = (f) => ({
  ...f,
  id: f.id || slug(f.title),
  year: Number(f.year) || new Date().getFullYear(),
  category: f.type === "UX Design" ? "ux" : "dev",
  tools: f.tools.split(",").map((x) => x.trim()).filter(Boolean),
  team: lines(f.team),
  highlights: lines(f.highlights),
  actions: lines(f.actions).map((l) => {
    const [label, ...rest] = l.split("|");
    const url = rest.join("|").trim();
    const icon = /figma/i.test(url) ? "figma" : /github/i.test(url) ? "github" : "link";
    return { label: label.trim(), icon, url };
  }).filter((a) => a.url),
});

function Field({ label, children, wide }) {
  return <div className="field" style={wide ? { gridColumn: "1 / -1" } : undefined}><label>{label}</label>{children}</div>;
}

function Editor({ project, onSave, onCancel, saving }) {
  const [f, setF] = useState(() => toForm(project));
  const set = (k) => (e) => setF({ ...f, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value });
  return (
    <form className="panel adm-card" onSubmit={(e) => { e.preventDefault(); onSave(fromForm(f)); }}>
      <div className="sec-h">{project.id ? `Edit: ${project.title}` : "New project"}</div>
      <div className="adm-grid">
        <Field label="Title"><input required value={f.title} onChange={set("title")} /></Field>
        <Field label="Type"><select value={f.type} onChange={set("type")}>{[...new Set([...TYPES, f.type])].map((t) => <option key={t}>{t}</option>)}</select></Field>
        <Field label="Solution (e.g. Mobile App)"><input value={f.solution} onChange={set("solution")} /></Field>
        <Field label="Year"><input type="number" value={f.year} onChange={set("year")} /></Field>
        <Field label="Tagline"><input value={f.tagline} onChange={set("tagline")} /></Field>
        <Field label="Status (e.g. Incomplete)"><input value={f.status} onChange={set("status")} /></Field>
        <Field label="Short description (shown on the list, 1 to 2 lines)" wide><input value={f.shortDescription} onChange={set("shortDescription")} /></Field>
        <Field label="Summary (shown on hover and the project page)" wide><textarea value={f.fullDescription} onChange={set("fullDescription")} /></Field>
        <Field label="My role"><input value={f.role} onChange={set("role")} /></Field>
        <Field label="Tools (comma separated)"><input value={f.tools} onChange={set("tools")} /></Field>
        <Field label="Team (one per line)"><textarea style={{ minHeight: 80 }} value={f.team} onChange={set("team")} /></Field>
        <Field label="Highlights (one per line)"><textarea style={{ minHeight: 80 }} value={f.highlights} onChange={set("highlights")} /></Field>
        <Field label="Links (one per line: Label | https://url)" wide><textarea style={{ minHeight: 80 }} value={f.actions} onChange={set("actions")} placeholder={"Figma file | https://figma.com/...\nGitHub repo | https://github.com/..."} /></Field>
        <Field label="Reflection" wide><textarea value={f.reflection} onChange={set("reflection")} /></Field>
        <Field label="Thumbnail image URL"><input value={f.thumbnail} onChange={set("thumbnail")} /></Field>
        <Field label="Visibility"><label style={{ display: "flex", gap: 8, alignItems: "center", textTransform: "none", letterSpacing: 0, fontSize: 15, color: "var(--text)" }}><input type="checkbox" checked={f.hidden} onChange={set("hidden")} /> Hide this project from the site</label></Field>
      </div>
      <div className="btn-row">
        <button className="solid" disabled={saving}>{saving ? "Saving…" : "Save project"}</button>
        <button type="button" className="thin" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}

export default function Dashboard() {
  const [user, setUser] = useState(isFirebaseConfigured ? undefined : null);
  const [tab, setTab] = useState("projects");
  const [projects, setProjects] = useState(projectData);
  const [source, setSource] = useState("local");
  const [messages, setMessages] = useState([]);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [note, setNote] = useState("");

  useEffect(() => { if (isFirebaseConfigured) return onAuthStateChanged(auth, setUser); }, []);
  const isAdmin = !isFirebaseConfigured || user?.email === ADMIN_EMAIL;

  const loadProjects = async () => {
    if (!isFirebaseConfigured) return;
    try {
      const snap = await getDocs(collection(db, "projects"));
      if (!snap.empty) { setProjects(snap.docs.map((d) => ({ id: d.id, ...d.data() }))); setSource("firestore"); }
    } catch (e) { setNote(e.message); }
  };
  const loadMessages = async () => {
    if (!isFirebaseConfigured) return;
    try {
      const snap = await getDocs(query(collection(db, "messages"), orderBy("createdAt", "desc")));
      setMessages(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (e) { setNote(e.message); }
  };
  useEffect(() => { if (isAdmin) { loadProjects(); loadMessages(); } }, [isAdmin]);

  const sorted = useMemo(() => [...projects].sort((a, b) => b.year - a.year || a.title.localeCompare(b.title)), [projects]);
  const upsert = (p) => setProjects((list) => (list.some((x) => x.id === p.id) ? list.map((x) => (x.id === p.id ? p : x)) : [...list, p]));

  const save = async (p) => {
    setSaving(true); setNote("");
    try {
      if (isFirebaseConfigured) {
        if (source === "local") for (const x of projects) await setDoc(doc(db, "projects", x.id), x); // first save: copy everything so nothing disappears
        await setDoc(doc(db, "projects", p.id), p);
        setSource("firestore");
        setNote(`Saved "${p.title}". It is live on the site.`);
      } else setNote(`Edited "${p.title}" on this page only. Firebase isn't set up, so use Download JSON to keep your changes.`);
      upsert(p); setEditing(null);
    } catch (e) { setNote(e.message); }
    setSaving(false);
  };
  const toggleHidden = (p) => save({ ...p, hidden: !p.hidden });
  const remove = async (p) => {
    if (!window.confirm(`Delete "${p.title}"? This can't be undone.`)) return;
    try {
      if (isFirebaseConfigured && source === "firestore") await deleteDoc(doc(db, "projects", p.id));
      setProjects((l) => l.filter((x) => x.id !== p.id));
    } catch (e) { setNote(e.message); }
  };
  const seed = async () => {
    try { for (const p of projectData) await setDoc(doc(db, "projects", p.id), p); setSource("firestore"); setProjects(projectData); setNote(`Copied ${projectData.length} projects from the code into Firestore.`); }
    catch (e) { setNote(e.message); }
  };
  const download = () => {
    const url = URL.createObjectURL(new Blob([JSON.stringify(sorted, null, 2)], { type: "application/json" }));
    const a = document.createElement("a"); a.href = url; a.download = "projects.json"; a.click(); URL.revokeObjectURL(url);
  };
  const removeMessage = async (id) => { await deleteDoc(doc(db, "messages", id)); loadMessages(); };

  if (user === undefined) return <main className="page"><p className="lede">Loading…</p></main>;
  if (!isAdmin) return <main className="page"><div className="panel adm-card"><h1 className="h2">Not authorised</h1><p className="lede">Please <Link to="/auth" style={{ color: "var(--accent)" }}>sign in</Link> with the owner account.</p></div></main>;

  const NAV = [["overview", "Overview", LayoutDashboard], ["projects", "Projects", FolderKanban], ["messages", "Messages", Inbox], ["help", "How to publish", HelpCircle]];
  const hiddenCount = projects.filter((p) => p.hidden).length;
  return (
    <div className="adm-shell">
      <aside className="adm-side">
        <div className="adm-brand"><span className="hdr-logo" style={{ width: 40, height: 40, fontSize: 18 }}>GN</span><div><b>Portfolio</b><div style={{ fontSize: 12, color: "var(--muted)" }}>Admin</div></div></div>
        <nav aria-label="Admin sections">
          {NAV.map(([id, label, Icon]) => (
            <button key={id} type="button" className="adm-link" aria-current={tab === id ? "page" : undefined} onClick={() => { setTab(id); setEditing(null); }}>
              <Icon size={16} />{label}{id === "messages" && messages.length > 0 && <span className="adm-badge">{messages.length}</span>}
            </button>
          ))}
        </nav>
        <div className="adm-side-foot">
          <Link to="/" className="adm-link"><ArrowLeft size={16} />View site</Link>
          {isFirebaseConfigured && <button type="button" className="adm-link" onClick={() => signOut(auth)}><LogOut size={16} />Sign out</button>}
        </div>
      </aside>
      <main className="adm-main">
      <h1 className="h1" style={{ fontSize: 30, marginTop: 0 }}>{NAV.find((n) => n[0] === tab)[1]}</h1>
      {!isFirebaseConfigured && <div className="panel adm-card" style={{ borderColor: "var(--accent)" }}>Firebase isn't set up yet, so edits stay on this page. Use <b>Download JSON</b> and replace <code>src/data/projects.json</code> to publish them.</div>}
      {note && <div className="panel adm-card" role="status">{note}</div>}

      {tab === "overview" && (
        <>
          <div className="adm-stats">
            {[["Projects", projects.length], ["Live on site", projects.length - hiddenCount], ["Hidden", hiddenCount], ["Messages", messages.length]].map(([l, n]) => (
              <div className="panel adm-card" key={l}><div className="eyebrow" style={{ fontSize: 11 }}>{l}</div><div className="h1" style={{ fontSize: 36, margin: 0 }}>{n}</div></div>
            ))}
          </div>
          <div className="btn-row"><button className="solid" onClick={() => { setTab("projects"); setEditing(blank()); }}><Plus size={15} />New project</button><button className="thin" onClick={() => setTab("projects")}>Manage projects</button></div>
        </>
      )}
      {tab === "help" && (
        <section className="panel adm-card">
          <p className="quote">Edits you save here go live on the site straight away (when Firebase is connected). Use the eye icon to hide a project without deleting it. "Download JSON" gives you a backup copy of all projects.</p>
          <p className="quote">Contact-form messages arrive under Messages. Sign in is limited to the owner's Google account.</p>
        </section>
      )}

      {tab === "projects" && (editing ? (
        <Editor project={editing} onSave={save} onCancel={() => setEditing(null)} saving={saving} />
      ) : (
        <section className="panel adm-card">
          <div className="btn-row" style={{ marginTop: 0 }}>
            <button className="solid" onClick={() => setEditing(blank())}><Plus size={15} />New project</button>
            <button className="thin" onClick={download}><Download size={14} />Download JSON</button>
            {isFirebaseConfigured && <button className="thin" onClick={seed}><UploadCloud size={14} />Reset Firestore from code</button>}
          </div>
          <div style={{ marginTop: 14 }}>
            {sorted.map((p) => (
              <div className="proj-row" key={p.id} style={{ opacity: p.hidden ? 0.55 : 1 }}>
                <div style={{ flex: "2 1 200px", minWidth: 0 }}><div className="proj-title">{p.title}</div><div className="proj-blurb">{p.type} · {p.solution} · {p.year}{p.hidden ? " · hidden" : ""}</div></div>
                <div style={{ display: "flex", gap: 6 }}>
                  <button className="thin icon-btn" aria-label={p.hidden ? `Show ${p.title}` : `Hide ${p.title}`} onClick={() => toggleHidden(p)}>{p.hidden ? <EyeOff size={14} /> : <Eye size={14} />}</button>
                  <button className="thin" onClick={() => setEditing(p)}><Pencil size={13} />Edit</button>
                  <button className="thin icon-btn" aria-label={`Delete ${p.title}`} onClick={() => remove(p)}><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}

      {tab === "messages" && (
        <section className="panel adm-card">
          {messages.length === 0 && <p className="quote">No messages yet.</p>}
          {messages.map((m) => (
            <div key={m.id} className="proj-row" style={{ alignItems: "flex-start" }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="proj-title">{m.name} <span style={{ color: "var(--muted)", fontSize: 13 }}>· {m.reason}</span></div>
                <a href={`mailto:${m.email}`} style={{ color: "var(--accent)", fontSize: 14 }}>{m.email}</a>
                <p className="quote" style={{ whiteSpace: "pre-wrap" }}>{m.message}</p>
              </div>
              <button className="thin icon-btn" aria-label="Delete message" onClick={() => removeMessage(m.id)}><Trash2 size={14} /></button>
            </div>
          ))}
        </section>
      )}
      </main>
    </div>
  );
}
