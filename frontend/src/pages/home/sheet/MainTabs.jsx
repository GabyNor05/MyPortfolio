import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { addDoc, collection, serverTimestamp, doc, updateDoc, getDoc, increment } from "firebase/firestore";
import { notifyOwner, REMINDER_EVERY } from "../../../lib/emailConfig";
import { useProjects } from "../../../lib/useProjects";
import { db, isFirebaseConfigured } from "../../../lib/firebase";
import { ADMIN_EMAIL } from "../../../lib/firebaseConfig";
import { img } from "../../../lib/assets";
import { useDice } from "../../../lib/dice";
import { pageContent, sheet } from "../../../data/portfolioData";
import { TAB_EVENT } from "../tabBus";
import D20 from "../../../components/sheet/D20";
import Skills from "./Skills";

const TABS = [["projects", "Projects"], ["about", "About"], ["contact", "Contact"]];
const find = (id) => pageContent.find((c) => c.id === id);
const real = (t) => (t && t !== "..." ? t : null);

export const blurb = (p) => real(p.shortDescription) || real(p.fullDescription) || "Details coming soon.";

function HoverCard({ p, rect }) {
  const W = 340;
  const left = Math.max(12, Math.min(rect.left + rect.width * 0.3, window.innerWidth - W - 12));
  const below = rect.bottom + 340 < window.innerHeight;
  const style = below ? { left, top: rect.bottom + 6 } : { left, bottom: window.innerHeight - rect.top + 6 };
  return (
    <div className="hover-card" style={{ ...style, width: W }} role="tooltip">
      <div className="car-thumb" style={{ aspectRatio: "16/9" }}>{p.thumbnail ? <img src={img(p.thumbnail)} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : p.title.charAt(0)}</div>
      <div style={{ padding: "10px 14px 14px" }}>
        <div className="proj-title" style={{ fontSize: 18 }}>{p.title}</div>
        <div className="rc" style={{ fontSize: 12, color: "var(--muted)", margin: "2px 0 8px" }}>{p.type} · {p.solution} · {p.year}</div>
        <div style={{ fontSize: 14, lineHeight: 1.55, color: "var(--text-2)" }}>{real(p.fullDescription) || blurb(p)}</div>
      </div>
    </div>
  );
}

function Projects() {
  const { projects } = useProjects();
  const [type, setType] = useState("All");
  const [year, setYear] = useState("All");
  const [hover, setHover] = useState(null);
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
        <Link
          to={`/project/${p.id}`}
          className="proj-row"
          key={p.id}
          aria-label={`View quest: ${p.title}`}
          onMouseEnter={(e) => setHover({ p, rect: e.currentTarget.getBoundingClientRect() })}
          onMouseLeave={() => setHover(null)}
          onFocus={(e) => setHover({ p, rect: e.currentTarget.getBoundingClientRect() })}
          onBlur={() => setHover(null)}
        >
          <div className="proj-ico">{p.thumbnail ? <img src={img(p.thumbnail)} alt="" loading="lazy" /> : p.title.charAt(0)}</div>
          <div style={{ flex: "2 1 180px", minWidth: 0 }}>
            <div className="proj-title">{p.title}</div>
            <div className="proj-blurb">{blurb(p)}</div>
          </div>
          <div className="proj-cell" style={{ flex: "1 1 120px" }}>{p.type}</div>
          <div className="proj-cell" style={{ flex: "0 0 44px" }}>{p.year}</div>
          <div className="proj-cell" style={{ flex: "1 1 110px" }}>{p.solution}</div>
          <span className="thin view-quest">View quest <ChevronRight size={12} /></span>
        </Link>
      ))}
      {hover && <HoverCard {...hover} />}
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

function CvRequest() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", company: "", email: "", reason: "" });
  const [status, setStatus] = useState("idle");
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const submit = async (e) => {
    e.preventDefault();
    if (!isFirebaseConfigured) {
      window.location.href = `mailto:${ADMIN_EMAIL}?subject=${encodeURIComponent("CV request")}&body=${encodeURIComponent(`${form.reason}\n\nFrom: ${form.name}, ${form.company} (${form.email})`)}`;
      return;
    }
    setStatus("sending");
    try {
      await addDoc(collection(db, "cvRequests"), { ...form, createdAt: serverTimestamp() });
      notifyOwner(`CV request from ${form.name}`, `${form.name} (${form.company}, ${form.email}) asked for your CV`, form.reason);
      setStatus("sent");
      setForm({ name: "", company: "", email: "", reason: "" });
    } catch (err) { console.error(err); setStatus("error"); }
  };
  return (
    <>
      <button type="button" className="solid" style={{ marginTop: 14 }} onClick={() => { setOpen(true); setStatus("idle"); }}>Request my CV</button>
      {open && (
        <div className="cv-back" role="dialog" aria-modal="true" aria-label="Request CV" onClick={(e) => e.target === e.currentTarget && setOpen(false)}>
          <form className="cv-modal form" onSubmit={submit}>
            <h2 className="h2" style={{ fontSize: 22, margin: 0 }}>Request my CV</h2>
            <p className="quote" style={{ margin: 0 }}>Tell me a little about who you are and I'll email it to you.</p>
            {status === "sent" ? <p className="status-ok" role="status">Thank you! I'll send it to your email shortly.</p> : (
              <>
                <div className="field"><label htmlFor="cn">Your name</label><input id="cn" required maxLength={100} value={form.name} onChange={set("name")} /></div>
                <div className="field"><label htmlFor="cc">Company / organisation</label><input id="cc" required maxLength={100} value={form.company} onChange={set("company")} /></div>
                <div className="field"><label htmlFor="ce">Email</label><input id="ce" type="email" required maxLength={200} value={form.email} onChange={set("email")} /></div>
                <div className="field"><label htmlFor="cr">Reason for requesting</label><textarea id="cr" required maxLength={1000} value={form.reason} onChange={set("reason")} /></div>
                {status === "error" && <p className="status-err" role="alert">Sorry, that didn't send. Please email {ADMIN_EMAIL}.</p>}
              </>
            )}
            <div style={{ display: "flex", gap: 8 }}>
              {status !== "sent" && <button className="solid" disabled={status === "sending"}>{status === "sending" ? "Sending…" : "Send request"}</button>}
              <button type="button" className="thin" onClick={() => setOpen(false)}>{status === "sent" ? "Close" : "Cancel"}</button>
            </div>
          </form>
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
        {["All", ...ABOUT.map((a) => a[1]), "Technology", "Experience", "Skills"].map((t) => (
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
      {(f === "All" || f === "Technology") && (
        <div className="about-block">
          <div className="sec-h">Technology</div>
          <h2 className="h2" style={{ fontSize: 20 }}>Why I love tech</h2>
          <p className="quote">I really think technology is cool. It has its risks and its dangers, but what it has done for the world is amazing, and above all impactful. Then there's the feeling of unboxing something new. It doesn't have to be the latest thing, just new to me, like a power bank or anything that's going to make my life easier. Unboxing is one of my favourite things. I also love watching how fast it moves. The moment I decide I want a phone, it's already outdated, and by the time it reaches the store there's a newer model. That's just how technology works, and it fascinates me how much the industry has grown and how much is possible with it.</p>
        </div>
      )}
      {(f === "All" || f === "Experience") && (
        <div className="about-block">
          <div className="sec-h">Experience</div>
          {sheet.experience.map((x) => (
            <div className="exp" key={x.role}>
              <div className="exp-top"><b>{x.role}</b><span>{x.when}</span></div>
              <div className="exp-org">{x.org}</div>
              <p className="quote" style={{ margin: "4px 0 0" }}>{x.text}</p>
            </div>
          ))}
          <CvRequest />
        </div>
      )}
      {(f === "All" || f === "Skills") && (
        <div className="about-block">
          <div className="sec-h">Skills</div>
          <Skills embedded />
        </div>
      )}
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
      notifyOwner(`New message from ${form.name}`, `${form.name} (${form.email}) wrote about: ${form.reason}`, form.message);
      try {
        const ref = doc(db, "meta", "unresolved");
        await updateDoc(ref, { count: increment(1) });
        const n = (await getDoc(ref)).data().count;
        if (n >= REMINDER_EVERY && n % REMINDER_EVERY === 0) notifyOwner(`Reminder: ${n} unresolved messages`, `You have ${n} messages waiting`, "Open your admin dashboard → Messages and mark the ones you've dealt with as resolved.");
      } catch (e) { console.warn("Unresolved counter skipped:", e.message); }
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
  const panelRef = useRef(null);
  const [tab, setTab] = useState("projects");
  useEffect(() => {
    const on = (e) => { setTab(e.detail); setTimeout(() => panelRef.current && panelRef.current.scrollIntoView({ behavior: "smooth", block: "start" }), 30); };
    window.addEventListener(TAB_EVENT, on);
    return () => window.removeEventListener(TAB_EVENT, on);
  }, []);

  return (
    <section className="panel tabs-panel" aria-label="Portfolio" ref={panelRef}>
      <div className="tabs" role="tablist" aria-label="Portfolio sections">
        {TABS.map(([id, label]) => (
          <button key={id} type="button" role="tab" className="tab" aria-selected={tab === id} onClick={() => setTab(id)}>{label}</button>
        ))}
      </div>
      <div className="tab-body" role="tabpanel">
        {tab === "projects" && <Projects />}
        {tab === "about" && <About />}
        {tab === "contact" && <Contact />}
      </div>
    </section>
  );
}
