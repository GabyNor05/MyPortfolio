import React, { useEffect, useRef, useState } from "react";
import { X, Volume2, VolumeX, Send, Sparkles } from "lucide-react";
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
          {[...log].reverse().map((l) => <div key={l.id} className={`log-line log-${l.kind || "roll"}`}>{l.text}</div>)}
        </div>
        <ChatBox />
      </aside>
    </div>
  );
}
