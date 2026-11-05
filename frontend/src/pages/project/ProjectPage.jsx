import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import { useProjects, isRealUrl } from "../../lib/useProjects";

const real = (t) => (t && t !== "..." ? t : null);

export default function ProjectPage() {
  const { id } = useParams();
  const { projects } = useProjects();
  useEffect(() => { window.scrollTo(0, 0); }, [id]);

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
      <div className="eyebrow" style={{ marginTop: 22 }}>{p.type} · {p.solution} · {p.year}</div>
      <h1 className="h1">{p.title}</h1>
      {real(p.tagline) && <div className="sub">{p.tagline}</div>}
      <div className="media" style={{ margin: "20px 0" }}>{p.title} · media coming soon</div>
      <div style={{ display: "grid", gap: 16 }}>
        <Block title="The scenario"><p className="lede" style={{ margin: 0 }}>{real(p.scenario) || "Details coming soon."}</p></Block>
        <Block title="The quest"><p className="lede" style={{ margin: 0 }}>{real(p.fullDescription) || real(p.shortDescription) || "Details coming soon."}</p></Block>
        {tools.length > 0 && <Block title="Tools"><div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>{tools.map((t) => <span className="pill" key={t}>{t}</span>)}</div></Block>}
        {real(p.reflection) && <Block title="Reflection"><p className="lede" style={{ margin: 0 }}>{p.reflection}</p></Block>}
        {links.length > 0 && (
          <Block title="Links"><div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {links.map((a) => <a key={a.url} className="thin" href={a.url} target="_blank" rel="noopener noreferrer"><ExternalLink size={13} />{a.label}</a>)}
          </div></Block>
        )}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginTop: 28, flexWrap: "wrap" }}>
        {prev ? <Link className="thin" to={`/project/${prev.id}`}><ArrowLeft size={14} />{prev.title}</Link> : <span />}
        {next ? <Link className="thin" to={`/project/${next.id}`}>{next.title}<ArrowRight size={14} /></Link> : <span />}
      </div>
    </div>
  );
}
