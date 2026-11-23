import React, { useEffect, useRef, useState } from "react";
import { X, Volume2, VolumeX, Send, Sparkles, ChevronDown } from "lucide-react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db, isFirebaseConfigured } from "../../lib/firebase";
import { notifyOwner } from "../../lib/emailConfig";
import { useDice } from "../../lib/dice";
import { useSettings } from "../../lib/useSettings";
import { isMuted, setMuted, onMuteChange, sfx } from "../../lib/sound";

const lsGet = (k) => { try { return localStorage.getItem(k) || ""; } catch { return ""; } };
const lsSet = (k, v) => { try { localStorage.setItem(k, v); } catch { /* ignore */ } };

function ChatBox() {
  const { addLog } = useDice();
  const [name, setName] = useState(() => lsGet("chatName"));
  const [email, setEmail] = useState(() => lsGet("chatEmail"));
  const [showEmail, setShowEmail] = useState(() => !!lsGet("chatEmail"));
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const send = async (e) => {
    e.preventDefault();
    const msg = text.trim();
    if (!msg || busy) return;
    const last = Number(lsGet("chatLast") || 0);
    if (Date.now() - last < 20000) { setErr("Give the raven a moment, then try again."); return; }
    setErr(""); setBusy(true);
    lsSet("chatName", name); lsSet("chatEmail", email);
    try {
      if (!isFirebaseConfigured) throw new Error("offline");
      await addDoc(collection(db, "chat"), { name: name.trim().slice(0, 60), email: email.trim().slice(0, 200), text: msg.slice(0, 500), createdAt: serverTimestamp() });
      notifyOwner(`Chat message${name ? " from " + name : ""}`, "Someone left a message in the game log", `${msg}\n\nFrom: ${name || "anonymous"}${email ? " (" + email + ")" : ""}`);
      lsSet("chatLast", String(Date.now()));
      addLog({ kind: "chat", text: `${name.trim() || "You"}: ${msg}` });
      addLog({ kind: "sys", text: email.trim() ? "Your message reached me. I will reply by email." : "Your message reached me. Add an email next time if you'd like a reply." });
      sfx.send();
      setText("");
    } catch (er) { console.warn(er); setErr("That didn't send. Try the Contact tab instead."); }
    setBusy(false);
  };

  return (
    <form className="chat" onSubmit={send}>
      <div className="chat-row">
        <input aria-label="Your name" placeholder="Your name (optional)" maxLength={60} value={name} onChange={(e) => setName(e.target.value)} />
        {showEmail ? <input aria-label="Your email" type="email" placeholder="Email, for a reply" maxLength={200} value={email} onChange={(e) => setEmail(e.target.value)} /> : <button type="button" className="thin" onClick={() => setShowEmail(true)}>Want a reply?</button>}
      </div>
      <div className="chat-row">
        <input aria-label="Message to Gaby" placeholder="Say hi…" maxLength={500} value={text} onChange={(e) => setText(e.target.value)} />
        <button className="solid" style={{ minHeight: 40, padding: "0 14px" }} disabled={busy || !text.trim()} aria-label="Send message"><Send size={15} /></button>
      </div>
      {err && <div className="status-err" role="alert" style={{ fontSize: 13 }}>{err}</div>}
    </form>
  );
}

const pad = (n) => String(n).padStart(2, "0");
// today: time only. Yesterday and "2 days ago" in words. Older: the date.
function when(at) {
  if (!at) return "";
  const t = new Date(at), n = new Date();
  const hm = `${pad(t.getHours())}:${pad(t.getMinutes())}`;
  const days = Math.round((new Date(n.getFullYear(), n.getMonth(), n.getDate()) - new Date(t.getFullYear(), t.getMonth(), t.getDate())) / 864e5);
  if (days <= 0) return hm;
  if (days === 1) return `Yesterday ${hm}`;
  if (days === 2) return `2 days ago ${hm}`;
  return `${t.getDate()} ${t.toLocaleString("en-GB", { month: "short" })} ${t.getFullYear()} ${hm}`;
}

function Bubble({ l }) {
  const [open, setOpen] = useState(false);
  const time = <div className="b-time">{when(l.at)}</div>;
  if (l.kind === "roll") {
    const hasD = typeof l.d === "number";
    const formula = hasD ? `1d${l.sides}${l.mod ? (l.mod > 0 ? "+" : "-") + Math.abs(l.mod) : "+0"}` : "";
    const nat = l.sides === 20 && l.d === 20 ? " crit" : l.sides === 20 && l.d === 1 ? " fail" : "";
    return (
      <button type="button" className={`bub roll${nat}`} onClick={() => hasD && setOpen(!open)} aria-expanded={hasD ? open : undefined}>
        <span className="b-row"><span className="b-total">{l.total}</span><span><span className="b-kind">{l.label}</span>{formula && <span className="b-formula">{formula}</span>}</span>{hasD && <ChevronDown size={14} className={`b-chev ${open ? "up" : ""}`} />}</span>
        {open && hasD && <span className="b-more">I rolled a {l.d} on the d{l.sides}{l.mod ? ` and added ${l.mod}` : ", with nothing to add"}, so the result is {l.total}.{nat === " crit" ? " A natural 20!" : nat === " fail" ? " A natural 1." : ""}</span>}
        {time}
      </button>
    );
  }
  if (l.kind === "chat") return <div className="bub me">{l.text}{time}</div>;
  if (l.kind === "fact") return <div className="bub fact"><span className="b-kind">Fun fact</span>{l.text.replace(/^Insight \(\d+\): /, "")}{time}</div>;
  return <div className="bub sys">{l.text}{time}</div>;
}

export default function Drawer() {
  const { drawerOpen, closeDrawer, log, roll, addLog } = useDice();
  const { facts } = useSettings();
  const [muted, setM] = useState(isMuted());
  const listRef = useRef(null);
  useEffect(() => onMuteChange(setM), []);
  useEffect(() => { const el = listRef.current; if (el) el.scrollTop = el.scrollHeight; }, [log.length, drawerOpen]);
  if (!drawerOpen) return null;

  const insight = () => roll("Insight check", 0, 20, {
    onDone: (d) => { sfx.fact(); addLog({ kind: "fact", text: `Insight (${d}): ${d === 20 ? "Natural 20! " : ""}${facts[(d - 1) % facts.length]}` }); },
  });

  return (
    <div className="drawer-wrap">
      <div className="drawer-scrim" onClick={closeDrawer} aria-hidden="true" />
      <aside className="drawer" role="dialog" aria-label="Game log">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span className="cz" style={{ fontWeight: 700, fontSize: 20, color: "var(--text)" }}>Game log</span>
          <span style={{ display: "flex", gap: 6 }}>
            <button type="button" className="thin icon-btn" onClick={() => { setMuted(!muted); if (muted) setTimeout(sfx.result, 30); }} aria-label={muted ? "Turn sound on" : "Mute sound"} aria-pressed={muted}>{muted ? <VolumeX size={14} /> : <Volume2 size={14} />}</button>
            <button type="button" className="thin icon-btn" onClick={closeDrawer} aria-label="Close the drawer"><X size={14} /></button>
          </span>
        </div>
        <div className="rc" style={{ fontSize: 13, color: "var(--muted)" }}>Every roll appears here. Chat with me below, or roll for a fun fact about me.</div>
        <button type="button" className="thin" style={{ justifyContent: "center" }} onClick={insight}><Sparkles size={14} />Roll for Insight</button>
        <div className="log-list" ref={listRef}>
          <div className="log-spacer" />
          {log.length === 0 && <div className="log-line">No rolls yet. Click a modifier to roll.</div>}
          {[...log].reverse().map((l) => <Bubble key={l.id} l={l} />)}
        </div>
        <ChatBox />
      </aside>
    </div>
  );
}
