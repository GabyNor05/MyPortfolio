import React, { useMemo, useState } from "react";
import { FaGithub, FaFigma, FaBehance, FaExternalLinkAlt } from "react-icons/fa";
import { X } from "lucide-react";
import { useProjects, isRealUrl } from "../../../lib/useProjects";
import Button from "../../../components/button/Button";

const icons = { github: <FaGithub />, figma: <FaFigma />, behance: <FaBehance />, link: <FaExternalLinkAlt /> };

const blurb = (p) => {
  const d = p.shortDescription && p.shortDescription !== "..." ? p.shortDescription : p.fullDescription;
  return d && d !== "..." ? d : "Details coming soon.";
};

const Projects = () => {
  const { projects } = useProjects();
  const [type, setType] = useState("All");
  const [year, setYear] = useState("All");
  const [sort, setSort] = useState("newest");
  const [open, setOpen] = useState(null);

  const types = useMemo(() => ["All", ...new Set(projects.map((p) => p.type))], [projects]);
  const years = useMemo(() => ["All", ...[...new Set(projects.map((p) => p.year))].sort((a, b) => b - a)], [projects]);

  const shown = useMemo(() => {
    const list = projects.filter((p) => (type === "All" || p.type === type) && (year === "All" || p.year === year));
    return [...list].sort((a, b) =>
      sort === "az" ? a.title.localeCompare(b.title) : sort === "oldest" ? a.year - b.year : b.year - a.year
    );
  }, [projects, type, year, sort]);

  const chip = (active) =>
    `px-3 py-1 rounded-pill text-[12px] border-[0.5px] border-[var(--border-mid)] transition-all duration-200 ${
      active ? "bg-primary text-primary-content" : "bg-base-300 text-neutral hover:text-base-content"
    }`;

  return (
    <section id="projects" className="w-full max-w-6xl px-4 py-16 scroll-mt-16">
      <h2 className="font-display text-4xl sm:text-5xl">Projects</h2>
      <p className="text-neutral mt-2">Design and development work from my studies and personal builds.</p>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        {types.map((t) => (
          <button key={t} className={chip(type === t)} onClick={() => setType(t)}>{t}</button>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2 text-[12px]">
        <select className="select select-sm select-bordered bg-base-200" value={year} onChange={(e) => setYear(e.target.value === "All" ? "All" : Number(e.target.value))} aria-label="Filter by year">
          {years.map((y) => <option key={y} value={y}>{y === "All" ? "All years" : y}</option>)}
        </select>
        <select className="select select-sm select-bordered bg-base-200" value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort projects">
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="az">A to Z</option>
        </select>
        <span className="text-[var(--text-3)]">{shown.length} project{shown.length === 1 ? "" : "s"}</span>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((p) => (
          <button key={p.id} onClick={() => setOpen(p)}
            className="text-left h-full flex flex-col justify-start rounded-lg overflow-hidden bg-base-200 border-[0.5px] border-[var(--border)] hover:border-primary hover:-translate-y-1 hover:shadow-[0_8px_30px_var(--glow)] transition-all duration-300">
            <div className="h-32 bg-gradient-to-br from-primary/40 via-accent/30 to-secondary/40 flex items-end p-3">
              <span className="font-display text-3xl">{p.title}</span>
            </div>
            <div className="p-4">
              <div className="flex gap-2 text-[11px] text-[var(--text-3)]">
                <span>{p.type}</span><span>·</span><span>{p.solution}</span><span>·</span><span>{p.year}</span>
              </div>
              <p className="mt-2 text-sm text-neutral">{blurb(p)}</p>
            </div>
          </button>
        ))}
        {shown.length === 0 && <p className="text-neutral">No projects match those filters.</p>}
      </div>

      {open && (
        <div className="modal modal-open" onClick={() => setOpen(null)} role="dialog" aria-modal="true">
          <div className="modal-box max-w-2xl bg-base-200 border-[0.5px] border-[var(--border-mid)]" onClick={(e) => e.stopPropagation()}>
            <button className="btn btn-sm btn-circle btn-ghost absolute right-3 top-3" onClick={() => setOpen(null)} aria-label="Close"><X size={16} /></button>
            <div className="text-[11px] text-[var(--text-3)]">{open.type} · {open.solution} · {open.year}</div>
            <h3 className="font-display text-4xl mt-1">{open.title}</h3>
            {open.tagline && <p className="text-primary mt-1">{open.tagline}</p>}
            {open.scenario && <p className="mt-4 text-sm"><span className="text-[var(--text-3)]">Scenario: </span>{open.scenario}</p>}
            <p className="mt-3 text-neutral">{blurb(open)}</p>
            {open.Technologies?.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {open.Technologies.map((t) => <span key={t.name} className="badge badge-outline">{t.name}</span>)}
              </div>
            )}
            {open.collaborators?.length > 0 && (
              <p className="mt-4 text-sm text-neutral">With: {open.collaborators.map((c) => c.name).join(", ")}</p>
            )}
            <div className="mt-5 flex flex-wrap gap-3">
              {(open.actions || []).filter((a) => isRealUrl(a.url)).map((a) => (
                <Button key={a.label} colour="primary" icon={icons[a.icon] || icons.link} label={a.label} link={a.url} />
              ))}
              {(open.Deployement || []).filter((d) => isRealUrl(d.url)).map((d) => (
                <Button key={d.end} colour="secondary" icon={icons.link} label={`${d.end} on ${d.platform}`} link={d.url} />
              ))}
            </div>
            {open.reflection && open.reflection !== "..." && (
              <div className="mt-6 border-t-[0.5px] border-[var(--border)] pt-4">
                <h4 className="font-display text-2xl">Reflection</h4>
                <p className="mt-1 text-sm text-neutral">{open.reflection}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default Projects;
