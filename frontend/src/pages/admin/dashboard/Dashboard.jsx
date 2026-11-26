import React, { useEffect, useMemo, useRef, useState } from "react";
import Modal from "../../../components/Modal";
import { Link } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, getDocs, orderBy, query, doc, setDoc, deleteDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { sendEmail, emailReady, EMAILJS } from "../../../lib/emailConfig";
import { Plus, Pencil, Trash2, Download, UploadCloud, Eye, EyeOff, LogOut, ArrowLeft, LayoutDashboard, FolderKanban, Inbox, HelpCircle, FileText, Check, Settings, X, MessageCircle } from "lucide-react";
import { auth, db, isFirebaseConfigured } from "../../../lib/firebase";
import { ADMIN_EMAILS } from "../../../lib/firebaseConfig";
import { projectData } from "../../../data/portfolioData";
import SiteEditor from "./SiteEditor";
import { UploadField, UploadList } from "../../../components/admin/UploadField";
import { useSettings } from "../../../lib/useSettings";
import headshot from "../../../assets/home/headshot.jpg";

const TYPES = ["UX Design", "Interactive Development", "Personal Project", "Hackathon"];
const lines = (v) => v.split("\n").map((x) => x.trim()).filter(Boolean);
const slug = (t) => "proj-" + (t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || Date.now());

const blank = () => ({ id: "", title: "", type: TYPES[0], solution: "", year: new Date().getFullYear(), shortDescription: "", fullDescription: "", tagline: "", role: "", status: "", hidden: false, tools: [], team: [], highlights: [], actions: [], thumbnail: "", gallery: [], reflection: "", adventure: "", quest: "", video: "", wireframes: [], wireframeNote: "", hasTeam: false, volumeWarning: false, videoKind: "demo" });

// form <-> project conversion (arrays become editable text)
const toForm = (p) => ({ ...blank(), ...p, tools: (p.tools || []).join(", "), team: (p.team || []).join("\n"), highlights: (p.highlights || []).join("\n"), actions: (p.actions || []).map((a) => `${a.label} | ${a.url}`).join("\n"), gallery: (p.gallery || []).join("\n"), wireframes: (p.wireframes || []).join("\n"), hasTeam: p.hasTeam !== undefined ? !!p.hasTeam : (p.team || []).length > 0, videoOn: !!p.video, hasWires: (p.wireframes || []).length > 0 });
const fromForm = (f) => ({
  ...f,
  id: f.id || slug(f.title),
  year: Number(f.year) || new Date().getFullYear(),
  category: f.type === "UX Design" ? "ux" : "dev",
  tools: f.tools.split(",").map((x) => x.trim()).filter(Boolean),
  team: lines(f.team),
  highlights: lines(f.highlights),
  gallery: lines(f.gallery),
  wireframes: f.hasWires === false ? [] : lines(f.wireframes || ""),
  wireframeNote: f.hasWires === false ? "" : f.wireframeNote,
  video: f.videoOn ? (f.video || "") : "",
  team: f.hasTeam ? lines(f.team) : [],
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

// Reply by email to someone who left a message or a chat note
function ReplyBox({ to, name, original, template, onSent }) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [st, setSt] = useState("");
  if (!to) return null;
  const send = async () => {
    if (!template) {
      const q = (original || "").split("\n").map((l) => "> " + l).join("\n");
      const body = `${text}\n\n${name || "You"} wrote:\n${q}`;
      window.location.href = `mailto:${to}?subject=${encodeURIComponent("Re: your message to Gaby Norris")}&body=${encodeURIComponent(body)}`;
      setSt("Opening your email app with the reply ready to send.");
      onSent && onSent();
      return;
    }
    setSt("Sending…");
    const ok = await sendEmail(template, { to_email: to, to_name: name || "there", reply: text, their_message: original, subject: "Reply from Gaby Norris" });
    setSt(ok ? "Sent." : "That did not send. Check the template ID.");
    if (ok) { setText(""); setOpen(false); onSent && onSent(); }
  };
  return (
    <div style={{ marginTop: 6 }}>
      {!open ? <button type="button" className="thin" onClick={() => setOpen(true)}>Reply by email</button> : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <textarea style={{ minHeight: 90 }} value={text} onChange={(e) => setText(e.target.value)} placeholder={`Write your reply to ${name || "them"}. Their message is quoted underneath automatically.`} />
          <div style={{ display: "flex", gap: 8 }}><button type="button" className="solid" disabled={!text.trim()} onClick={send}>Send email</button><button type="button" className="thin" onClick={() => setOpen(false)}>Cancel</button></div>
        </div>
      )}
      {st && <div role="status" style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}>{st}</div>}
    </div>
  );
}

const ETABS = [["info", "Project info"], ["story", "The story"], ["team", "Team"], ["media", "Media"], ["links", "Links"]];

function Editor({ project, onSave, onCancel, saving, apiRef }) {
  const [f, setF] = useState(() => toForm(project));
  const [tab, setTab] = useState("info");
  const [bad, setBad] = useState("");
  const start = useRef(JSON.stringify(toForm(project)));
  const dirty = () => JSON.stringify(f) !== start.current;
  const set = (k) => (e) => setF({ ...f, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value });
  const submit = async () => {
    if (!f.title.trim()) { setTab("info"); setBad("Give the project a title first."); return false; }
    setBad("");
    await onSave(fromForm(f));
    start.current = JSON.stringify(f);
    return true;
  };
  if (apiRef) apiRef.current = { dirty, submit };
  useEffect(() => {
    const h = (e) => { if (dirty()) { e.preventDefault(); e.returnValue = ""; } };
    window.addEventListener("beforeunload", h);
    return () => window.removeEventListener("beforeunload", h);
  });
  const hasWires = f.hasWires !== undefined ? f.hasWires : (f.wireframes || "").trim().length > 0;
  const pane = (id, children) => <div className="adm-grid" hidden={tab !== id}>{children}</div>;
  return (
    <form className="panel adm-card ed" onSubmit={(e) => { e.preventDefault(); submit(); }}>
      <div className="ed-bar">
        <div className="sec-h" style={{ margin: 0 }}>{project.id ? `Edit: ${project.title}` : "New project"}{dirty() && <span className="ed-dirty">Unsaved changes</span>}</div>
        <div className="btn-row" style={{ margin: 0 }}>
          <button type="button" className="thin" onClick={onCancel}>Close</button>
          <button className="solid" disabled={saving}>{saving ? "Saving…" : "Save project"}</button>
        </div>
      </div>
      {bad && <div className="status-err" role="alert">{bad}</div>}
      <div className="subchips" role="tablist" aria-label="Project sections">
        {ETABS.map(([id, l]) => <button key={id} type="button" role="tab" className="chip" aria-selected={tab === id} aria-pressed={tab === id} onClick={() => setTab(id)}>{l}</button>)}
      </div>
      {pane("info", <>
        <Field label="Title"><input value={f.title} onChange={set("title")} /></Field>
        <Field label="Type"><select value={f.type} onChange={set("type")}>{[...new Set([...TYPES, f.type])].map((t) => <option key={t}>{t}</option>)}</select></Field>
        <Field label="Solution (e.g. Mobile App)"><input value={f.solution} onChange={set("solution")} /></Field>
        <Field label="Year"><input type="number" value={f.year} onChange={set("year")} /></Field>
        <Field label="Tagline"><input value={f.tagline} onChange={set("tagline")} /></Field>
        <Field label="Status (e.g. Incomplete)"><input value={f.status} onChange={set("status")} /></Field>
        <Field label="Short description (project list, 1 to 2 lines)" wide><input value={f.shortDescription} onChange={set("shortDescription")} /></Field>
        <Field label="Tools (comma separated)" wide><input value={f.tools} onChange={set("tools")} /></Field>
        <Field label="Thumbnail (the case-study header. Only shown in the project list)" wide><UploadField value={f.thumbnail} onChange={(v) => setF({ ...f, thumbnail: v })} /></Field>
        <Field label="Visibility"><label className="chk"><input type="checkbox" checked={f.hidden} onChange={set("hidden")} /> Hide this project from the site</label></Field>
      </>)}
      {pane("story", <>
        <Field label="The adventure: what the product is and what the solution was (shown first, top right)" wide><textarea value={f.adventure} onChange={set("adventure")} /></Field>
        <Field label="The quest: what was asked of me, the brief" wide><textarea value={f.quest} onChange={set("quest")} /></Field>
        <Field label="Summary / full story" wide><textarea value={f.fullDescription} onChange={set("fullDescription")} /></Field>
        <Field label="Highlights (one per line)"><textarea style={{ minHeight: 90 }} value={f.highlights} onChange={set("highlights")} /></Field>
        <Field label="Reflection"><textarea style={{ minHeight: 90 }} value={f.reflection} onChange={set("reflection")} /></Field>
      </>)}
      {pane("team", <>
        <Field label="Team project?" wide><label className="chk"><input type="checkbox" checked={f.hasTeam} onChange={set("hasTeam")} /> Yes, I worked with other people</label></Field>
        {f.hasTeam && <Field label="My role in the team"><input value={f.role} onChange={set("role")} /></Field>}
        {f.hasTeam && <Field label="Team (one per line, add a link after a slash)"><textarea style={{ minHeight: 90 }} placeholder={"André van Heerden / https://github.com/andre\nKeabetswe Olifant / keabetswe"} value={f.team} onChange={set("team")} /></Field>}
      </>)}
      {pane("media", <>
        <Field label="Project images (shown first on the project page, above the video)" wide><UploadList value={f.gallery} onChange={(v) => setF({ ...f, gallery: v })} /></Field>
        <Field label="Video" wide>
          <label className="chk"><input type="checkbox" checked={!!f.videoOn} onChange={set("videoOn")} /> This project has a video. It plays first, muted.</label>
          {f.videoOn && <select value={f.videoKind || "demo"} onChange={set("videoKind")} aria-label="Video type"><option value="demo">Demo video (the working product)</option><option value="mockup">Mock-up video (the design)</option></select>}
          {f.videoOn && <UploadField kind="video" accept="video/*" value={f.video} onChange={(v) => setF({ ...f, video: v })} placeholder="Upload a video, or paste a link" />}
        </Field>
        <Field label="Wireframes" wide>
          <label className="chk"><input type="checkbox" checked={hasWires} onChange={(e) => setF({ ...f, hasWires: e.target.checked })} /> This project has wireframes</label>
          {hasWires && <UploadList value={f.wireframes} onChange={(v) => setF({ ...f, wireframes: v })} />}
          {hasWires && <textarea placeholder="Why wireframes helped, or what struggled (shown under the strip)" value={f.wireframeNote} onChange={set("wireframeNote")} />}
        </Field>
      </>)}
      {pane("links", <>
        <Field label="Links (one per line: Label | https://url)" wide><textarea style={{ minHeight: 80 }} value={f.actions} onChange={set("actions")} placeholder={"Figma file | https://figma.com/...\nGitHub repo | https://github.com/..."} /></Field>
        <Field label="Loud prototype"><label className="chk"><input type="checkbox" checked={!!f.volumeWarning} onChange={set("volumeWarning")} /> Warn visitors to lower their volume before the prototype opens</label></Field>
      </>)}
    </form>
  );
}

export default function Dashboard() {
  const [user, setUser] = useState(isFirebaseConfigured ? undefined : null);
  const [tab, setTab] = useState("projects");
  const [projects, setProjects] = useState(projectData);
  const [source, setSource] = useState("local");
  const [messages, setMessages] = useState([]);
  const [cvReqs, setCvReqs] = useState([]);
  const [chat, setChat] = useState([]);
  const readLs = (k) => { try { return localStorage.getItem(k) || ""; } catch { return ""; } };
  const cfg = useSettings();
  const [linksDraft, setLinksDraft] = useState(null);
  const [cvSub, setCvSub] = useState("pending");
  const [kindFor, setKindFor] = useState({});
  const [cvOpen, setCvOpen] = useState(null);
  const [views, setViews] = useState([]);
  const [preview, setPreview] = useState(null);
  const cvLinks = { dev: cfg.cvLinks.dev || readLs("cvDev") || readLs("cvLink"), ux: cfg.cvLinks.ux || readLs("cvUx"), hybrid: cfg.cvLinks.hybrid };
  const [editing, setEditing] = useState(null);
  const edRef = useRef(null);
  const [ask, setAsk] = useState(null);
  // leaving the editor with unsaved changes asks first
  const guard = (go) => { if (editing && edRef.current && edRef.current.dirty()) setAsk({ go }); else go(); };
  const [saving, setSaving] = useState(false);
  const [note, setNote] = useState("");

  useEffect(() => { if (isFirebaseConfigured) return onAuthStateChanged(auth, setUser); }, []);
  const isAdmin = !isFirebaseConfigured || ADMIN_EMAILS.includes((user?.email || "").toLowerCase());

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
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setMessages(list);
      return list;
    } catch (e) { setNote(e.message); }
  };
  const syncCount = async (list) => { try { await setDoc(doc(db, "meta", "unresolved"), { count: list.filter((m) => !m.resolved).length }); } catch (e) { console.warn(e.message); } };
  const loadCv = async () => {
    if (!isFirebaseConfigured) return;
    try { const snap = await getDocs(query(collection(db, "cvRequests"), orderBy("createdAt", "desc"))); setCvReqs(snap.docs.map((d) => ({ id: d.id, ...d.data() }))); } catch (e) { console.warn(e.message); }
  };
  useEffect(() => { if (isAdmin) { loadProjects(); loadMessages().then((l) => l && syncCount(l)); loadCv(); loadChat(); loadViews(); } }, [isAdmin]);

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
  const loadViews = async () => {
    if (!isFirebaseConfigured) return;
    try { const snap = await getDocs(collection(db, "views")); setViews(snap.docs.map((d) => ({ id: d.id, count: d.data().count || 0 }))); } catch (e) { console.warn(e.message); }
  };
  const loadChat = async () => {
    if (!isFirebaseConfigured) return;
    try { const snap = await getDocs(query(collection(db, "chat"), orderBy("createdAt", "desc"))); setChat(snap.docs.map((d) => ({ id: d.id, ...d.data() }))); } catch (e) { console.warn(e.message); }
  };
  const removeChat = async (id) => { await deleteDoc(doc(db, "chat", id)); loadChat(); };
  const removeMessage = async (id) => { await deleteDoc(doc(db, "messages", id)); const l = await loadMessages(); l && syncCount(l); };
  const toggleResolved = async (m) => { await updateDoc(doc(db, "messages", m.id), { resolved: !m.resolved }); const l = await loadMessages(); l && syncCount(l); };
  const CVNAMES = { dev: "Development CV", ux: "UX CV", hybrid: "Hybrid CV" };
  const defaultKind = (r) => (r.interest === "Software development" ? "dev" : r.interest === "User experience design" ? "ux" : "hybrid");
  const [personal, setPersonal] = useState({});
  const saveCvLinks = async () => {
    try { await setDoc(doc(db, "settings", "site"), { cvLinks: linksDraft }, { merge: true }); setLinksDraft(null); setNote("CV links saved."); } catch (e) { setNote("Could not save CV links: " + e.message); }
  };
  const setStatus = async (r, status) => { await updateDoc(doc(db, "cvRequests", r.id), { status }); loadCv(); };
  const sendCv = async (r) => {
    const kind = kindFor[r.id] || defaultKind(r);
    const cvLink = cvLinks[kind];
    if (!cvLink) { setNote(`Add your ${CVNAMES[kind]} link first (the "CV links" button).`); return; }
    const ok = await sendEmail(EMAILJS.cvTemplate, { to_email: r.email, to_name: r.name, cv_link: cvLink, personal_message: personal[r.id] || "", interest: r.interest || "" });
    if (!ok) { window.location.href = `mailto:${r.email}?subject=${encodeURIComponent("My CV")}&body=${encodeURIComponent(`Hi ${r.name},\n\n${personal[r.id] ? personal[r.id] + "\n\n" : "Thanks for your interest. "}Here is my CV: ${cvLink}\n\nGaby`)}`; }
    await updateDoc(doc(db, "cvRequests", r.id), { status: "sent", sentCv: kind, sentAt: serverTimestamp() });
    setNote(ok ? `${CVNAMES[kind]} sent to ${r.email}.` : "EmailJS isn't set up yet, so I opened your email app instead.");
    loadCv();
  };
  const dateOf = (r) => { try { return r.createdAt.toDate().toLocaleDateString(); } catch { return ""; } };
  const exportCsv = () => {
    const rows = [["Name", "Company", "Email", "Looking for", "Status", "CV sent", "Date", "Reason"], ...cvReqs.map((r) => [r.name, r.company, r.email, r.interest || "", r.status || "pending", r.sentCv ? CVNAMES[r.sentCv] : "", dateOf(r), (r.reason || "").replace(/\s+/g, " ")])];
    const csv = rows.map((r) => r.map((c) => `"${String(c ?? "").replace(/"/g, '""')}"`).join(",")).join("\n");
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" })); a.download = "cv-mailing-list.csv"; a.click();
  };
  const removeCv = async (id) => { await deleteDoc(doc(db, "cvRequests", id)); loadCv(); };
  const unresolved = messages.filter((m) => !m.resolved).length;
  const pendingCv = cvReqs.filter((r) => !r.status || r.status === "pending").length;

  if (user === undefined) return <main className="page"><p className="lede">Loading…</p></main>;
  if (!isAdmin) return <main className="page"><div className="panel adm-card"><h1 className="h2">Not authorised</h1><p className="lede">Please <Link to="/auth" style={{ color: "var(--accent)" }}>sign in</Link> with the owner account.</p></div></main>;

  const NAV = [["overview", "Overview", LayoutDashboard], ["projects", "Projects", FolderKanban], ["messages", "Messages", Inbox], ["cv", "CV requests", FileText], ["about", "Content editor", Pencil], ["site", "Site settings", Settings], ["help", "How to publish", HelpCircle]];
  const hiddenCount = projects.filter((p) => p.hidden).length;
  return (
    <div className="adm-shell">
      <aside className="adm-side">
        <div className="adm-brand"><img src={headshot} alt="" className="adm-avatar" /><div><b>Portfolio</b><div style={{ fontSize: 12, color: "var(--muted)" }}>Admin</div></div></div>
        <nav aria-label="Admin sections">
          {NAV.map(([id, label, Icon]) => (
            <button key={id} type="button" className="adm-link" aria-current={tab === id ? "page" : undefined} onClick={() => guard(() => { setTab(id); setEditing(null); })}>
              <Icon size={16} />{label}{id === "messages" && unresolved > 0 && <span className="adm-badge">{unresolved}</span>}{id === "cv" && pendingCv > 0 && <span className="adm-badge">{pendingCv}</span>}
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

      {tab === "overview" && (() => {
        const ms = (x) => { try { return x.createdAt.toMillis(); } catch { return 0; } };
        const ago = (t) => { if (!t) return ""; const m = Math.round((Date.now() - t) / 60000); return m < 60 ? `${Math.max(m, 1)}m ago` : m < 1440 ? `${Math.round(m / 60)}h ago` : `${Math.round(m / 1440)}d ago`; };
        const feed = [
          ...messages.map((m) => ({ k: "msg", id: m.id, who: m.name, text: m.message, t: ms(m), go: () => setTab("messages") })),
          ...cvReqs.map((r) => ({ k: "cv", id: r.id, who: r.name, text: `asked for your CV · ${r.status || "pending"}`, t: ms(r), go: () => { setTab("cv"); setCvOpen(r.id); } })),
          ...chat.map((c) => ({ k: "chat", id: c.id, who: c.name || "Anonymous", text: c.text, t: ms(c), go: () => setTab("messages") })),
        ].sort((a, b) => b.t - a.t).slice(0, 8);
        const IC = { msg: Inbox, cv: FileText, chat: MessageCircle };
        const top = [...views].sort((x, y) => y.count - x.count).slice(0, 6);
        const max = Math.max(1, ...top.map((v) => v.count));
        const totalViews = views.reduce((n, v) => n + v.count, 0);
        const rows = [["Projects live", `${projects.length - hiddenCount} of ${projects.length}`], ["Total project views", totalViews], ["CVs sent", cvReqs.filter((r) => r.status === "sent").length], ["People in mailing list", new Set(cvReqs.map((r) => (r.email || "").toLowerCase()).filter(Boolean)).size], ["Chat messages", chat.length]];
        return (
          <div className="adm-scroll">
            <div className="ov-attn">
              {[["Messages to answer", unresolved, "messages", Inbox], ["CV requests waiting", pendingCv, "cv", FileText]].map(([l, n, t, Icon]) => (
                <button type="button" key={l} className={`ov-card ${n ? "on" : ""}`} onClick={() => setTab(t)}>
                  <Icon size={22} /><div><div className="ov-num">{n}</div><div className="ov-lbl">{n ? l : "All clear · " + l.toLowerCase()}</div></div>
                </button>
              ))}
              <button type="button" className="ov-card" onClick={() => { setTab("projects"); setEditing(blank()); }}><Plus size={22} /><div><div className="ov-lbl" style={{ fontSize: 16, color: "var(--text)" }}>New project</div><div className="ov-lbl">Add to the quest log</div></div></button>
            </div>
            <div className="ov-grid">
              <section className="panel adm-card"><div className="sec-h">Recent activity</div>
                {feed.length === 0 && <p className="quote">Nothing yet. Messages, CV requests and chat will show up here.</p>}
                {feed.map((f) => { const Icon = IC[f.k]; return (
                  <button type="button" key={f.k + f.id} className="ov-row" onClick={f.go}><span className={`ov-ic ${f.k}`}><Icon size={15} /></span><span className="ov-body"><b>{f.who}</b><span>{f.text}</span></span><time>{ago(f.t)}</time></button>
                ); })}
              </section>
              <div className="ov-side">
                <section className="panel adm-card"><div className="sec-h">Most viewed</div>
                  {top.length === 0 && <p className="quote">Views are counted from now on.</p>}
                  {top.map((v) => (
                    <div key={v.id} className="ov-bar"><div className="ov-bar-top"><span>{(projects.find((p) => p.id === v.id) || {}).title || v.id}</span><b>{v.count}</b></div><div className="ov-track"><i style={{ width: `${(v.count / max) * 100}%` }} /></div></div>
                  ))}
                </section>
                <section className="panel adm-card"><div className="sec-h">At a glance</div>
                  {rows.map(([l, n]) => <div key={l} className="ov-line"><span>{l}</span><b>{n}</b></div>)}
                </section>
              </div>
            </div>
          </div>
        );
      })()}
      {ask && (
        <Modal title="You have unsaved changes" onClose={() => setAsk(null)} actions={<>
          <button type="button" className="solid" onClick={async () => { const ok = await edRef.current.submit(); if (ok) { const g = ask.go; setAsk(null); g(); } else setAsk(null); }}>Save changes</button>
          <button type="button" className="thin" onClick={() => { const g = ask.go; setAsk(null); g(); }}>Discard changes</button>
          <button type="button" className="thin" onClick={() => setAsk(null)}>Keep editing</button>
        </>}>Do you want to save what you changed in this project before you leave?</Modal>
      )}
      {(tab === "about" || tab === "site") && <div className="adm-scroll"><SiteEditor key={tab} section={tab} /></div>}
      {tab === "help" && (
        <section className="panel adm-card">
          <p className="quote">Edits you save here go live on the site straight away (when Firebase is connected). Use the eye icon to hide a project without deleting it. "Download JSON" gives you a backup copy of all projects.</p>
          <p className="quote">Contact-form messages arrive under Messages. Sign in is limited to the owner's Google account.</p>
        </section>
      )}

      {tab === "projects" && (editing ? (
        <Editor key={editing.id || "new"} project={editing} onSave={save} onCancel={() => guard(() => setEditing(null))} saving={saving} apiRef={edRef} />
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
                <div style={{ flex: "2 1 200px", minWidth: 0, cursor: "pointer" }} onClick={() => setPreview(p)}><div className="proj-title">{p.title}</div><div className="proj-blurb">{p.type} · {p.solution} · {p.year}{p.hidden ? " · hidden" : ""}</div></div>
                <div style={{ display: "flex", gap: 6 }}>
                  <button className="thin icon-btn" aria-label={p.hidden ? `Show ${p.title}` : `Hide ${p.title}`} onClick={() => toggleHidden(p)}>{p.hidden ? <EyeOff size={14} /> : <Eye size={14} />}</button>
                  <button className="thin" onClick={() => setEditing(p)}><Pencil size={13} />Edit</button>
                  <button className="thin icon-btn" aria-label={`Delete ${p.title}`} onClick={() => remove(p)}><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>
          {preview && (
            <div className="drawer-proj" role="dialog" aria-label={`${preview.title} details`}>
              <div className="drawer-scrim" onClick={() => setPreview(null)} aria-hidden="true" />
              <aside className="drawer" style={{ width: 460 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><span className="cz" style={{ fontWeight: 700, fontSize: 20 }}>{preview.title}</span><button className="thin icon-btn" aria-label="Close" onClick={() => setPreview(null)}><X size={14} /></button></div>
                {preview.thumbnail && <img src={/^https?:/.test(preview.thumbnail) ? preview.thumbnail : import.meta.env.BASE_URL + preview.thumbnail} alt="" style={{ width: "100%", borderRadius: 8 }} />}
                <div className="rc" style={{ color: "var(--accent)" }}>{preview.type} · {preview.solution} · {preview.year}{preview.status ? ` · ${preview.status}` : ""}{preview.hidden ? " · hidden" : ""}</div>
                {preview.tagline && <div><b>Tagline:</b> {preview.tagline}</div>}
                <div className="quote" style={{ margin: 0 }}>{preview.adventure || preview.fullDescription || preview.shortDescription}</div>
                {preview.quest && <div className="quote" style={{ margin: 0 }}><b>Quest:</b> {preview.quest}</div>}
                <div className="rc" style={{ fontSize: 13, color: "var(--text-2)", lineHeight: 1.7 }}>
                  Role: {preview.role || "–"}<br />Team: {preview.hasTeam !== false && (preview.team || []).length ? preview.team.join(", ") : "no team"}<br />
                  Tools: {(preview.tools || []).join(", ") || "–"}<br />Video: {preview.video ? "yes" : "no"} · Images: {1 * !!preview.thumbnail + (preview.gallery || []).length} · Wireframes: {(preview.wireframes || []).length} · Highlights: {(preview.highlights || []).length}<br />
                  Links: {(preview.actions || []).map((a) => a.label).join(", ") || "–"}
                </div>
                <div className="btn-row"><button className="solid" onClick={() => { setEditing(preview); setPreview(null); }}><Pencil size={13} />Edit</button><Link className="thin" to={`/project/${preview.id}`}>View on site</Link></div>
              </aside>
            </div>
          )}
        </section>
      ))}

      {tab === "cv" && (
        <section className="panel adm-card">
          <div className="subchips" style={{ marginBottom: 14 }}>
            {[["pending", "Pending"], ["sent", "Sent"], ["denied", "Denied"], ["list", "Mailing list"]].map(([id, l]) => (
              <button key={id} type="button" className="chip" aria-pressed={cvSub === id} onClick={() => setCvSub(id)}>{l} ({id === "list" ? cvReqs.length : cvReqs.filter((r) => (r.status || "pending") === id).length})</button>
            ))}
            <button type="button" className="thin cv-btn" onClick={() => setLinksDraft(linksDraft ? null : { ...cvLinks })}><Settings size={14} />CV links</button>
          </div>
          {linksDraft && (
            <div className="panel adm-card" style={{ marginBottom: 14 }}>
              <div className="sec-h">Your three CV links (stored permanently)</div>
              <div className="adm-grid">
                {Object.keys(CVNAMES).map((k) => <Field key={k} label={CVNAMES[k]}><input placeholder="https://drive.google.com/…" value={linksDraft[k] || ""} onChange={(e) => setLinksDraft({ ...linksDraft, [k]: e.target.value })} /></Field>)}
              </div>
              <div className="btn-row"><button className="solid" onClick={saveCvLinks}>Save links</button><button className="thin" onClick={() => setLinksDraft(null)}>Cancel</button></div>
            </div>
          )}
          {!emailReady() && <p className="quote">EmailJS isn't set up yet, so "Send CV" will open your email app instead.</p>}
          {cvSub !== "list" && cvReqs.filter((r) => (r.status || "pending") === cvSub).length === 0 && <p className="quote">Nothing here yet.</p>}
          {cvSub !== "list" && cvReqs.filter((r) => (r.status || "pending") === cvSub).length > 0 && (
            <table className="adm-table">
              <thead><tr><th>Name</th><th>Company</th><th>Looking for</th><th>Date</th><th>Status</th></tr></thead>
              <tbody>
                {cvReqs.filter((r) => (r.status || "pending") === cvSub).map((r) => (
                  <tr key={r.id} tabIndex={0} onClick={() => setCvOpen(r.id)} onKeyDown={(e) => e.key === "Enter" && setCvOpen(r.id)}>
                    <td><b>{r.name}</b></td><td>{r.company}</td><td>{r.interest || "–"}</td><td>{dateOf(r)}</td><td><span className={`st st-${r.status || "pending"}`}>{r.status === "sent" ? "Sent" : r.status === "denied" ? "Denied" : "Pending"}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {(() => {
            const r = cvReqs.find((x) => x.id === cvOpen);
            if (!r) return null;
            return (
              <div className="cv-back" role="dialog" aria-modal="true" aria-label="CV request" onClick={(e) => e.target === e.currentTarget && setCvOpen(null)}>
                <div className="cv-modal" style={{ maxWidth: 560, width: "min(560px,100%)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><h2 className="h2" style={{ fontSize: 22, margin: 0 }}>{r.name}</h2><button className="thin icon-btn" aria-label="Close" onClick={() => setCvOpen(null)}><X size={14} /></button></div>
                  <div className="rc" style={{ color: "var(--text-2)", lineHeight: 1.7 }}>{r.company} · {dateOf(r)}<br />Looking for: {r.interest || "–"}<br /><a href={`mailto:${r.email}`} style={{ color: "var(--accent)" }}>{r.email}</a>{r.sentCv ? <><br />Sent: {CVNAMES[r.sentCv]}</> : null}</div>
                  <p className="quote" style={{ whiteSpace: "pre-wrap", margin: 0 }}>{r.reason}</p>
                  <div className="field"><label>Which CV to send</label><select value={kindFor[r.id] || defaultKind(r)} onChange={(e) => setKindFor({ ...kindFor, [r.id]: e.target.value })}>{Object.entries(CVNAMES).map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select></div>
                  <div className="field"><label>Personal note in the email (optional)</label><textarea placeholder="Makes it feel personal" value={personal[r.id] || ""} onChange={(e) => setPersonal({ ...personal, [r.id]: e.target.value })} /></div>
                  <div className="btn-row" style={{ marginTop: 0 }}>
                    <button className="solid" onClick={async () => { await sendCv(r); setCvOpen(null); }}>{r.status === "sent" ? "Send again" : "Send"}</button>
                    {r.status !== "denied" && <button className="thin" onClick={async () => { await setStatus(r, "denied"); setCvOpen(null); }}>Deny</button>}
                    {r.status && r.status !== "pending" && <button className="thin" onClick={async () => { await setStatus(r, "pending"); setCvOpen(null); }}>Move to pending</button>}
                    <a className="thin" href={`mailto:${r.email}`}>Email</a>
                  </div>
                </div>
              </div>
            );
          })()}
          {cvSub === "list" && (
            <>
              <div className="btn-row" style={{ marginTop: 0 }}><button className="thin" onClick={exportCsv}><Download size={14} />Download as CSV</button></div>
              <p style={{ fontSize: 12, color: "var(--muted)" }}>Everyone who has ever asked for your CV. Stored permanently in your database, so you can email them later.</p>
              {cvReqs.map((r) => (
                <div key={r.id} className="proj-row" style={{ alignItems: "center" }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="proj-title">{r.name} <span style={{ color: "var(--muted)", fontSize: 13 }}>· {r.company} · {r.interest || ""} · {r.status || "pending"} · {dateOf(r)}</span></div>
                    <a href={`mailto:${r.email}`} style={{ color: "var(--accent)", fontSize: 14 }}>{r.email}</a>
                  </div>
                  <a className="thin" href={`mailto:${r.email}`}>Email</a>
                  <button className="thin icon-btn" aria-label="Delete from list" onClick={() => window.confirm(`Remove ${r.name} from your records for good?`) && removeCv(r.id)}><Trash2 size={14} /></button>
                </div>
              ))}
            </>
          )}
        </section>
      )}

      {tab === "messages" && (
        <section className="panel adm-card">
          {messages.length === 0 && <p className="quote">No messages yet.</p>}
          {messages.map((m) => (
            <div key={m.id} className="proj-row" style={{ alignItems: "flex-start" }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="proj-title">{m.name} <span style={{ color: "var(--muted)", fontSize: 13 }}>· {m.reason}</span></div>
                <a href={`mailto:${m.email}`} style={{ color: "var(--accent)", fontSize: 14 }}>{m.email}</a>
                <p className="quote" style={{ whiteSpace: "pre-wrap" }}>{m.message}</p>
                <ReplyBox to={m.email} name={m.name} original={m.message} template={cfg.replyTemplate} onSent={() => !m.resolved && toggleResolved(m)} />
              </div>
              <button className="thin" onClick={() => toggleResolved(m)}><Check size={14} />{m.resolved ? "Resolved" : "Mark resolved"}</button>
              <button className="thin icon-btn" aria-label="Delete message" onClick={() => removeMessage(m.id)}><Trash2 size={14} /></button>
            </div>
          ))}
          <div className="sec-h" style={{ marginTop: 22 }}>Game-log chat ({chat.length})</div>
          {chat.length === 0 && <p className="quote">No chat messages yet.</p>}
          {chat.map((c) => (
            <div key={c.id} className="proj-row" style={{ alignItems: "flex-start" }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="proj-title">{c.name || "Anonymous"} {c.email && <a href={`mailto:${c.email}`} style={{ color: "var(--accent)", fontSize: 14 }}>· {c.email}</a>}</div>
                <p className="quote" style={{ whiteSpace: "pre-wrap" }}>{c.text}</p>
                <ReplyBox to={c.email} name={c.name} original={c.text} template={cfg.replyTemplate} />
              </div>
              <button className="thin icon-btn" aria-label="Delete chat message" onClick={() => removeChat(c.id)}><Trash2 size={14} /></button>
            </div>
          ))}
        </section>
      )}
      </main>
    </div>
  );
}
