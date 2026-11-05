import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { FaLinkedin } from "react-icons/fa";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useProjects } from "../../../lib/useProjects";
import { db, isFirebaseConfigured } from "../../../lib/firebase";
import { ADMIN_EMAIL } from "../../../lib/firebaseConfig";
import { LINKS } from "../../../lib/siteConfig";
import { useDice } from "../../../lib/dice";
import { pageContent } from "../../../data/portfolioData";
import { TAB_EVENT } from "../tabBus";
import D20 from "../../../components/sheet/D20";

const TABS = [["overview", "Overview"], ["projects", "Projects"], ["about", "About"], ["contact", "Contact"]];
const find = (id) => pageContent.find((c) => c.id === id);
const real = (t) => (t && t !== "..." ? t : null);

export const blurb = (p) => real(p.shortDescription) || real(p.fullDescription) || "Details coming soon.";

function Overview({ go }) {
  const { projects } = useProjects();
  const ref = useRef(null);
  const list = useMemo(() => [...projects].sort((a, b) => b.year - a.year || a.title.localeCompare(b.title)), [projects]);
  const scroll = (d) => ref.current && ref.current.scrollBy({ left: d * 420, behavior: "smooth" });
  return (
    <>
      <div className="eyebrow">Hi, I'm</div>
      <h1 className="h1">Gaby Norris</h1>
      <div className="sub">Interactive Developer &amp; UX Designer</div>
      <p className="lede">{find("content-001").description}</p>

      <div className="car-head">
        <div className="sec-h" style={{ flex: 1, marginBottom: 0, marginRight: 14 }}>Recent quests</div>
        <div className="car-arrows">
          <button type="button" className="thin icon-btn" aria-label="Scroll projects left" onClick={() => scroll(-1)}><ChevronLeft size={14} /></button>
          <button type="button" className="thin icon-btn" aria-label="Scroll projects right" onClick={() => scroll(1)}><ChevronRight size={14} /></button>
        </div>
      </div>
      <div className="car" ref={ref} tabIndex={0} aria-label="Project thumbnails">
        {list.map((p) => (
          <Link key={p.id} to={`/project/${p.id}`} className="car-card">
            <div className="car-thumb">{p.title.charAt(0)}</div>
            <div className="car-meta"><b>{p.title}</b><span>{p.type} · {p.year}</span></div>
          </Link>
        ))}
      </div>

      <div className="btn-row">
        <button type="button" className="solid" onClick={() => go("projects")}>Open the quest log</button>
        <button type="button" className="thin" style={{ minHeight: 36, padding: "0 18px", fontSize: 13 }} onClick={() => go("contact")}>Send a raven</button>
      </div>
    </>
  );
}

function Projects() {
  const { projects } = useProjects();
  const [type, setType] = useState("All");
  const [year, setYear] = useState("All");
  const types = useMemo(() => ["All", ...new Set(projects.map((p) => p.type))], [projects]);
  const years = useMemo(() => {
    const ys = new Set(projects.map((p) => p.year));
    ys.add(new Date().getFullYear() + 1); // a "future" year for the joke
    return [...ys].sort((a, b) => b - a);
  }, [projects]);

  const shown = useMemo(() => projects
    .filter((p) => (type === "All" || p.type === type) && (year === "All" || p.year === Number(year)))
    .sort((a, b) => b.year - a.year || a.title.localeCompare(b.title)), [projects, type, year]);

  const future = year !== "All" && Number(year) > Math.max(...projects.map((p) => p.year));

  return (
    <>
      <div className="proj-bar">
        {types.map((t) => (
          <button key={t} type="button" className="chip" aria-pressed={type === t} onClick={() => setType(t)}>{t}</button>
        ))}
        <select className="year-select" value={year} onChange={(e) => setYear(e.target.value)} aria-label="Filter by year">
          <option value="All">All years</option>
          {years.map((y) => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>

      {shown.length > 0 && (
        <div className="proj-head">
          <span style={{ flex: "2 1 180px" }}>Project</span><span style={{ flex: "1 1 120px" }}>Type</span>
          <span style={{ flex: "0 0 44px" }}>Year</span><span style={{ flex: "1 1 110px" }}>Solution</span><span style={{ flex: "0 0 110px" }} />
        </div>
      )}
      {shown.map((p) => (
        <div className="proj-row" key={p.id}>
          <div className="proj-ico">{p.title.charAt(0)}</div>
          <div style={{ flex: "2 1 180px", minWidth: 0 }}>
            <div className="proj-title">{p.title}</div>
            <div className="proj-blurb">{blurb(p)}</div>
          </div>
          <div className="proj-cell" style={{ flex: "1 1 120px" }}>{p.type}</div>
          <div className="proj-cell" style={{ flex: "0 0 44px" }}>{p.year}</div>
          <div className="proj-cell" style={{ flex: "1 1 110px" }}>{p.solution}</div>
          <Link to={`/project/${p.id}`} className="thin" style={{ flex: "0 0 110px", justifyContent: "center", gap: 6, fontSize: 11, letterSpacing: ".1em" }} aria-label={`View quest: ${p.title}`}>
            View quest <ChevronRight size={12} />
          </Link>
        </div>
      ))}
      {shown.length === 0 && (
        <div className="empty">
          <D20 size={34} stroke="var(--accent)" />
          <div className="cz" style={{ marginTop: 8 }}>{future ? "The adventure's just beginning" : "No quests found"}</div>
          <p style={{ margin: "6px 0 0", color: "var(--muted)" }}>{future ? "Nothing logged for that year yet. Roll for initiative and check back soon." : "Try another type or year."}</p>
        </div>
      )}
    </>
  );
}

const ABOUT = [["content-002", "Developer", "The developer"], ["content-003", "Designer", "The designer"], ["content-004", "Tinkerer", "The tinkerer"]];

function About() {
  const [f, setF] = useState("All");
  return (
    <>
      <div className="subchips">
        {["All", ...ABOUT.map((a) => a[1])].map((t) => (
          <button key={t} type="button" className="chip" aria-pressed={f === t} onClick={() => setF(t)}>{t}</button>
        ))}
      </div>
      {ABOUT.filter((a) => f === "All" || a[1] === f).map(([id, chip, eyebrow]) => {
        const c = find(id);
        return (
          <div className="about-block" key={id}>
            <div className="sec-h">{chip}</div>
            <h2 className="h2" style={{ fontSize: 20 }}>{c.title}</h2>
            <p className="quote" style={{ color: real(c.description) ? undefined : "var(--muted)" }}>{real(c.description) || "[Your paragraph goes here]"}</p>
          </div>
        );
      })}
    </>
  );
}

const REASONS = ["Freelance work", "Job opportunity", "Feedback"];

function Contact() {
  const { roll } = useDice();
  const [form, setForm] = useState({ name: "", email: "", reason: REASONS[0], message: "" });
  const [status, setStatus] = useState("idle");
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (!isFirebaseConfigured) {
      const body = `${form.message}\n\nFrom: ${form.name} (${form.email})`;
      window.location.href = `mailto:${ADMIN_EMAIL}?subject=${encodeURIComponent(form.reason)}&body=${encodeURIComponent(body)}`;
      return;
    }
    setStatus("sending");
    try {
      await addDoc(collection(db, "messages"), { ...form, createdAt: serverTimestamp() });
      setStatus("sent");
      roll("Raven sent", 0, 20);
      setForm({ name: "", email: "", reason: REASONS[0], message: "" });
    } catch (err) { console.error(err); setStatus("error"); }
  };

  return (
    <>
      <h2 className="h2" style={{ fontSize: 30 }}>Send a raven</h2>
      <p className="cg" style={{ margin: "8px 0 0", fontSize: 16, color: "var(--text-2)", maxWidth: 620 }}>{find("content-006").description}</p>
      <form className="form" onSubmit={submit}>
        <div className="field"><label htmlFor="n">Name</label><input id="n" required maxLength={100} placeholder="Your name" value={form.name} onChange={set("name")} /></div>
        <div className="field"><label htmlFor="e">Email</label><input id="e" type="email" required maxLength={200} placeholder="you@example.com" value={form.email} onChange={set("email")} /></div>
        <div className="field"><label htmlFor="r">Reason for the quest</label><select id="r" value={form.reason} onChange={set("reason")}>{REASONS.map((r) => <option key={r}>{r}</option>)}</select></div>
        <div className="field"><label htmlFor="m">Message</label><textarea id="m" required maxLength={2000} placeholder="Write your message" value={form.message} onChange={set("message")} /></div>
        <button className="solid" style={{ alignSelf: "flex-start" }} disabled={status === "sending"}><D20 size={16} stroke="currentColor" />{status === "sending" ? "Sending…" : "Roll to send"}</button>
        {status === "sent" && <p className="status-ok" role="status">Thank you! Your message was sent.</p>}
        {status === "error" && <p className="status-err" role="alert">Sorry, that didn't send. Please email {ADMIN_EMAIL} directly.</p>}
      </form>
    </>
  );
}

export default function MainTabs() {
  const [tab, setTab] = useState("overview");
  useEffect(() => {
    const on = (e) => setTab(e.detail);
    window.addEventListener(TAB_EVENT, on);
    return () => window.removeEventListener(TAB_EVENT, on);
  }, []);

  return (
    <section className="panel right-in" aria-label="Portfolio">
      <div className="tabs" role="tablist" aria-label="Portfolio sections">
        {TABS.map(([id, label]) => (
          <button key={id} type="button" role="tab" className="tab" aria-selected={tab === id} onClick={() => setTab(id)}>{label}</button>
        ))}
        <a className="thin linkedin" href={LINKS.linkedin || "https://www.linkedin.com/search/results/people/?keywords=Gaby%20Norris%20Open%20Window"} target="_blank" rel="noopener noreferrer"><FaLinkedin size={14} />LinkedIn</a>
      </div>
      <div className="tab-body" role="tabpanel">
        {tab === "overview" && <Overview go={setTab} />}
        {tab === "projects" && <Projects />}
        {tab === "about" && <About />}
        {tab === "contact" && <Contact />}
      </div>
    </section>
  );
}
