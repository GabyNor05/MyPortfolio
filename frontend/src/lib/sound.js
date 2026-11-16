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
function clack(t = 0, gain = 0.1, freq = 2600, len = 0.035) {
  const c = ac(); if (!c) return;
  const now = c.currentTime + t, n = Math.floor(c.sampleRate * len);
  const buf = c.createBuffer(1, n, c.sampleRate), d = buf.getChannelData(0);
  for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 3);
  const s = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain();
  s.buffer = buf; f.type = "bandpass"; f.frequency.value = freq; f.Q.value = 2.2;
  g.gain.value = gain * MASTER * 2; s.connect(f).connect(g).connect(c.destination); s.start(now);
}
// a wooden "knock" body under the click
function knock(t = 0, gain = 0.1, f0 = 230) { tone(f0, { t, dur: 0.09, gain, slide: -f0 * 0.45, type: "triangle", attack: 0.002 }); }
const rnd = (a, b) => a + Math.random() * (b - a);

export const sfx = {
  rattle() { let t = 0; for (let i = 0; i < 9; i++) { clack(t, rnd(0.03, 0.06), rnd(2200, 3600), 0.025); t += rnd(0.03, 0.07); } },
  bounce(strength = 1) { clack(0, 0.12 * strength, rnd(1800, 2600), 0.04); knock(0, 0.1 * strength, rnd(190, 260)); },
  land() { clack(0, 0.06, 1500, 0.05); clack(0.07, 0.035, 2000, 0.03); clack(0.12, 0.02, 2400, 0.025); knock(0, 0.06, 150); },
  result() { tone(660, { dur: 0.35, gain: 0.05 }); tone(990, { t: 0.02, dur: 0.3, gain: 0.025 }); },
  crit() { [523, 659, 784, 1047].forEach((f, i) => tone(f, { t: i * 0.09, dur: 0.6, gain: 0.06 })); },
  fail() { tone(300, { dur: 0.3, gain: 0.06, slide: -90 }); tone(220, { t: 0.14, dur: 0.4, gain: 0.06, slide: -70 }); },
  send() { tone(520, { dur: 0.14, gain: 0.05 }); tone(780, { t: 0.1, dur: 0.22, gain: 0.05 }); },
  fact() { [392, 494, 587].forEach((f, i) => tone(f, { t: i * 0.07, dur: 0.4, gain: 0.04, type: "triangle" })); },
};
