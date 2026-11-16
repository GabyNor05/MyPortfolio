import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FaFigma, FaGithub, FaBehance } from "react-icons/fa";
import { ArrowLeft, ArrowRight, Globe, X, ChevronLeft, ChevronRight, Play } from "lucide-react";
import { useProjects, isRealUrl } from "../../lib/useProjects";
import { img } from "../../lib/assets";
import { doc, setDoc, increment } from "firebase/firestore";
import { db, isFirebaseConfigured } from "../../lib/firebase";
import { useIsAdmin } from "../../lib/useAdmin";

const linkIcon = (a) => (/figma/i.test(a.url) || a.icon === "figma" ? <FaFigma size={14} /> : /github\.com/i.test(a.url) ? <FaGithub size={14} /> : /behance/i.test(a.url) ? <FaBehance size={15} /> : <Globe size={14} />);
const real = (t) => (t && t !== "..." ? t : null);

export default function ProjectPage() {
  const { id } = useParams();
  const { projects } = useProjects();
  const [shot, setShot] = useState(0);
  const [box, setBox] = useState(null); // { list, i }
  const mediaRef = useRef(null);
  const shotsRef = useRef(null);
  const [fade, setFade] = useState(false);
  const [railH, setRailH] = useState(null);
  useEffect(() => {
    if (box === null) return;
    const n = box.list.length;
    const on = (e) => {
      if (e.key === "Escape") setBox(null);
      if (e.key === "ArrowRight") setBox((b) => ({ ...b, i: (b.i + 1) % n }));
      if (e.key === "ArrowLeft") setBox((b) => ({ ...b, i: (b.i - 1 + n) % n }));
    };
    window.addEventListener("keydown", on); return () => window.removeEventListener("keydown", on);
  }, [box]);
  const isAdmin = useIsAdmin();
  useEffect(() => { window.scrollTo(0, 0); setShot(0); }, [id]);
  useEffect(() => {
    if (!isFirebaseConfigured || isAdmin) return;
    try {
      const k = "viewed:" + id;
      if (sessionStorage.getItem(k)) return;
      sessionStorage.setItem(k, "1");
      setDoc(doc(db, "views", id), { count: increment(1) }, { merge: true }).catch(() => {});
    } catch { /* ignore */ }
  }, [id, isAdmin]);

  const sorted = [...projects].sort((a, b) => b.year - a.year || a.title.localeCompare(b.title));
  const i = sorted.findIndex((p) => p.id === id);
  const p = sorted[i];

  // keep the right-hand column no taller than the media on the left
  useLayoutEffect(() => {
    const el = mediaRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => setRailH(window.innerWidth > 900 ? el.getBoundingClientRect().height : null));
    ro.observe(el); return () => ro.disconnect();
  });

  useLayoutEffect(() => {
    const el = shotsRef.current; if (!el) return;
    const upd = () => setFade(el.scrollWidth > el.clientWidth + 4 && el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
    upd(); el.addEventListener("scroll", upd); window.addEventListener("resize", upd);
    return () => { el.removeEventListener("scroll", upd); window.removeEventListener("resize", upd); };
  });

  if (!p) {
    return (
      <div className="pp">
        <Link to="/" className="thin" style={{ display: "inline-flex" }}><ArrowLeft size={14} />Back to the sheet</Link>
        <h1 className="h1" style={{ marginTop: 24 }}>Quest not found</h1>
      </div>
    );
  }
  const prev = sorted[i - 1], next = sorted[i + 1];
  const images = [p.thumbnail, ...(p.gallery || [])].filter(Boolean);
  const hasVideo = !!real(p.video);
  // slot 0 is the video (if any); the rest are images
  const slots = [...(hasVideo ? ["__video__"] : []), ...images];
  const cur = slots[Math.min(shot, slots.length - 1)];
  const step = (d) => setShot((s) => (s + d + slots.length) % slots.length);
  const links = (p.actions || []).filter((a) => isRealUrl(a.url));
  const tools = Array.isArray(p.tools) ? p.tools : Array.isArray(p.techStack) ? p.techStack : [];
  const wires = (p.wireframes || []).filter((w) => /\.(png|jpe?g|webp|gif|svg|avif)(\?|$)|^https?:|^data:/i.test(w));
  const showTeam = p.hasTeam !== false && (p.team || []).length > 0;
  const adventure = real(p.adventure) || real(p.fullDescription) || real(p.shortDescription) || "Details coming soon.";
  const quest = real(p.quest) || (real(p.scenario) && p.scenario !== "Module brief" ? p.scenario : null);
  const openBox = (list, k) => setBox({ list, i: k });
  const Block = ({ title, children, style }) => (
    <section className="panel" style={{ padding: 20, ...style }}>
      <div className="eyebrow" style={{ fontSize: 12, letterSpacing: ".16em", color: "var(--muted)", marginBottom: 6 }}>{title}</div>
      {children}
    </section>
  );

  return (
    <div className="pp">
      <Link to="/" className="thin" style={{ display: "inline-flex" }}><ArrowLeft size={14} />Back to the sheet</Link>
      <div className="eyebrow" style={{ marginTop: 22 }}>{p.type} · {p.solution} · {p.year}{p.status ? ` · ${p.status}` : ""}</div>
      <div className="pp-head">
        <h1 className="h1" style={{ margin: 0 }}>{p.title}</h1>
        {links.length > 0 && (
          <div className="pp-links">
            {links.map((a, k) => <a key={a.url} className={k === 0 ? "solid" : "thin"} style={{ minHeight: 38 }} href={a.url} target="_blank" rel="noopener noreferrer">{linkIcon(a)}{a.label}</a>)}
          </div>
        )}
      </div>
      {real(p.tagline) && <div className="sub">{p.tagline}</div>}
      {real(p.role) && <div className="pp-role"><b>My role:</b> {p.role}</div>}
      <div className="pp-top">
        <div className="pp-media" ref={mediaRef}>
          {slots.length === 0 ? <div className="media">{p.title} · images coming soon</div> : (
            <>
              <div className="pp-stage">
                {cur === "__video__" ? (
                  <video className="pp-video" src={img(p.video)} poster={images[0] ? img(images[0]) : undefined} autoPlay muted loop playsInline controls />
                ) : (
                  <button type="button" className="pp-main" onClick={() => openBox(images, images.indexOf(cur))} aria-label="Open image full size"><img src={img(cur)} alt={`${p.title} screenshot ${shot + 1}`} /><span className="pp-zoom">Click to enlarge</span></button>
                )}
                {slots.length > 1 && (
                  <>
                    <button type="button" className="pp-arrow pp-prev" aria-label="Previous" onClick={() => step(-1)}><ChevronLeft size={22} /></button>
                    <button type="button" className="pp-arrow pp-next" aria-label="Next" onClick={() => step(1)}><ChevronRight size={22} /></button>
                  </>
                )}
              </div>
              {slots.length > 1 && (
                <div className={`shots ${fade ? "fade" : ""}`} ref={shotsRef}>{slots.map((s, k) => (
                  <button key={s + k} type="button" className="shot" aria-pressed={shot === k} aria-label={s === "__video__" ? "Show the video" : `Show image ${k + 1}`} onClick={() => setShot(k)}>
                    {s === "__video__" ? <span className="shot-vid"><Play size={18} />Video</span> : <img src={img(s)} alt="" />}
                  </button>
                ))}</div>
              )}
            </>
          )}
        </div>
        <aside className="pp-rail" style={railH ? { maxHeight: railH } : undefined}>
          <Block title="The adventure"><p className="lede" style={{ margin: 0 }}>{adventure}</p></Block>
          {tools.length > 0 && (
            <div className="rail-tools">
              <div className="eyebrow" style={{ fontSize: 12, letterSpacing: ".16em", color: "var(--muted)", marginBottom: 8 }}>Tools</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>{tools.map((t) => <span className="pill" key={t}>{t}</span>)}</div>
            </div>
          )}
          {quest && <Block title="The quest (the brief)"><p className="lede" style={{ margin: 0 }}>{quest}</p></Block>}
          {showTeam && (
            <Block title="Party">
              <ul className="pp-list">{p.team.map((t) => <li key={t}>{t}</li>)}</ul>
            </Block>
          )}
        </aside>
      </div>
      {wires.length > 0 && (
        <Block title="Wireframes" style={{ marginBottom: 16 }}>
          <div className="wires">{wires.map((w, k) => <button key={w + k} type="button" className="wire" aria-label={`Open wireframe ${k + 1}`} onClick={() => openBox(wires, k)}><img src={img(w)} alt={`${p.title} wireframe ${k + 1}`} loading="lazy" /></button>)}</div>
          {real(p.wireframeNote) && <p className="lede" style={{ margin: "12px 0 0" }}>{p.wireframeNote}</p>}
        </Block>
      )}
      {box !== null && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label="Image viewer" onClick={(e) => e.target === e.currentTarget && setBox(null)}>
          <button type="button" className="lb-x" aria-label="Close" onClick={() => setBox(null)}><X size={20} /></button>
          {box.list.length > 1 && <button type="button" className="lb-n lb-prev" aria-label="Previous image" onClick={() => setBox({ ...box, i: (box.i - 1 + box.list.length) % box.list.length })}><ChevronLeft size={26} /></button>}
          <img src={img(box.list[box.i])} alt={`${p.title} image ${box.i + 1} of ${box.list.length}`} />
          {box.list.length > 1 && <button type="button" className="lb-n lb-next" aria-label="Next image" onClick={() => setBox({ ...box, i: (box.i + 1) % box.list.length })}><ChevronRight size={26} /></button>}
          <div className="lb-count">{box.i + 1} / {box.list.length}</div>
        </div>
      )}
      <div style={{ display: "grid", gap: 16 }}>
        {(p.highlights || []).length > 0 && (
          <Block title="Highlights"><ul className="pp-list">{p.highlights.map((h) => <li key={h}>{h}</li>)}</ul></Block>
        )}
        {real(p.fullDescription) && real(p.fullDescription) !== adventure && <Block title="The full story"><p className="lede" style={{ margin: 0 }}>{p.fullDescription}</p></Block>}
        {real(p.reflection) && <Block title="Reflection"><p className="lede" style={{ margin: 0 }}>{p.reflection}</p></Block>}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginTop: 28, flexWrap: "wrap" }}>
        {prev ? <Link className="thin" to={`/project/${prev.id}`}><ArrowLeft size={14} />{prev.title}</Link> : <span />}
        {next ? <Link className="thin" to={`/project/${next.id}`}>{next.title}<ArrowRight size={14} /></Link> : <span />}
      </div>
    </div>
  );
}
