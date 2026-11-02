/* Genera foto de perfil y portada para Facebook — Especialista en Adicciones UY */
const fs = require('fs');
const path = require('path');
const ROOT = __dirname;
const PAGES = path.join(ROOT, 'pages');
fs.mkdirSync(PAGES, { recursive: true });

const logo64 = fs.readFileSync(path.join(ROOT, '..', 'img', 'logo-mark.png')).toString('base64');
const LOGO = `data:image/png;base64,${logo64}`;

const BRAIN_OUTLINE = 'M60,190 C55,150 75,110 110,95 C120,60 165,45 195,60 C215,35 265,35 285,60 C320,55 345,85 340,115 C365,130 370,170 350,195 C355,225 330,250 300,250 C285,275 245,285 220,270 C200,290 160,290 145,265 C110,270 80,245 82,215 C65,210 60,200 60,190 Z';
const BRAIN_FOLDS = [
  'M120,110 C150,100 170,115 175,140','M200,70 C195,100 210,120 235,118',
  'M280,75 C270,100 285,120 310,125','M110,170 C140,160 160,175 165,205',
  'M200,150 C230,140 250,160 245,190','M300,160 C285,180 295,205 315,205',
  'M150,220 C180,215 200,230 205,255'
];
function brain(sw) {
  return `<svg viewBox="0 0 400 340" aria-hidden="true">
    <path d="${BRAIN_OUTLINE}" fill="none" stroke="var(--gold)" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"/>
    ${BRAIN_FOLDS.map(d => `<path d="${d}" fill="none" stroke="var(--gold)" stroke-width="${sw*0.85}" stroke-linecap="round"/>`).join('')}
    <circle cx="200" cy="58" r="${sw*2.4}" fill="var(--gold)"/>
  </svg>`;
}

const HEAD = `<meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,500&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">`;
const VARS = `--bg:#0C1210;--gold:#C9A15A;--gold2:#E0BE7E;--ivory:#EDE8DC;--muted:#9FACA2;--green:#25D366;--fd:'Fraunces',Georgia,serif;--fb:'Inter',system-ui,sans-serif;`;

/* ---------- PERFIL 1080x1080 ---------- */
const profile = `<!doctype html><html lang="es"><head>${HEAD}<style>
:root{${VARS}}*{margin:0;box-sizing:border-box}
body{width:1080px;height:1080px;background:var(--bg);position:relative;overflow:hidden;-webkit-font-smoothing:antialiased}
.glow{position:absolute;inset:0;background:radial-gradient(640px 640px at 50% 42%,rgba(201,161,90,.18),transparent 62%)}
.ring{position:absolute;inset:70px;border:2px solid rgba(201,161,90,.28);border-radius:50%}
.b{position:absolute;inset:0;display:flex;align-items:center;justify-content:center}
.b svg{width:660px;filter:drop-shadow(0 0 40px rgba(201,161,90,.35))}
</style></head><body>
<div class="glow"></div><div class="ring"></div>
<div class="b">${brain(5)}</div>
</body></html>`;

/* ---------- PORTADA 1640x624 (zona segura central ~640px) ---------- */
const cover = `<!doctype html><html lang="es"><head>${HEAD}<style>
:root{${VARS}}*{margin:0;box-sizing:border-box}
body{width:1640px;height:624px;background:var(--bg);position:relative;overflow:hidden;color:var(--ivory);font-family:var(--fb);-webkit-font-smoothing:antialiased}
.glow{position:absolute;inset:0;background:
  radial-gradient(900px 560px at 50% 8%,rgba(201,161,90,.14),transparent 60%),
  radial-gradient(700px 500px at 92% 100%,rgba(111,160,143,.10),transparent 60%)}
.brainL{position:absolute;left:-60px;top:-40px;width:520px;opacity:.10}
.brainR{position:absolute;right:-70px;bottom:-120px;width:560px;opacity:.12;filter:drop-shadow(0 0 30px rgba(201,161,90,.15))}
.safe{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:720px;text-align:center;z-index:2;display:flex;flex-direction:column;align-items:center;gap:22px}
.mark{width:92px;height:92px;border-radius:50%;border:1px solid rgba(201,161,90,.4);background:#000;display:flex;align-items:center;justify-content:center}
.mark img{width:66px;height:66px;border-radius:50%;object-fit:cover}
.kick{font-size:20px;font-weight:600;letter-spacing:.28em;text-transform:uppercase;color:var(--gold)}
.title{font-family:var(--fd);font-weight:600;font-size:66px;line-height:1.02;letter-spacing:-.01em}
.title em{font-style:italic;font-weight:500;color:var(--gold2)}
.sub{font-size:23px;color:var(--muted);line-height:1.4;max-width:620px}
.row{display:flex;align-items:center;gap:26px;margin-top:4px;font-size:22px;font-weight:600}
.wa{display:inline-flex;align-items:center;gap:12px;background:var(--green);color:#06130A;padding:12px 24px;border-radius:999px}
.wa svg{width:26px;height:26px;fill:#06130A}
.web{color:var(--gold2)}
</style></head><body>
<div class="glow"></div>
<div class="brainL">${brain(4)}</div>
<div class="brainR">${brain(4)}</div>
<div class="safe">
  <div class="mark"><img src="${LOGO}" alt=""></div>
  <div class="kick">Psicología y Psiquiatría · Uruguay</div>
  <h1 class="title">Especialista en <em>Adicciones</em></h1>
  <p class="sub">Atención confidencial, presencial u online. Pedir ayuda es el primer paso.</p>
  <div class="row">
    <span class="wa"><svg viewBox="0 0 24 24"><path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.6.1-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.4-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5C10.2 9 9.7 7.8 9.5 7.3c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.3.3-1 1-1 2.4s1 2.8 1.1 3c.1.2 2 3 4.8 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.7-.7 1.9-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.6-.3z"/><path d="M12 2C6.5 2 2 6.5 2 12c0 1.9.5 3.6 1.5 5.2L2 22l4.9-1.4A9.9 9.9 0 0 0 12 22c5.5 0 10-4.5 10-10S17.5 2 12 2zm0 18c-1.6 0-3.1-.4-4.5-1.2l-.3-.2-3.2.9.9-3.1-.2-.3A8 8 0 1 1 20 12c0 4.4-3.6 8-8 8z"/></svg>099 134 136</span>
    <span class="web">especialistaenadicciones.uy</span>
  </div>
</div>
</body></html>`;

fs.writeFileSync(path.join(PAGES, 'fb-perfil.html'), profile, 'utf8');
fs.writeFileSync(path.join(PAGES, 'fb-portada.html'), cover, 'utf8');
console.log('OK fb-perfil (1080x1080), fb-portada (1640x624)');
