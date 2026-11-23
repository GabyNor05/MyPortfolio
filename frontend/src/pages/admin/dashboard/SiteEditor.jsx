import React, { useRef, useState } from "react";
import { doc, setDoc, deleteDoc } from "firebase/firestore";
import { Plus, Trash2, ArrowUp, ArrowDown, UploadCloud } from "lucide-react";
import { db, isFirebaseConfigured } from "../../../lib/firebase";
import { useSettings, DEFAULTS } from "../../../lib/useSettings";
import { UploadField } from "../../../components/admin/UploadField";

const Field = ({ label, children, wide }) => <div className="field" style={wide ? { gridColumn: "1 / -1" } : undefined}><label>{label}</label>{children}</div>;
const uid = () => Math.random().toString(36).slice(2, 8);

function resizeToDataUrl(file, max = 320) {
  return new Promise((res, rej) => {
    const img = new Image();
    img.onload = () => {
      const k = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement("canvas");
      c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
      c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
      res(c.toDataURL("image/png"));
    };
    img.onerror = rej;
    img.src = URL.createObjectURL(file);
  });
}

function RowTools({ i, n, move, remove }) {
  return (
    <span style={{ display: "inline-flex", gap: 4 }}>
      <button type="button" className="thin icon-btn" aria-label="Move up" disabled={i === 0} onClick={() => move(i, -1)}><ArrowUp size={13} /></button>
      <button type="button" className="thin icon-btn" aria-label="Move down" disabled={i === n - 1} onClick={() => move(i, 1)}><ArrowDown size={13} /></button>
      <button type="button" className="thin icon-btn" aria-label="Remove" onClick={() => remove(i)}><Trash2 size={13} /></button>
    </span>
  );
}

function useList(list, setList) {
  return {
    upd: (i, k, v) => setList(list.map((x, j) => (j === i ? { ...x, [k]: v } : x))),
    move: (i, d) => { const a = [...list]; [a[i], a[i + d]] = [a[i + d], a[i]]; setList(a); },
    remove: (i) => setList(list.filter((_, j) => j !== i)),
    add: (item) => setList([...list, item]),
  };
}

function SkillList({ title, list, setList }) {
  const L = useList(list, setList);
  return (
    <div className="panel adm-card">
      <div className="sec-h">{title}</div>
      {list.map((s, i) => (
        <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 90px auto auto", gap: 10, alignItems: "center", marginBottom: 8 }}>
          <input aria-label="Skill name" value={s.name} onChange={(e) => L.upd(i, "name", e.target.value)} />
          <input aria-label="Bonus" type="number" value={s.bonus} onChange={(e) => L.upd(i, "bonus", Number(e.target.value))} />
          <label style={{ display: "flex", gap: 6, alignItems: "center", textTransform: "none", letterSpacing: 0, fontSize: 14 }}>
            <input type="checkbox" checked={!!s.proficient} onChange={(e) => L.upd(i, "proficient", e.target.checked)} /> Proficient
          </label>
          <RowTools i={i} n={list.length} move={L.move} remove={L.remove} />
        </div>
      ))}
      <p style={{ fontSize: 12, color: "var(--muted)", margin: "4px 0 10px" }}>Proficient shows a filled circle, otherwise an empty outline. The bonus is what the dice adds.</p>
      <button type="button" className="thin" onClick={() => L.add({ name: "", bonus: 2, proficient: false })}><Plus size={14} />Add skill</button>
    </div>
  );
}

export default function SiteEditor({ section }) {
  const live = useSettings();
  const [d, setD] = useState(() => JSON.parse(JSON.stringify(live)));
  const [sub, setSub] = useState("home");
  const [msg, setMsg] = useState("");
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setD({ ...d, [k]: v });
  const logoRef = useRef(null);
  const setLink = (k) => (e) => setD({ ...d, links: { ...d.links, [k]: e.target.value } });

  const save = async () => {
    if (!isFirebaseConfigured) { setMsg("Firebase isn't set up, so nothing can be saved live."); return; }
    setSaving(true); setMsg("");
    try {
      const { about, experience, education, contactIntro, skills, extraSkills, facts, name, role, bottomLine, campaign, intro, links, voiceUrl, logoData, abilities, saves, saveNotes, languages, training, cloudName, uploadPreset, replyTemplate } = d;
      await setDoc(doc(db, "settings", "site"), { about, experience, education, contactIntro, skills, extraSkills, facts, name, role, bottomLine, campaign, intro, links, voiceUrl, logoData, abilities, saves, saveNotes, languages, training, cloudName, uploadPreset, replyTemplate }, { merge: true });
      setMsg("Saved. The live site updates straight away.");
    } catch (e) { setMsg("Could not save: " + e.message); }
    setSaving(false);
  };
  const reset = async () => {
    if (!window.confirm("Reset ALL site text, skills and settings back to the built-in defaults?")) return;
    try { await deleteDoc(doc(db, "settings", "site")); setD(JSON.parse(JSON.stringify(DEFAULTS))); setMsg("Reset to defaults."); } catch (e) { setMsg(e.message); }
  };

  const A = useList(d.about, (v) => set("about", v));
  const E = useList(d.experience, (v) => set("experience", v));
  const ED = useList(d.education || [], (v) => set("education", v));
  const AB = useList(d.abilities, (v) => set("abilities", v));
  const SN = useList(d.saveNotes, (v) => set("saveNotes", v));
  const LG = useList(d.languages, (v) => set("languages", v));
  const TR = useList(d.training, (v) => set("training", v));

  const footer = (
    <div className="btn-row" style={{ marginTop: 14 }}>
      <button type="button" className="solid" disabled={saving} onClick={save}>{saving ? "Saving…" : "Save changes"}</button>
      <button type="button" className="thin" onClick={reset}>Reset to defaults</button>
      {msg && <span role="status" style={{ alignSelf: "center", fontSize: 14, color: "var(--text-2)" }}>{msg}</span>}
    </div>
  );

  if (section === "site") {
    return (
      <>
        <div className="panel adm-card">
          <div className="sec-h">Identity</div>
          <div className="adm-grid">
            <Field label="Campaign / company"><input value={d.campaign} onChange={(e) => set("campaign", e.target.value)} /></Field>
          </div>
        </div>
        <div className="panel adm-card">
          <div className="sec-h">Links</div>
          <div className="adm-grid">
            <Field label="GitHub"><input value={d.links.github} onChange={setLink("github")} /></Field>
            <Field label="Behance"><input value={d.links.behance} onChange={setLink("behance")} /></Field>
            <Field label="LinkedIn"><input value={d.links.linkedin} onChange={setLink("linkedin")} /></Field>
          </div>
        </div>
        <div className="panel adm-card">
          <div className="sec-h">Voiceover and logo</div>
          <div className="adm-grid">
            <Field label="Voiceover audio (upload an mp3, or paste a link; empty = the built-in one)" wide>
              <UploadField kind="audio" accept="audio/*" value={d.voiceUrl} onChange={(v) => set("voiceUrl", v)} />
            </Field>
            <Field label="Logo (PNG, SVG or JPG; shrunk to 320px and stored with the settings)">
              <span className="upl"><input ref={logoRef} type="file" accept="image/*" hidden onChange={async (e) => { const f = e.target.files[0]; if (f) set("logoData", await resizeToDataUrl(f)); e.target.value = ""; }} /><button type="button" className="thin upl-btn" onClick={() => logoRef.current.click()}><UploadCloud size={14} />Upload logo</button></span>
            </Field>
            <Field label="Current logo">
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                {d.logoData ? <img src={d.logoData} alt="" width={64} height={64} style={{ objectFit: "contain" }} /> : <span style={{ color: "var(--muted)", fontSize: 14 }}>Built-in d20 GN</span>}
                {d.logoData && <button type="button" className="thin" onClick={() => set("logoData", "")}>Use built-in logo</button>}
              </div>
            </Field>
          </div>
          </div>
        <div className="panel adm-card">
          <div className="sec-h">Uploads (images, video, audio)</div>
          <div className="adm-grid">
            <Field label="Cloudinary cloud name"><input value={d.cloudName} placeholder="e.g. dxyz12abc" onChange={(e) => set("cloudName", e.target.value.trim())} /></Field>
            <Field label="Unsigned upload preset name"><input value={d.uploadPreset} placeholder="e.g. portfolio_unsigned" onChange={(e) => set("uploadPreset", e.target.value.trim())} /></Field>
          </div>
          <div className="sec-h" style={{ marginTop: 14 }}>Email replies</div>
          <div className="adm-grid"><Field label="EmailJS reply template ID (see EMAILJS_TEMPLATES.md, section 3)"><input value={d.replyTemplate || ""} placeholder="e.g. template_abc123" onChange={(e) => set("replyTemplate", e.target.value.trim())} /></Field></div>
          <p style={{ fontSize: 12, color: "var(--muted)" }}>Free, no card. Sign up at cloudinary.com, copy the cloud name from the dashboard, then Settings, Upload, Add upload preset, set Signing mode to Unsigned, and paste its name here. After that every Upload button in the admin works.</p>
        </div>
        <div className="panel adm-card">
          <div className="sec-h">"Roll for Insight" facts (game log)</div>
          <Field label="One fun fact about you per line. Visitors roll a d20 and get one."><textarea style={{ minHeight: 160 }} value={d.facts.join("\n")} onChange={(e) => set("facts", e.target.value.split("\n").map((x) => x.trim()).filter(Boolean))} /></Field>
        </div>
        {footer}
      </>
    );
  }

  // section === "about"
  return (
    <>
      <div className="subchips" style={{ marginBottom: 14 }}>
        {[["home", "Home intro"], ["abil", "Ability scores"], ["saves", "Saving throws"], ["skills", "Skills"], ["lang", "Languages"], ["tools", "Tools"], ["text", "About text"], ["edu", "Education"], ["exp", "Experience"], ["contact", "Contact"]].map(([id, l]) => (
          <button key={id} type="button" className="chip" aria-pressed={sub === id} onClick={() => setSub(id)}>{l}</button>
        ))}
      </div>
      {sub === "home" && (
        <div className="panel adm-card">
          <div className="sec-h">Top of the home page</div>
          <div className="adm-grid">
            <Field label="Name"><input value={d.name} onChange={(e) => set("name", e.target.value)} /></Field>
            <Field label="Role title"><input value={d.role} onChange={(e) => set("role", e.target.value)} /></Field>
            <Field label="Line under the name (header)" wide><input value={d.bottomLine} onChange={(e) => set("bottomLine", e.target.value)} /></Field>
            <Field label="Intro paragraph (under 'Hi, I'm …')" wide><textarea value={d.intro} onChange={(e) => set("intro", e.target.value)} /></Field>
          </div>
        </div>
      )}
      {sub === "contact" && (
        <div className="panel adm-card">
          <div className="sec-h">Contact tab</div>
          <Field label="Text above the contact form" wide><textarea value={d.contactIntro} onChange={(e) => set("contactIntro", e.target.value)} /></Field>
        </div>
      )}
      {sub === "text" && (
        <>
          {d.about.map((a, i) => (
            <div className="panel adm-card" key={a.id}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><div className="sec-h">Section {i + 1}</div><RowTools i={i} n={d.about.length} move={A.move} remove={A.remove} /></div>
              <div className="adm-grid">
                <Field label="Label (the pill and small heading)"><input value={a.label} onChange={(e) => A.upd(i, "label", e.target.value)} /></Field>
                <Field label="Heading (leave empty for none)"><input value={a.heading} onChange={(e) => A.upd(i, "heading", e.target.value)} /></Field>
                <Field label="Paragraph" wide><textarea style={{ minHeight: 140 }} value={a.text} onChange={(e) => A.upd(i, "text", e.target.value)} /></Field>
              </div>
            </div>
          ))}
          <button type="button" className="thin" onClick={() => A.add({ id: uid(), label: "New section", heading: "", text: "" })}><Plus size={14} />Add section</button>
        </>
      )}
      {sub === "edu" && (
        <>
          {(d.education || []).map((x, i) => (
            <div className="panel adm-card" key={i}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><div className="sec-h">{x.role || "New course"}</div><RowTools i={i} n={(d.education || []).length} move={ED.move} remove={ED.remove} /></div>
              <div className="adm-grid">
                <Field label="Qualification"><input value={x.role} onChange={(e) => ED.upd(i, "role", e.target.value)} /></Field>
                <Field label="Organisation"><input value={x.org} onChange={(e) => ED.upd(i, "org", e.target.value)} /></Field>
                <Field label="When (e.g. Jan 2024 – Present)"><input value={x.when} onChange={(e) => ED.upd(i, "when", e.target.value)} /></Field>
                <Field label="Description" wide><textarea value={x.text} onChange={(e) => ED.upd(i, "text", e.target.value)} /></Field>
              </div>
            </div>
          ))}
          <button type="button" className="thin" onClick={() => ED.add({ role: "", org: "", when: "", text: "" })}><Plus size={14} />Add education</button>
        </>
      )}
      {sub === "exp" && (
        <>
          {d.experience.map((x, i) => (
            <div className="panel adm-card" key={i}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><div className="sec-h">{x.role || "New entry"}</div><RowTools i={i} n={d.experience.length} move={E.move} remove={E.remove} /></div>
              <div className="adm-grid">
                <Field label="Role"><input value={x.role} onChange={(e) => E.upd(i, "role", e.target.value)} /></Field>
                <Field label="Organisation"><input value={x.org} onChange={(e) => E.upd(i, "org", e.target.value)} /></Field>
                <Field label="When (e.g. Jan 2024 – Present)"><input value={x.when} onChange={(e) => E.upd(i, "when", e.target.value)} /></Field>
                <Field label="Description" wide><textarea value={x.text} onChange={(e) => E.upd(i, "text", e.target.value)} /></Field>
              </div>
            </div>
          ))}
          <button type="button" className="thin" onClick={() => E.add({ role: "", org: "", when: "", text: "" })}><Plus size={14} />Add experience</button>
        </>
      )}
      {sub === "skills" && (
        <>
          <SkillList title="Skills panel (home page)" list={d.skills} setList={(v) => set("skills", v)} />
          <SkillList title="Extra skills (About tab, bottom of Skills)" list={d.extraSkills} setList={(v) => set("extraSkills", v)} />
        </>
      )}
      {sub === "abil" && (
        <div className="panel adm-card">
          <div className="sec-h">Ability scores</div>
          {d.abilities.map((a, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 100px 100px auto", gap: 10, alignItems: "end", marginBottom: 8 }}>
              <Field label="Name"><input value={a.name} onChange={(e) => AB.upd(i, "name", e.target.value)} /></Field>
              <Field label="Score"><input type="number" value={a.score ?? ""} placeholder="--" onChange={(e) => AB.upd(i, "score", e.target.value === "" ? null : Number(e.target.value))} /></Field>
              <Field label="Bonus"><input type="number" value={a.bonus ?? ""} placeholder="auto" onChange={(e) => AB.upd(i, "bonus", e.target.value === "" ? null : Number(e.target.value))} /></Field>
              <RowTools i={i} n={d.abilities.length} move={AB.move} remove={AB.remove} />
              <div style={{ gridColumn: "1 / -1" }}><Field label="Message when clicked and not rated (optional)"><input value={a.note || ""} onChange={(e) => AB.upd(i, "note", e.target.value)} /></Field></div>
            </div>
          ))}
          <p style={{ fontSize: 12, color: "var(--muted)" }}>Leave the bonus empty to work it out from the score (score 16 gives +3). Leave both empty to show "--".</p>
          <button type="button" className="thin" onClick={() => AB.add({ name: "", score: 10, bonus: null, note: "" })}><Plus size={14} />Add ability</button>
        </div>
      )}
      {sub === "saves" && (
        <>
          <SkillList title="Saving throws" list={d.saves} setList={(v) => set("saves", v)} />
          <div className="panel adm-card">
            <div className="sec-h">Notes under the saves</div>
            {d.saveNotes.map((n, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "90px 1fr auto", gap: 10, alignItems: "center", marginBottom: 8 }}>
                <select aria-label="Icon" value={n.kind} onChange={(e) => SN.upd(i, "kind", e.target.value)}><option value="A">A (advantage)</option><option value="+">+ (bonus)</option></select>
                <input aria-label="Note" value={n.text} onChange={(e) => SN.upd(i, "text", e.target.value)} />
                <RowTools i={i} n={d.saveNotes.length} move={SN.move} remove={SN.remove} />
              </div>
            ))}
            <button type="button" className="thin" onClick={() => SN.add({ kind: "+", text: "" })}><Plus size={14} />Add note</button>
          </div>
        </>
      )}
      {sub === "lang" && (
        <div className="panel adm-card">
          <div className="sec-h">Languages</div>
          {d.languages.map((l, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 100px auto", gap: 10, alignItems: "center", marginBottom: 8 }}>
              <input aria-label="Language" value={l.name} onChange={(e) => LG.upd(i, "name", e.target.value)} />
              <input aria-label="Level" type="number" value={l.level} onChange={(e) => LG.upd(i, "level", Number(e.target.value))} />
              <RowTools i={i} n={d.languages.length} move={LG.move} remove={LG.remove} />
            </div>
          ))}
          <button type="button" className="thin" onClick={() => LG.add({ name: "", level: 5 })}><Plus size={14} />Add language</button>
        </div>
      )}
      {sub === "tools" && (
        <div className="panel adm-card">
          <div className="sec-h">Tools, platforms and training</div>
          {d.training.map((g, i) => (
            <div key={i} style={{ marginBottom: 14 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 10, alignItems: "end" }}>
                <Field label="Group title"><input value={g.title} onChange={(e) => TR.upd(i, "title", e.target.value)} /></Field>
                <RowTools i={i} n={d.training.length} move={TR.move} remove={TR.remove} />
              </div>
              <Field label="Items (comma separated)"><input value={g.items} onChange={(e) => TR.upd(i, "items", e.target.value)} /></Field>
            </div>
          ))}
          <button type="button" className="thin" onClick={() => TR.add({ title: "", items: "" })}><Plus size={14} />Add group</button>
        </div>
      )}
      {footer}
    </>
  );
}
