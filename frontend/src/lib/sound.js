// Soft synthesized tabletop sounds (WebAudio, no files). Quiet by default, mute is remembered.
let ctx = null;
const KEY = "soundMuted";
let muted = false;
try { muted = localStorage.getItem(KEY) === "1"; } catch { /* ignore */ }
const listeners = new Set();

export const isMuted = () => muted;
export const onMuteChange = (f) => { listeners.add(f); return () => listeners.delete(f); };
export function setMuted(v) {
  muted = v;
  try { localStorage.setItem(KEY, v ? "1" : "0"); } catch { /* ignore */ }
  listeners.forEach((f) => f(v));
}

function ac() {
  if (muted) return null;
  try {
    if (!ctx) { const C = window.AudioContext || window.webkitAudioContext; if (!C) return null; ctx = new C(); }
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  } catch { return null; }
}

const MASTER = 0.5;
function tone(freq, { t = 0, dur = 0.25, type = "sine", gain = 0.08, slide = 0, attack = 0.004 } = {}) {
  const c = ac(); if (!c) return;
  const now = c.currentTime + t;
  const o = c.createOscillator(), g = c.createGain();
  o.type = type; o.frequency.setValueAtTime(freq, now);
  if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(30, freq + slide), now + dur);
  g.gain.setValueAtTime(0.0001, now);
  g.gain.exponentialRampToValueAtTime(gain * MASTER, now + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
  o.connect(g).connect(c.destination); o.start(now); o.stop(now + dur + 0.02);
}
function tick(t = 0, gain = 0.05, freq = 1800) {
  const c = ac(); if (!c) return;
  const now = c.currentTime + t, len = Math.floor(c.sampleRate * 0.03);
  const buf = c.createBuffer(1, len, c.sampleRate), d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
  const s = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain();
  s.buffer = buf; f.type = "bandpass"; f.frequency.value = freq; f.Q.value = 1.2;
  g.gain.value = gain * MASTER; s.connect(f).connect(g).connect(c.destination); s.start(now);
}

export const sfx = {
  rattle() { [0, .05, .1, .15, .22].forEach((t, i) => tick(t, 0.035 + i * 0.005, 1500 + i * 250)); },
  bounce(strength = 1) { tick(0, 0.07 * strength, 900); tone(150, { dur: 0.12, gain: 0.07 * strength, slide: -60 }); },
  land() { tick(0, 0.05, 700); tone(110, { dur: 0.22, gain: 0.09, slide: -40 }); },
  result() { tone(660, { dur: 0.35, gain: 0.05 }); tone(990, { t: 0.02, dur: 0.3, gain: 0.025 }); },
  crit() { [523, 659, 784, 1047].forEach((f, i) => tone(f, { t: i * 0.09, dur: 0.6, gain: 0.06 })); },
  fail() { tone(300, { dur: 0.3, gain: 0.06, slide: -90 }); tone(220, { t: 0.14, dur: 0.4, gain: 0.06, slide: -70 }); },
  send() { tone(520, { dur: 0.14, gain: 0.05 }); tone(780, { t: 0.1, dur: 0.22, gain: 0.05 }); },
  fact() { [392, 494, 587].forEach((f, i) => tone(f, { t: i * 0.07, dur: 0.4, gain: 0.04, type: "triangle" })); },
};
