import React, { useEffect, useRef } from "react";
import * as THREE from "three";

// A 3D d20 that is thrown onto the screen, tumbles, bounces and settles on `value`.
// The "20" face carries the GN logo. Calls onSettled() when it lands and onDone() when it has faded out.
const ACCENT = "#ba9fe1", FACE = "#1d1935", BG = "#14102a";

function drawLogo(ctx, cx, cy, s) {
  ctx.save(); ctx.translate(cx - 50 * s, cy - 52 * s); ctx.scale(s, s);
  ctx.strokeStyle = ACCENT; ctx.fillStyle = ACCENT; ctx.lineJoin = "round"; ctx.lineCap = "round";
  const poly = (pts, w, a) => { ctx.globalAlpha = a; ctx.lineWidth = w; ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke(); };
  poly([[50, 5], [91, 28], [91, 72], [50, 95], [9, 72], [9, 28], [50, 5]], 3.5, 1);
  poly([[28, 60], [72, 60], [50, 95], [28, 60]], 2, 0.5); poly([[9, 28], [28, 60]], 2, 0.5); poly([[91, 28], [72, 60]], 2, 0.5);
  poly([[50, 5], [28, 60]], 2, 0.5); poly([[50, 5], [72, 60]], 2, 0.5);
  poly([[50, 17], [50, 42]], 3.5, 1); poly([[40, 25], [60, 25]], 3.5, 1);
  ctx.globalAlpha = 1; ctx.font = "700 23px 'Roboto Condensed', Arial, sans-serif"; ctx.textAlign = "center"; ctx.fillText("GN", 50, 78);
  ctx.restore();
}

function makeAtlas(numbers) {
  const S = 256, canvas = document.createElement("canvas"); canvas.width = S * 5; canvas.height = S * 4;
  const ctx = canvas.getContext("2d"); ctx.fillStyle = BG; ctx.fillRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < 20; i++) {
    const x0 = (i % 5) * S, y0 = Math.floor(i / 5) * S;
    ctx.fillStyle = FACE; ctx.fillRect(x0, y0, S, S);
    const n = numbers[i];
    if (n === 20) drawLogo(ctx, x0 + 128, y0 + 150, 1.25);
    else {
      ctx.fillStyle = ACCENT; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.font = `700 ${n > 9 ? 84 : 100}px 'Roboto Condensed', Arial, sans-serif`;
      ctx.fillText(String(n), x0 + 128, y0 + 158);
      if (n === 6 || n === 9) ctx.fillRect(x0 + 100, y0 + 208, 56, 8);
    }
  }
  const tex = new THREE.CanvasTexture(canvas); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4;
  return { tex, S, W: canvas.width, H: canvas.height };
}

export default function Dice3D({ value, onSettled, onDone }) {
  const mount = useRef(null);
  const cb = useRef({ onSettled, onDone }); cb.current = { onSettled, onDone };

  useEffect(() => {
    let raf = 0, disposed = false, settled = false, done = false;
    const finishAll = () => { if (!settled) { settled = true; cb.current.onSettled(); } if (!done) { done = true; cb.current.onDone(); } };
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch { finishAll(); return undefined; }
    const el = mount.current; renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2)); el.appendChild(renderer.domElement);
    const scene = new THREE.Scene(); const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 60);
    camera.position.set(0, 5.2, 8); camera.lookAt(0, 0.6, 0);
    scene.add(new THREE.AmbientLight(0xffffff, 0.9));
    const key = new THREE.DirectionalLight(0xffffff, 2.2); key.position.set(3, 8, 5); scene.add(key);
    const rim = new THREE.PointLight(0x9a64c5, 40, 20); rim.position.set(-4, 3, 2); scene.add(rim);
    const rim2 = new THREE.PointLight(0x568de4, 30, 20); rim2.position.set(4, 2, -3); scene.add(rim2);

    // geometry + per-face number atlas (opposite faces add up to 21)
    const geo = new THREE.IcosahedronGeometry(1, 0).toNonIndexed();
    const pos = geo.attributes.position, normals = [], tops = [];
    for (let i = 0; i < 20; i++) {
      const a = new THREE.Vector3().fromBufferAttribute(pos, i * 3), b = new THREE.Vector3().fromBufferAttribute(pos, i * 3 + 1), c = new THREE.Vector3().fromBufferAttribute(pos, i * 3 + 2);
      const ctr = a.clone().add(b).add(c).divideScalar(3); normals.push(ctr.clone().normalize()); tops.push(a.clone().sub(ctr).normalize());
    }
    const numbers = new Array(20).fill(0); let k = 1;
    for (let i = 0; i < 20; i++) {
      if (numbers[i]) continue;
      const j = normals.findIndex((n, idx) => idx !== i && n.dot(normals[i]) < -0.99);
      numbers[i] = k; numbers[j] = 21 - k; k++;
    }
    const atlas = makeAtlas(numbers); const uv = new Float32Array(20 * 3 * 2);
    const pts = [[128, 22], [14, 220], [242, 220]];
    for (let i = 0; i < 20; i++) {
      const x0 = (i % 5) * atlas.S, y0 = Math.floor(i / 5) * atlas.S;
      pts.forEach(([px, py], v) => { uv[(i * 3 + v) * 2] = (x0 + px) / atlas.W; uv[(i * 3 + v) * 2 + 1] = 1 - (y0 + py) / atlas.H; });
    }
    geo.setAttribute("uv", new THREE.BufferAttribute(uv, 2)); geo.computeVertexNormals();
    const mat = new THREE.MeshStandardMaterial({ map: atlas.tex, flatShading: true, metalness: 0.35, roughness: 0.35 });
    const die = new THREE.Mesh(geo, mat);
    die.add(new THREE.LineSegments(new THREE.EdgesGeometry(geo), new THREE.LineBasicMaterial({ color: 0xba9fe1 })));
    const group = new THREE.Group(); group.add(die); scene.add(group);
    const shadow = new THREE.Mesh(new THREE.CircleGeometry(1, 32), new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.3 }));
    shadow.rotation.x = -Math.PI / 2; shadow.position.y = 0.02; scene.add(shadow);

    // target orientation: the chosen face points at the camera, number upright
    const faceIdx = numbers.indexOf(value);
    const camDir = camera.position.clone().sub(new THREE.Vector3(0, 0.85, 0)).normalize();
    const q1 = new THREE.Quaternion().setFromUnitVectors(normals[faceIdx], camDir);
    const camUp = new THREE.Vector3(0, 1, 0).sub(camDir.clone().multiplyScalar(camDir.y)).normalize();
    const topNow = tops[faceIdx].clone().applyQuaternion(q1); topNow.sub(camDir.clone().multiplyScalar(topNow.dot(camDir))).normalize();
    let ang = Math.acos(Math.max(-1, Math.min(1, topNow.dot(camUp)))); if (topNow.clone().cross(camUp).dot(camDir) < 0) ang = -ang;
    const target = new THREE.Quaternion().setFromAxisAngle(camDir, ang).multiply(q1);

    const resize = () => {
      const w = window.innerWidth, h = window.innerHeight; renderer.setSize(w, h); camera.aspect = w / h; camera.updateProjectionMatrix();
      const s = w < 700 ? 0.75 : 1; die.scale.setScalar(s); die.userData.s = s;
    };
    resize(); window.addEventListener("resize", resize);

    const axis = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
    const free = new THREE.Quaternion().random();
    const dir = Math.random() < 0.5 ? -1 : 1;
    const rest = 0.82, T_FALL = 0.55, TB = [0.55, 0.95, 1.25, 1.5], HB = [0, 1.7, 0.8, 0.3], T_SETTLE = 1.5, T_HOLD = 1.4;
    const ease = (t) => 1 - Math.pow(1 - Math.min(1, Math.max(0, t)), 3);
    const start = performance.now(); let last = start;
    const frame = (now) => {
      if (disposed) return; raf = requestAnimationFrame(frame);
      const t = (now - start) / 1000, dt = Math.min(0.05, (now - last) / 1000); last = now;
      const s = die.userData.s || 1, r = rest * s;
      // horizontal travel: thrown in from the side to the centre
      const px = 0.2 + dir * 6.5 * (1 - ease(t / T_SETTLE)), pz = 0.3 - 1.2 * (1 - ease(t / T_SETTLE));
      let y;
      if (t < T_FALL) { const q = t / T_FALL; y = r + (5 - r) * (1 - q * q); }
      else {
        let seg = 1; while (seg < TB.length - 1 && t > TB[seg]) seg++;
        const t0 = TB[seg - 1], t1 = TB[seg], q = Math.min(1, Math.max(0, (t - t0) / (t1 - t0)));
        y = r + HB[seg] * 4 * q * (1 - q); if (t > TB[TB.length - 1]) y = r;
      }
      group.position.set(px, y, pz);
      const spin = Math.max(0, 16 * Math.exp(-1.6 * t));
      free.premultiply(new THREE.Quaternion().setFromAxisAngle(axis, spin * dt));
      const w = ease((t - 1.0) / (T_SETTLE - 1.0));
      die.quaternion.copy(free).slerp(target, w);
      shadow.position.set(px, 0.02, pz); const sh = Math.max(0.35, 1 - (y - r) * 0.12); shadow.scale.setScalar(sh * 0.9 * s); shadow.material.opacity = 0.32 * sh;
      if (!settled && t >= T_SETTLE) { settled = true; die.quaternion.copy(target); cb.current.onSettled(); }
      const fade = t > T_SETTLE + T_HOLD ? Math.max(0, 1 - (t - T_SETTLE - T_HOLD) / 0.45) : 1;
      renderer.domElement.style.opacity = String(fade);
      renderer.render(scene, camera);
      if (t > T_SETTLE + T_HOLD + 0.5 && !done) { done = true; cb.current.onDone(); }
    };
    raf = requestAnimationFrame(frame);
    return () => {
      disposed = true; cancelAnimationFrame(raf); window.removeEventListener("resize", resize);
      geo.dispose(); mat.dispose(); atlas.tex.dispose(); renderer.dispose();
      if (renderer.domElement.parentNode === el) el.removeChild(renderer.domElement);
      if (!settled) { settled = true; cb.current.onSettled(); }
    };
  }, [value]);

  return <div ref={mount} className="dice3d" aria-hidden="true" />;
}
