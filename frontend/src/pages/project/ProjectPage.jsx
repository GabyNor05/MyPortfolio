import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, ExternalLink, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useProjects, isRealUrl } from "../../lib/useProjects";
import { img } from "../../lib/assets";

const real = (t) => (t && t !== "..." ? t : null);

export default function ProjectPage() {
  const { id } = useParams();
  const { projects } = useProjects();
  const [shot, setShot] = useState(0);
  const [box, setBox] = useState(null);
  useEffect(() => {
    if (box === null) return;
    const on = (e) => { if (e.key === "Escape") setBox(null); if (e.key === "ArrowRight") setBox((b) => b + 1); if (e.key === "ArrowLeft") setBox((b) => b - 1); };
    window.addEventListener("keydown", on); return () => window.removeEventListener("keydown", on);
  }, [box]);
  useEffect(() => { window.scrollTo(0, 0); setShot(0); }, [id]);

  const sorted = [...projects].sort((a, b) => b.year - a.year || a.title.localeCompare(b.title));
  const i = sorted.findIndex((p) => p.id === id);
  const p = sorted[i];

  if (!p) {
    return (
      <div className="pp">
        <Link to="/" className="thin" style={{ display: "inline-flex" }}><ArrowLeft size={14} />Back to the sheet</Link>
        <h1 className="h1" style={{ marginTop: 24 }}>Quest not found</h1>
      </div>
    );
  }
  const prev = sorted[i - 1], next = sorted[i + 1];
  const shots = [p.thumbnail, ...(p.gallery || [])].filter(Boolean);
  const bi = box === null || !shots.length ? null : ((box % shots.length) + shots.length) % shots.length;
  const links = (p.actions || []).filter((a) => isRealUrl(a.url));
  const tools = Array.isArray(p.tools) ? p.tools : Array.isArray(p.techStack) ? p.techStack : [];
  const Block = ({ title, children }) => (
    <section className="panel" style={{ padding: 20 }}>
      <div className="eyebrow" style={{ fontSize: 12, letterSpacing: ".16em", color: "var(--muted)", marginBottom: 6 }}>{title}</div>
      {children}
    </section>
  );

  return (
    <div className="pp">
      <Link to="/" className="thin" style={{ display: "inline-flex" }}><ArrowLeft size={14} />Back to the sheet</Link>
      <div className="eyebrow" style={{ marginTop: 22 }}>{p.type} · {p.solution} · {p.year}{p.status ? ` · ${p.status}` : ""}</div>
      <h1 className="h1">{p.title}</h1>
      {real(p.tagline) && <div className="sub">{p.tagline}</div>}
      <div className="pp-top">
        <div className="pp-media">
          {shots.length === 0 ? <div className="media">{p.title} · images coming soon</div> : (
            <>
              <button type="button" className="pp-main" onClick={() => setBox(shot)} aria-label="Open image full size"><img src={img(shots[Math.min(shot, shots.length - 1)])} alt={`${p.title} screenshot ${shot + 1}`} /><span className="pp-zoom">Click to enlarge</span></button>
              {shots.length > 1 && (
                <div className="shots">{shots.map((s, k) => (
                  <button key={s} type="button" className="shot" aria-pressed={shot === k} aria-label={`Show image ${k + 1}`} onClick={() => setShot(k)}><img src={img(s)} alt="" /></button>
                ))}</div>
              )}
            </>
          )}
        </div>
        <aside className="pp-rail">
          <Block title="The quest"><p className="lede" style={{ margin: 0 }}>{real(p.shortDescription) || real(p.fullDescription) || "Details coming soon."}</p></Block>
          {links.length > 0 && (
            <Block title="Links"><div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {links.map((a) => <a key={a.url} className="thin" href={a.url} target="_blank" rel="noopener noreferrer"><ExternalLink size={13} />{a.label}</a>)}
            </div></Block>
          )}
          {tools.length > 0 && <Block title="Tools"><div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>{tools.map((t) => <span className="pill" key={t}>{t}</span>)}</div></Block>}
          {(real(p.role) || (p.team || []).length > 0) && (
            <Block title="Party">
              {real(p.role) && <p className="lede" style={{ margin: 0 }}><b>My role:</b> {p.role}</p>}
              {(p.team || []).length > 0 && <ul className="quote" style={{ margin: "8px 0 0", paddingLeft: 18 }}>{p.team.map((t) => <li key={t}>{t}</li>)}</ul>}
            </Block>
          )}
        </aside>
      </div>
      {bi !== null && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label="Image viewer" onClick={(e) => e.target === e.currentTarget && setBox(null)}>
          <button type="button" className="lb-x" aria-label="Close" onClick={() => setBox(null)}><X size={20} /></button>
          {shots.length > 1 && <button type="button" className="lb-n lb-prev" aria-label="Previous image" onClick={() => setBox(bi - 1)}><ChevronLeft size={26} /></button>}
          <img src={img(shots[bi])} alt={`${p.title} image ${bi + 1} of ${shots.length}`} />
          {shots.length > 1 && <button type="button" className="lb-n lb-next" aria-label="Next image" onClick={() => setBox(bi + 1)}><ChevronRight size={26} /></button>}
          <div className="lb-count">{bi + 1} / {shots.length}</div>
        </div>
      )}
      <div style={{ display: "grid", gap: 16 }}>
        {real(p.scenario) && p.scenario !== "Module brief" && <Block title="The scenario"><p className="lede" style={{ margin: 0 }}>{p.scenario}</p></Block>}
        {real(p.fullDescription) && real(p.fullDescription) !== real(p.shortDescription) && <Block title="The full story"><p className="lede" style={{ margin: 0 }}>{p.fullDescription}</p></Block>}
        {(p.highlights || []).length > 0 && (
          <Block title="Highlights"><ul className="quote" style={{ margin: 0, paddingLeft: 18 }}>{p.highlights.map((h) => <li key={h} style={{ marginBottom: 4 }}>{h}</li>)}</ul></Block>
        )}
        {real(p.reflection) && <Block title="Reflection"><p className="lede" style={{ margin: 0 }}>{p.reflection}</p></Block>}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginTop: 28, flexWrap: "wrap" }}>
        {prev ? <Link className="thin" to={`/project/${prev.id}`}><ArrowLeft size={14} />{prev.title}</Link> : <span />}
        {next ? <Link className="thin" to={`/project/${next.id}`}>{next.title}<ArrowRight size={14} /></Link> : <span />}
      </div>
    </div>
  );
}
