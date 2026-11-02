import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

const LANG = new URLSearchParams(location.search).get("lang") || "en";
const HI = LANG === "hi";
const W = 1280, H = 720;
const FONT = HI ? "'Noto Sans Devanagari', 'Jakarta'" : "'Jakarta', 'Noto Sans Devanagari'";

const MARIGOLD = 0xf2b544;

// ---------- helpers ----------
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const prog = (t, a, b) => clamp((t - a) / (b - a));
const ease = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const easeOut = (x) => 1 - Math.pow(1 - x, 3);
const lerp = (a, b, x) => a + (b - a) * x;
function rng(seed) {
  return () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
}
const rand = rng(42);

// ---------- renderer / scene ----------
const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true, alpha: true });
renderer.setClearColor(0x000000, 0);
renderer.setSize(W, H);
renderer.setPixelRatio(1);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
document.getElementById("stage").appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x14244f, 12, 28);
const camera = new THREE.PerspectiveCamera(38, W / H, 0.1, 100);

scene.add(new THREE.AmbientLight(0xbfd0ff, 0.9));
const key = new THREE.DirectionalLight(0xffffff, 2.2);
key.position.set(4, 6, 8);
scene.add(key);
const rim = new THREE.DirectionalLight(0x6f8cff, 1.4);
rim.position.set(-6, 2, -4);
scene.add(rim);
const warm = new THREE.PointLight(MARIGOLD, 0, 12, 1.5);
warm.position.set(0, 0, 3);
scene.add(warm);

// ---------- particles ----------
const pCount = 700;
const pGeo = new THREE.BufferGeometry();
const pPos = new Float32Array(pCount * 3);
for (let i = 0; i < pCount; i++) {
  pPos[i * 3] = (rand() - 0.5) * 30;
  pPos[i * 3 + 1] = (rand() - 0.5) * 18;
  pPos[i * 3 + 2] = (rand() - 0.5) * 20 - 4;
}
pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
const particles = new THREE.Points(
  pGeo,
  new THREE.PointsMaterial({ color: 0x9fb4ff, size: 0.045, transparent: true, opacity: 0.55, depthWrite: false }),
);
scene.add(particles);

// ---------- paper documents (the confusing paperwork) ----------
const DOC_TITLES = HI
  ? ["आवेदन पत्र", "आय प्रमाण", "जाति प्रमाण", "निवास प्रमाण", "बैंक विवरण", "राशन कार्ड", "शपथ पत्र", "फॉर्म 7"]
  : ["Application", "Income proof", "Caste cert.", "Address proof", "Bank details", "Ration card", "Affidavit", "Form 7"];

function docTexture(title, hue) {
  const c = document.createElement("canvas");
  c.width = 256; c.height = 344;
  const g = c.getContext("2d");
  g.fillStyle = "#fbfaf6"; g.fillRect(0, 0, 256, 344);
  g.fillStyle = hue; g.fillRect(0, 0, 256, 54);
  g.fillStyle = "#fff"; g.font = `700 24px ${FONT}`; g.fillText(title, 18, 36);
  g.fillStyle = "#d5dae3";
  for (let i = 0; i < 9; i++) {
    const w = 120 + ((i * 53) % 100);
    g.fillRect(18, 80 + i * 26, w, 9);
  }
  g.strokeStyle = "#c3cad6"; g.lineWidth = 2;
  g.strokeRect(18, 300, 22, 22); g.strokeRect(130, 300, 22, 22);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}
const hues = ["#1e3a7b", "#9a3412", "#065f46", "#6b21a8", "#1e3a7b", "#b45309", "#334155", "#be123c"];
const docs = [];
const docGeo = new THREE.BoxGeometry(1, 1.34, 0.025);
for (let i = 0; i < 22; i++) {
  const tex = docTexture(DOC_TITLES[i % DOC_TITLES.length], hues[i % hues.length]);
  const front = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.75 });
  const side = new THREE.MeshStandardMaterial({ color: 0xe8e6df, roughness: 0.9 });
  const m = new THREE.Mesh(docGeo, [side, side, side, side, front, side]);
  const r = 3.2 + rand() * 4.2, a = rand() * Math.PI * 2, b = (rand() - 0.5) * 1.6;
  m.userData = {
    p0: new THREE.Vector3(Math.cos(a) * r + 1.6, Math.sin(b) * 2.6 + (rand() - 0.5) * 1.5, Math.sin(a) * r * 0.6 - 1.5),
    rot: new THREE.Vector3(rand() * 6, rand() * 6, rand() * 6),
    spin: new THREE.Vector3((rand() - 0.5) * 1.4, (rand() - 0.5) * 1.4, (rand() - 0.5) * 0.8),
    bob: rand() * 6,
    delay: rand() * 1.4,
    scale: 0.75 + rand() * 0.45,
  };
  scene.add(m);
  docs.push(m);
}

// ---------- phone ----------
const phone = new THREE.Group();
const body = new THREE.Mesh(
  new RoundedBoxGeometry(2.2, 4.4, 0.24, 6, 0.28),
  new THREE.MeshStandardMaterial({ color: 0x111827, metalness: 0.6, roughness: 0.35 }),
);
phone.add(body);
const screenCanvas = document.createElement("canvas");
screenCanvas.width = 520; screenCanvas.height = 1060;
const screenTex = new THREE.CanvasTexture(screenCanvas);
screenTex.colorSpace = THREE.SRGBColorSpace;
screenTex.anisotropy = 8;
const screen = new THREE.Mesh(new THREE.PlaneGeometry(2.0, 4.08), new THREE.MeshBasicMaterial({ map: screenTex, toneMapped: false }));
screen.position.z = 0.125;
phone.add(screen);
scene.add(phone);

// glow ring behind phone
const ring = new THREE.Mesh(
  new THREE.TorusGeometry(2.9, 0.025, 16, 160),
  new THREE.MeshBasicMaterial({ color: MARIGOLD, transparent: true, opacity: 0 }),
);
ring.position.z = -0.6;
scene.add(ring);
const ring2 = new THREE.Mesh(
  new THREE.TorusGeometry(3.6, 0.012, 16, 160),
  new THREE.MeshBasicMaterial({ color: 0x9fb4ff, transparent: true, opacity: 0 }),
);
ring2.position.z = -0.8;
scene.add(ring2);

const ROWS = HI
  ? [["स्वास्थ्य बीमा", "₹5,00,000 तक"], ["किसान सहायता", "₹6,000 / साल"], ["वृद्धावस्था पेंशन", "हर महीने"], ["छात्रवृत्ति", "फीस + भत्ता"]]
  : [["Health cover", "up to ₹5,00,000"], ["Farmer support", "₹6,000 / year"], ["Old-age pension", "every month"], ["Scholarship", "fees + allowance"]];

function rr(g, x, y, w, h, r) {
  g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r);
  g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath();
}

function drawScreen(t) {
  const g = screenCanvas.getContext("2d");
  const Wc = 520, Hc = 1060;
  g.fillStyle = "#f7f6f2"; g.fillRect(0, 0, Wc, Hc);
  // top bar
  g.fillStyle = "#0f1e42"; g.fillRect(0, 0, Wc, 150);
  g.fillStyle = "#f2b544"; rr(g, 34, 52, 56, 56, 14); g.fill();
  g.strokeStyle = "#0f1e42"; g.lineWidth = 7; g.lineCap = "round"; g.lineJoin = "round";
  g.beginPath(); g.moveTo(48, 81); g.lineTo(58, 92); g.lineTo(78, 68); g.stroke();
  g.fillStyle = "#fff"; g.font = `800 34px 'Jakarta'`; g.fillText("HaqSaathi", 108, 92);

  // scanning phase (before results)
  const scan = prog(t, 4.2, 6.2);
  const found = prog(t, 6.2, 6.6);
  g.fillStyle = "#0f172a"; g.font = `800 38px ${FONT}`;
  if (found < 1) {
    g.globalAlpha = 1 - found;
    g.fillText(HI ? "आपकी योजनाएं ढूंढ रहे हैं…" : "Finding your schemes…", 34, 230);
    g.fillStyle = "#dce5f3"; rr(g, 34, 262, 452, 16, 8); g.fill();
    g.fillStyle = "#2a4a94"; rr(g, 34, 262, Math.max(16, 452 * scan), 16, 8); g.fill();
    g.globalAlpha = 1;
  }
  if (found > 0) {
    g.globalAlpha = found;
    g.fillStyle = "#0f172a";
    g.fillText(HI ? "आप 4 योजनाओं के पात्र हैं" : "You qualify for 4 schemes", 34, 230);
    g.fillStyle = "#64748b"; g.font = `500 26px ${FONT}`;
    g.fillText(HI ? "आपके जवाबों के आधार पर" : "Based on your answers", 34, 272);
    g.globalAlpha = 1;
  }
  // rows
  ROWS.forEach(([name, amt], i) => {
    const a = easeOut(prog(t, 6.5 + i * 0.45, 7.1 + i * 0.45));
    if (a <= 0) return;
    const y = 320 + i * 150 + (1 - a) * 40;
    g.globalAlpha = a;
    g.fillStyle = "#ffffff"; rr(g, 26, y, 468, 128, 22); g.fill();
    g.strokeStyle = "#e2e8f0"; g.lineWidth = 2; rr(g, 26, y, 468, 128, 22); g.stroke();
    g.fillStyle = "#dcfce7"; g.beginPath(); g.arc(88, y + 64, 32, 0, Math.PI * 2); g.fill();
    g.strokeStyle = "#16a34a"; g.lineWidth = 7;
    g.beginPath(); g.moveTo(74, y + 64); g.lineTo(84, y + 75); g.lineTo(103, y + 52); g.stroke();
    g.fillStyle = "#0f172a"; g.font = `700 32px ${FONT}`; g.fillText(name, 140, y + 56);
    g.fillStyle = "#1e3a7b"; g.font = `700 27px ${FONT}`; g.fillText(amt, 140, y + 98);
    g.globalAlpha = 1;
  });
  // button
  const b = prog(t, 8.4, 8.9);
  if (b > 0) {
    g.globalAlpha = b;
    g.fillStyle = "#f2b544"; rr(g, 26, 940, 468, 86, 22); g.fill();
    g.fillStyle = "#0f1e42"; g.font = `800 32px ${FONT}`;
    const label = HI ? "आवेदन कैसे करें →" : "How to apply →";
    g.fillText(label, 260 - g.measureText(label).width / 2, 994);
    g.globalAlpha = 1;
  }
  screenTex.needsUpdate = true;
}

// ---------- captions (DOM) ----------
const CAPS = HI
  ? [
      [0.3, 3.4, "करोड़ों भारतीय", "अपने हक़ की सरकारी मदद से चूक जाते हैं।"],
      [3.7, 6.3, "उलझे नियम, ढेर सारे कागज़।", "हक़साथी सब आसान कर देता है।"],
      [6.6, 9.4, "8 आसान सवालों के जवाब दें।", "देखें आप किन योजनाओं के पात्र हैं।"],
    ]
  : [
      [0.3, 3.4, "Crores of Indians miss", "government benefits they deserve."],
      [3.7, 6.3, "Confusing rules. Piles of paper.", "HaqSaathi makes it simple."],
      [6.6, 9.4, "Answer 8 simple questions.", "See every scheme you qualify for."],
    ];
const capEl = document.getElementById("cap");
const endEl = document.getElementById("end");
document.getElementById("end-tag").textContent = HI ? "आपका हक़, अब आसान।" : "Your rights. Made simple.";
document.getElementById("end-sub").textContent = HI ? "मुफ़्त · हिंदी और English · कोई बिचौलिया नहीं" : "Free · Hindi & English · No middlemen";
document.body.style.fontFamily = FONT;

function captions(t) {
  let html = "", op = 0;
  for (const [a, b, l1, l2] of CAPS) {
    if (t >= a && t <= b) {
      op = Math.min(prog(t, a, a + 0.45), 1 - prog(t, b - 0.4, b));
      html = `<span class="l1">${l1}</span><span class="l2">${l2}</span>`;
    }
  }
  capEl.innerHTML = html;
  capEl.style.opacity = op;
  capEl.style.transform = `translateY(calc(-50% + ${(1 - op) * 14}px))`;
  const e = easeOut(prog(t, 9.7, 10.6));
  endEl.style.opacity = e;
  endEl.style.transform = `scale(${0.94 + 0.06 * e})`;
}

// ---------- timeline ----------
const PHONE_TARGET = new THREE.Vector3(0, 0, 0);
const PX = 2.5;
window.renderAt = function (t) {
  // camera: slow cinematic drift
  const cz = lerp(12.5, 8.4, ease(prog(t, 0, 6))) + ease(prog(t, 9.3, 12)) * 3;
  camera.position.set(Math.sin(t * 0.22) * 1.2, 0.4 + Math.cos(t * 0.17) * 0.3, cz);
  camera.lookAt(0.6, 0, 0);

  particles.rotation.y = t * 0.02;
  particles.position.y = Math.sin(t * 0.3) * 0.2;

  // phone appears 2.6–4.2, faces camera by ~6, recedes after 9.3
  const appear = ease(prog(t, 2.6, 4.2));
  const recede = ease(prog(t, 9.3, 11));
  const s = appear * (1 - recede) * 1.12;
  phone.scale.setScalar(Math.max(0.0001, s));
  phone.position.set(PX * (1 - recede), lerp(-0.6, 0, appear) + recede * 0.4, -recede * 3);
  PHONE_TARGET.copy(phone.position);
  phone.rotation.y = lerp(-1.6, 0, ease(prog(t, 2.6, 6))) + Math.sin(t * 0.8) * 0.08 * (1 - prog(t, 6, 7)) + Math.sin(t * 0.6) * 0.06;
  phone.rotation.x = lerp(0.5, 0.06, ease(prog(t, 2.6, 5.5)));
  phone.rotation.z = lerp(-0.25, 0, ease(prog(t, 2.6, 5)));
  body.material.opacity = 1;
  drawScreen(t);

  warm.intensity = 40 * appear * (1 - recede * 0.6);
  ring.material.opacity = 0.85 * ease(prog(t, 4.5, 6)) * (1 - recede);
  ring.rotation.z = t * 0.3;
  ring.scale.setScalar(0.85 + 0.15 * ease(prog(t, 4.5, 6)));
  ring2.material.opacity = 0.35 * ease(prog(t, 5, 6.5)) * (1 - recede);
  ring2.rotation.z = -t * 0.18;
  ring.position.y = ring2.position.y = phone.position.y;
  ring.position.x = ring2.position.x = phone.position.x;

  // documents: chaos → sucked into the phone
  for (const d of docs) {
    const u = d.userData;
    const fly = ease(prog(t, 3.4 + u.delay, 5.0 + u.delay));
    const chaos = new THREE.Vector3(
      u.p0.x + Math.sin(t * 0.7 + u.bob) * 0.35,
      u.p0.y + Math.sin(t * 0.9 + u.bob) * 0.45,
      u.p0.z + Math.cos(t * 0.5 + u.bob) * 0.3,
    );
    const intro = easeOut(prog(t, 0, 1.4 + u.delay * 0.4));
    chaos.multiplyScalar(lerp(1.6, 1, intro));
    d.position.copy(chaos.lerp(PHONE_TARGET, fly));
    d.rotation.set(u.rot.x + t * u.spin.x * (1 - fly), u.rot.y + t * u.spin.y * (1 - fly), u.rot.z + t * u.spin.z * (1 - fly));
    d.scale.setScalar(Math.max(0.0001, u.scale * (1 - fly) * intro));
    d.visible = fly < 0.999;
  }

  captions(t);
  renderer.render(scene, camera);
};

window.ready = document.fonts.ready.then(async () => {
  await Promise.all([
    document.fonts.load("800 30px Jakarta"),
    document.fonts.load("700 30px Jakarta"),
    document.fonts.load("500 30px Jakarta"),
    document.fonts.load("800 30px 'Noto Sans Devanagari'", "हक़"),
    document.fonts.load("700 30px 'Noto Sans Devanagari'", "हक़"),
    document.fonts.load("500 30px 'Noto Sans Devanagari'", "हक़"),
  ]);
  // redraw document textures now that fonts are loaded
  docs.forEach((d, i) => {
    d.material[4].map = docTexture(DOC_TITLES[i % DOC_TITLES.length], hues[i % hues.length]);
    d.material[4].needsUpdate = true;
  });
  window.renderAt(0);
  return true;
});
