import React, { useRef, useState } from "react";
import { UploadCloud, X } from "lucide-react";
import { useSettings } from "../../lib/useSettings";

// Uploads a file to Cloudinary (free, no card) using the unsigned preset set in Site settings.
export function useUpload() {
  const { cloudName, uploadPreset } = useSettings();
  const ready = !!(cloudName && uploadPreset);
  const upload = (file, onProgress) => new Promise((res, rej) => {
    if (!ready) return rej(new Error("Uploads aren't set up yet. Add your Cloudinary cloud name and preset in Site settings."));
    const fd = new FormData(); fd.append("file", file); fd.append("upload_preset", uploadPreset);
    const x = new XMLHttpRequest();
    x.open("POST", `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`);
    x.upload.onprogress = (e) => e.lengthComputable && onProgress && onProgress(Math.round((e.loaded / e.total) * 100));
    x.onload = () => { try { const j = JSON.parse(x.responseText); x.status < 300 && j.secure_url ? res(j.secure_url) : rej(new Error(j.error?.message || "Upload failed")); } catch { rej(new Error("Upload failed")); } };
    x.onerror = () => rej(new Error("Network error during upload"));
    x.send(fd);
  });
  return { ready, upload };
}

const isVid = (u) => /\.(mp4|webm|mov|m4v)(\?|$)/i.test(u) || /\/video\/upload\//.test(u);

function Preview({ url, kind }) {
  if (!url) return null;
  if (kind === "audio") return <audio src={url} controls style={{ height: 34, maxWidth: "100%" }} />;
  if (kind === "video" || isVid(url)) return <video src={url} muted style={{ height: 56, borderRadius: 6 }} />;
  return <img src={url} alt="" style={{ height: 56, borderRadius: 6, objectFit: "cover" }} />;
}

export function UploadButton({ accept, multiple, onDone, label = "Upload file" }) {
  const { ready, upload } = useUpload();
  const ref = useRef(null);
  const [busy, setBusy] = useState(null);
  const [err, setErr] = useState("");
  const pick = async (e) => {
    const files = [...e.target.files]; e.target.value = ""; setErr("");
    const urls = [];
    for (let i = 0; i < files.length; i++) {
      try { setBusy(`${i + 1}/${files.length} · 0%`); urls.push(await upload(files[i], (p) => setBusy(`${i + 1}/${files.length} · ${p}%`))); }
      catch (er) { setErr(er.message); break; }
    }
    setBusy(null); if (urls.length) onDone(urls);
  };
  return (
    <span className="upl">
      <input ref={ref} type="file" hidden accept={accept} multiple={multiple} onChange={pick} />
      <button type="button" className="thin upl-btn" disabled={!!busy} onClick={() => (ready ? ref.current.click() : setErr("Set up uploads first: Site settings, Uploads."))}><UploadCloud size={14} />{busy ? `Uploading ${busy}` : label}</button>
      {err && <span className="upl-err" role="alert">{err}</span>}
    </span>
  );
}

// single URL with upload
export function UploadField({ value, onChange, accept = "image/*", kind = "image", placeholder }) {
  return (
    <div className="upl-field">
      <div className="upl-row">
        <input value={value} placeholder={placeholder || "Paste a link, or upload"} onChange={(e) => onChange(e.target.value)} />
        <UploadButton accept={accept} onDone={(u) => onChange(u[0])} />
        {value && <button type="button" className="thin icon-btn" aria-label="Clear" onClick={() => onChange("")}><X size={14} /></button>}
      </div>
      <Preview url={value} kind={kind} />
    </div>
  );
}

// list of URLs (stored as newline text in the project form)
export function UploadList({ value, onChange, accept = "image/*" }) {
  const list = value.split("\n").map((x) => x.trim()).filter(Boolean);
  const set = (l) => onChange(l.join("\n"));
  return (
    <div className="upl-field">
      <UploadButton accept={accept} multiple label="Upload files" onDone={(u) => set([...list, ...u])} />
      <div className="upl-grid">
        {list.map((u, i) => (
          <div className="upl-item" key={u + i}>
            <Preview url={u.startsWith("projects/") ? import.meta.env.BASE_URL + u : u} />
            <input value={u} onChange={(e) => set(list.map((x, j) => (j === i ? e.target.value : x)))} aria-label={`Item ${i + 1}`} />
            <button type="button" className="thin icon-btn" aria-label="Remove" onClick={() => set(list.filter((_, j) => j !== i))}><X size={13} /></button>
          </div>
        ))}
      </div>
    </div>
  );
}
