/* =========================================================
   Generador de piezas para Instagram — Especialista en Adicciones UY
   Crea un HTML por pieza (tamaño exacto) en social/pages/.
   Luego se renderizan a PNG con Chrome headless (ver README).
   ========================================================= */
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const PAGES = path.join(ROOT, 'pages');
fs.mkdirSync(PAGES, { recursive: true });

// Logo (cerebro) embebido en base64 para que el render no dependa de rutas
const logoPath = path.join(ROOT, '..', 'img', 'logo-mark.png');
const logo64 = fs.readFileSync(logoPath).toString('base64');
const LOGO = `data:image/png;base64,${logo64}`;

// Cerebro decorativo (line-art) reutilizado de la web
const BRAIN_OUTLINE = 'M60,190 C55,150 75,110 110,95 C120,60 165,45 195,60 C215,35 265,35 285,60 C320,55 345,85 340,115 C365,130 370,170 350,195 C355,225 330,250 300,250 C285,275 245,285 220,270 C200,290 160,290 145,265 C110,270 80,245 82,215 C65,210 60,200 60,190 Z';
const BRAIN_FOLDS = [
  'M120,110 C150,100 170,115 175,140',
  'M200,70 C195,100 210,120 235,118',
  'M280,75 C270,100 285,120 310,125',
  'M110,170 C140,160 160,175 165,205',
  'M200,150 C230,140 250,160 245,190',
  'M300,160 C285,180 295,205 315,205',
  'M150,220 C180,215 200,230 205,255'
];

function brainSvg(opacity) {
  return `<svg class="brainbg" viewBox="0 0 400 340" style="opacity:${opacity}" aria-hidden="true">
    <path d="${BRAIN_OUTLINE}" fill="none" stroke="var(--gold)" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
    ${BRAIN_FOLDS.map(d => `<path d="${d}" fill="none" stroke="var(--gold)" stroke-width="2" stroke-linecap="round"/>`).join('')}
    <circle cx="200" cy="58" r="6" fill="var(--gold)"/>
  </svg>`;
}

const waIcon = `<svg viewBox="0 0 24 24" class="wa-ic"><path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.6.1-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.4-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5C10.2 9 9.7 7.8 9.5 7.3c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.3.3-1 1-1 2.4s1 2.8 1.1 3c.1.2 2 3 4.8 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.7-.7 1.9-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.6-.3z"/><path d="M12 2C6.5 2 2 6.5 2 12c0 1.9.5 3.6 1.5 5.2L2 22l4.9-1.4A9.9 9.9 0 0 0 12 22c5.5 0 10-4.5 10-10S17.5 2 12 2zm0 18c-1.6 0-3.1-.4-4.5-1.2l-.3-.2-3.2.9.9-3.1-.2-.3A8 8 0 1 1 20 12c0 4.4-3.6 8-8 8z"/></svg>`;

function waPill(num) {
  return `<div class="wa">${waIcon}<span>${num}</span></div>`;
}

function footer(small) {
  return `<div class="foot">
    <img class="foot-logo" src="${LOGO}" alt="">
    <div class="foot-txt">
      <strong>@especialistaenadiccionesuy</strong>
      <span>especialistaenadicciones.uy</span>
    </div>
  </div>`;
}

function listBlock(items, check) {
  return `<ul class="list">${items.map(i => `<li>${check ? '<span class="chk">✓</span>' : '<span class="dot"></span>'}${i}</li>`).join('')}</ul>`;
}

/* ---------- Plantilla base ---------- */
function page(p) {
  const w = p.w, h = p.h;
  return `<!doctype html><html lang="es"><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,400;1,9..144,500&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
  :root{
    --bg:#0C1210; --bg2:#101916; --gold:#C9A15A; --gold2:#E0BE7E;
    --ivory:#EDE8DC; --muted:#9FACA2; --green:#25D366; --surface:#15211C;
    --fd:'Fraunces',Georgia,serif; --fb:'Inter',system-ui,sans-serif;
  }
  *{box-sizing:border-box;margin:0;padding:0}
  html,body{overflow:hidden}
  body{
    width:${w}px;height:${h}px;background:var(--bg);color:var(--ivory);
    font-family:var(--fb);-webkit-font-smoothing:antialiased;position:relative;
  }
  .glow{position:absolute;inset:0;pointer-events:none;
    background:
      radial-gradient(760px 560px at 82% 20%, rgba(201,161,90,.14), transparent 60%),
      radial-gradient(900px 640px at 6% 96%, rgba(111,160,143,.08), transparent 60%);}
  .frame{position:absolute;inset:40px;border:1px solid rgba(201,161,90,.22);border-radius:30px;pointer-events:none}
  .brainbg{position:absolute;right:-90px;top:-70px;width:${Math.round(w*0.95)}px;pointer-events:none;filter:drop-shadow(0 0 30px rgba(201,161,90,.15))}
  .wrap{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:space-between;
    padding:${Math.round(w*0.11)}px ${Math.round(w*0.095)}px;z-index:2}
  .top{display:flex;flex-direction:column;gap:${Math.round(w*0.05)}px}
  .kicker{font-size:${Math.round(w*0.026)}px;font-weight:600;letter-spacing:.22em;text-transform:uppercase;color:var(--gold);display:flex;align-items:center;gap:14px}
  .kicker::before{content:"";width:${Math.round(w*0.06)}px;height:2px;background:var(--gold)}
  .title{font-family:var(--fd);font-weight:600;line-height:1.04;letter-spacing:-.015em;font-size:${p.titleSize||Math.round(w*0.105)}px}
  .title em{font-style:italic;font-weight:500;color:var(--gold2)}
  .sub{font-size:${p.subSize||Math.round(w*0.036)}px;line-height:1.5;color:var(--muted);max-width:${Math.round(w*0.82)}px;font-weight:400}
  .list{display:flex;flex-direction:column;gap:${Math.round(w*0.028)}px;margin-top:6px}
  .list li{display:flex;align-items:center;gap:18px;font-size:${Math.round(w*0.04)}px;font-weight:500;color:var(--ivory)}
  .chk{display:inline-flex;align-items:center;justify-content:center;width:${Math.round(w*0.058)}px;height:${Math.round(w*0.058)}px;border:1.5px solid var(--gold);border-radius:50%;color:var(--gold);font-size:${Math.round(w*0.03)}px;flex:0 0 auto}
  .dot{width:10px;height:10px;border-radius:50%;background:var(--gold);flex:0 0 auto}
  .bottom{display:flex;flex-direction:column;gap:${Math.round(w*0.05)}px}
  .wa{display:inline-flex;align-items:center;gap:16px;align-self:flex-start;background:var(--green);color:#06130A;
    padding:${Math.round(w*0.028)}px ${Math.round(w*0.05)}px;border-radius:999px;font-weight:700;font-size:${Math.round(w*0.045)}px;
    box-shadow:0 18px 50px -18px rgba(37,211,102,.6)}
  .wa-ic{width:${Math.round(w*0.055)}px;height:${Math.round(w*0.055)}px;fill:#06130A}
  .foot{display:flex;align-items:center;gap:18px}
  .foot-logo{width:${Math.round(w*0.085)}px;height:${Math.round(w*0.085)}px;border-radius:50%;border:1px solid rgba(201,161,90,.4);object-fit:cover;background:#000}
  .foot-txt{display:flex;flex-direction:column;line-height:1.25}
  .foot-txt strong{font-size:${Math.round(w*0.03)}px;font-weight:600;color:var(--ivory)}
  .foot-txt span{font-size:${Math.round(w*0.026)}px;color:var(--gold)}
  .quote{font-family:var(--fd);font-weight:500;font-style:italic;line-height:1.12;letter-spacing:-.01em;font-size:${Math.round(w*0.095)}px}
  .quote .mark{display:block;font-size:${Math.round(w*0.2)}px;color:var(--gold);line-height:.6;margin-bottom:10px}
  .tags{display:flex;gap:12px;flex-wrap:wrap;margin-top:4px}
  .tag{font-size:${Math.round(w*0.026)}px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--gold2);border:1px solid rgba(201,161,90,.4);padding:8px 16px;border-radius:999px}
  .counter{position:absolute;top:60px;right:64px;font-size:26px;font-weight:600;letter-spacing:.12em;color:var(--gold);z-index:3}
  .swipe{position:absolute;bottom:58px;right:64px;font-size:24px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--gold2);display:flex;gap:12px;align-items:center;z-index:3}
  .swipe span{font-size:32px;line-height:1}
  .mr{display:flex;flex-direction:column;gap:${Math.round(w*0.04)}px;margin-top:10px}
  .myth{font-family:var(--fd);font-size:${Math.round(w*0.062)}px;font-weight:500;color:var(--muted);display:flex;gap:18px;align-items:baseline;line-height:1.08}
  .myth .x{color:#C8705E;font-family:var(--fb);font-weight:700;font-size:${Math.round(w*0.05)}px}
  .real{background:var(--surface);border:1px solid rgba(201,161,90,.3);border-radius:22px;padding:${Math.round(w*0.045)}px ${Math.round(w*0.05)}px;font-size:${Math.round(w*0.042)}px;line-height:1.38;color:var(--ivory);font-weight:400}
  .real .rl{display:block;font-size:${Math.round(w*0.026)}px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:var(--gold);margin-bottom:14px}
</style></head>
<body>
  <div class="glow"></div>
  ${p.brain ? brainSvg(p.brain) : ''}
  ${p.frame !== false ? '<div class="frame"></div>' : ''}
  ${p.counter ? `<div class="counter">${p.counter}</div>` : ''}
  ${p.swipe ? `<div class="swipe">Deslizá <span>→</span></div>` : ''}
  <div class="wrap">
    <div class="top">
      ${p.kicker ? `<div class="kicker">${p.kicker}</div>` : ''}
      ${p.variant === 'mr' ? `<div class="mr"><div class="myth"><span class="x">✕</span>${p.myth}</div><div class="real"><span class="rl">Realidad</span>${p.real}</div></div>` : ''}
      ${p.title ? `<h1 class="title">${p.title}</h1>` : ''}
      ${p.quote ? `<div class="quote"><span class="mark">“</span>${p.quote}</div>` : ''}
      ${p.list ? listBlock(p.list, p.check) : ''}
      ${p.tags ? `<div class="tags">${p.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>` : ''}
      ${p.sub ? `<p class="sub">${p.sub}</p>` : ''}
    </div>
    <div class="bottom">
      ${p.wa ? waPill(p.wa) : ''}
      ${p.subBottom ? `<p class="sub">${p.subBottom}</p>` : ''}
      ${footer()}
    </div>
  </div>
</body></html>`;
}

/* ===================== PIEZAS ===================== */
const F = { w: 1080, h: 1350 };   // feed 4:5
const S = { w: 1080, h: 1920 };   // story 9:16

const POSTS = [
  // ---- FEED ----
  { id:'01-marca', ...F, brain:.14,
    kicker:'Especialista en Adicciones · Uruguay',
    title:'La mente también<br><em>se recupera</em>',
    sub:'Psicología y psiquiatría especializada en adicciones. Atención confidencial, presencial u online, en todo Uruguay.' },

  { id:'02-estigma', ...F,
    kicker:'Sin juicios',
    title:'La adicción no es<br><em>falta de voluntad</em>',
    sub:'Es una condición de salud que se puede tratar. Pedir ayuda no es debilidad: es el primer acto de fuerza.' },

  { id:'03-senales', ...F, titleSize:74,
    kicker:'¿Cuándo preocuparse?',
    title:'Cuando el consumo deja<br>de ser <em>una elección</em>',
    list:['Necesitás más para sentir lo mismo','Lo escondés o lo minimizás','Quisiste parar y no pudiste','Afecta tu trabajo o tus vínculos'],
    subBottom:'Si algo de esto te resuena, hablemos. Estamos del otro lado.' },

  { id:'04-esperanza', ...F, brain:.12,
    kicker:'Recuperación',
    title:'Pedir ayuda no es<br>rendirse. <em>Es empezar.</em>',
    sub:'Cada proceso es distinto. El tuyo también puede empezar hoy, a tu ritmo y en un espacio seguro.' },

  { id:'05-servicios', ...F, titleSize:76,
    kicker:'Cómo acompañamos',
    title:'Un abordaje para<br><em>cada etapa</em>',
    list:['Psicología individual','Psicología familiar','Psicología para empresas','Psiquiatría online con receta'],
    check:true,
    tags:['Presencial u online','Psiquiatría solo online'] },

  { id:'06-familia', ...F,
    kicker:'No estás solo/a',
    title:'Cuando uno consume,<br><em>toda la familia</em> siente',
    sub:'La terapia familiar ayuda a reconstruir la comunicación, poner límites sanos y volver a cuidarse entre todos.' },

  { id:'07-psiquiatria', ...F,
    kicker:'Psiquiatría online',
    title:'Tu receta,<br><em>sin moverte de casa</em>',
    sub:'Consultas por videollamada y recetas digitales con los datos para presentar en tu mutualista o farmacia.' },

  { id:'08-creavida', ...F, brain:.12, titleSize:72,
    kicker:'Un escalón más de cuidado',
    title:'A veces, empezar de nuevo<br><em>necesita un lugar</em>',
    sub:'Cuando la terapia semanal no alcanza, acompañamos la internación en Creavida: un equipo que cuida cada paso del proceso.' },

  { id:'09-cta', ...F, titleSize:78,
    kicker:'Confidencial',
    title:'Tu primer mensaje<br><em>queda entre nosotros</em>',
    wa:'099 134 136',
    subBottom:'Escribinos por WhatsApp y coordinamos tu primera consulta.' },

  // ---- STORIES ----
  { id:'s1-reserva', ...S, brain:.12, titleSize:92,
    kicker:'Reservá tu consulta',
    title:'Dar el primer paso<br><em>también es parte</em>',
    wa:'099 134 136',
    subBottom:'Psicología y psiquiatría · Uruguay · especialistaenadicciones.uy' },

  { id:'s2-frase', ...S, frame:true,
    quote:'La recuperación es posible.<br>Y no tenés que<br>hacerla solo/a.' },

  { id:'s3-tip', ...S, brain:.1, titleSize:86,
    kicker:'Hoy',
    title:'No esperes a tocar fondo<br><em>para pedir ayuda</em>',
    wa:'099 134 136',
    subBottom:'Estamos del otro lado para escucharte.' },
];

/* ===================== TANDA 2 ===================== */
const BATCH2 = [
  // ---- CARRUSEL: Mitos ----
  { id:'10-c1', ...F, brain:.12, counter:'1 / 5', swipe:true, titleSize:92,
    kicker:'Deslizá para ver',
    title:'4 mitos sobre<br><em>las adicciones</em>',
    subBottom:'Desarmemos algunos juntos.' },
  { id:'10-c2', ...F, counter:'2 / 5', swipe:true, variant:'mr',
    kicker:'Mito 01',
    myth:'“Es cuestión de voluntad.”',
    real:'Es una condición de salud, con base neurológica. La voluntad ayuda, pero no alcanza sola: por eso existe el tratamiento.' },
  { id:'10-c3', ...F, counter:'3 / 5', swipe:true, variant:'mr',
    kicker:'Mito 02',
    myth:'“Solo el alcohol y las drogas.”',
    real:'También hay adicciones sin sustancia: juego y apuestas online, pantallas, compras. El patrón de pérdida de control es el mismo.' },
  { id:'10-c4', ...F, counter:'4 / 5', swipe:true, variant:'mr',
    kicker:'Mito 03',
    myth:'“Tiene que tocar fondo.”',
    real:'No hace falta esperar a perderlo todo. Cuanto antes se pide ayuda, más corto y simple suele ser el proceso.' },
  { id:'10-c5', ...F, counter:'5 / 5', variant:'mr',
    kicker:'Mito 04',
    myth:'“Si recae, fracasó.”',
    real:'La recaída puede ser parte del proceso, no el final. Se aprende de ella y se sigue adelante.',
    subBottom:'¿Hablamos? WhatsApp 099 134 136 · especialistaenadicciones.uy' },

  // ---- POSTS sueltos ----
  { id:'11-recaida', ...F,
    kicker:'Recuperación',
    title:'La recaída no borra<br><em>el progreso</em>',
    sub:'Recaer no es volver a cero. Es un tropiezo del proceso: se mira qué pasó, se ajusta el plan y se sigue. También te acompañamos en eso.' },

  { id:'12-comportamentales', ...F, titleSize:72,
    kicker:'No es solo sustancias',
    title:'Apostar, jugar, no soltar<br>la pantalla... <em>también</em>',
    sub:'El juego y las apuestas online, las pantallas o las compras pueden volverse adicción. Si sentís que perdiste el control, se puede trabajar.' },

  { id:'13-acompanar', ...F, titleSize:70,
    kicker:'Para quien acompaña',
    title:'¿Cómo ayudar a alguien<br>que <em>no pide ayuda</em>?',
    list:['Escuchá sin juzgar ni sermonear','Informate sobre lo que le pasa','Cuidá también tu propio límite','Buscá orientación profesional'],
    subBottom:'También podemos orientarte a vos. Escribinos al 099 134 136.' },

  { id:'14-empresas', ...F,
    kicker:'Psicología para empresas',
    title:'El consumo también<br><em>entra a la oficina</em>',
    sub:'Ausentismo, accidentes, clima tenso. Diseñamos programas de prevención y contención para equipos, adaptados a tu organización.' },

  { id:'15-integral', ...F,
    kicker:'Abordaje integral',
    title:'Psicología y psiquiatría,<br><em>mejor juntas</em>',
    sub:'Cuando hace falta, el trabajo terapéutico y el tratamiento médico se potencian. Un mismo equipo y un solo plan pensado para vos.' },

  { id:'16-confidencial', ...F, titleSize:80,
    kicker:'Preguntas frecuentes',
    title:'¿Es confidencial?<br><em>Sí, siempre.</em>',
    sub:'Todo lo que compartís está protegido por el secreto profesional. Tu historia no sale de la consulta.' },

  // ---- HISTORIAS ----
  { id:'s4-dato', ...S, brain:.1, titleSize:84,
    kicker:'¿Sabías que...?',
    title:'Pedir ayuda temprano<br><em>acorta el camino</em>',
    wa:'099 134 136',
    subBottom:'Cuanto antes, mejor. Estamos del otro lado.' },

  { id:'s5-acompanar', ...S, frame:true,
    quote:'No sabés qué decirle.<br>Empezá por<br>escuchar.' },

  { id:'s6-agenda', ...S, brain:.12, titleSize:88,
    kicker:'Agendá hoy',
    title:'Un horario para vos<br><em>esta semana</em>',
    wa:'099 134 136',
    subBottom:'Presencial u online · especialistaenadicciones.uy' },
];

/* ===================== TANDA 3 ===================== */
const BATCH3 = [
  // ---- EFEMÉRIDE: Día Mundial Sin Alcohol (15 nov) ----
  { id:'17-efemeride', ...F, brain:.12, titleSize:72,
    kicker:'15 de noviembre · Día Mundial Sin Alcohol',
    title:'Un día para<br><em>mirar el vínculo</em>',
    sub:'No se trata de culpa, sino de preguntarse con honestidad qué lugar ocupa el alcohol en tu vida. Si querés revisarlo, podemos acompañarte.' },

  // ---- PREGUNTAS FRECUENTES ----
  { id:'18-faq-online', ...F, titleSize:76,
    kicker:'Preguntas frecuentes',
    title:'¿La terapia online<br><em>sirve igual?</em>',
    sub:'Sí. La evidencia muestra resultados equivalentes a lo presencial. Elegís el formato que puedas sostener mejor; la psiquiatría es siempre online.' },

  { id:'19-faq-dejar', ...F, titleSize:72,
    kicker:'Preguntas frecuentes',
    title:'¿Tengo que dejar todo<br><em>de golpe?</em>',
    sub:'No necesariamente. Cada plan se arma a tu medida y a tu ritmo, con objetivos realistas. Lo importante es empezar; el cómo lo definimos juntos.' },

  { id:'20-faq-duracion', ...F, titleSize:74,
    kicker:'Preguntas frecuentes',
    title:'¿Cuánto dura<br><em>un tratamiento?</em>',
    sub:'No hay un número fijo: depende de vos, de tu historia y de tus objetivos. Lo revisamos juntos en cada etapa, sin apuros y sin presiones.' },

  // ---- VÍNCULO EMOCIONAL ----
  { id:'21-empezar', ...F, brain:.1,
    kicker:'El primer paso',
    title:'Al principio da miedo.<br><em>Después, alivio.</em>',
    sub:'Muchas personas llegan con vergüenza o con dudas. Del otro lado no hay juicio: hay un equipo que escucha y te ayuda a ordenar lo que sentís.' },

  // ---- INVITACIÓN A TESTIMONIOS (para completar con historias reales anónimas) ----
  { id:'22-tu-historia', ...F, titleSize:72,
    kicker:'Tu historia importa',
    title:'Contar lo que viviste<br><em>también ayuda a otro</em>',
    sub:'Si hiciste tu proceso con nosotros y querés compartir tu experiencia de forma anónima, escribinos. Tu voz puede ser el empujón de alguien más.' },

  // ---- CREAVIDA (escalar cuidado) ----
  { id:'23-creavida-equipo', ...F, brain:.12, titleSize:70,
    kicker:'Creavida · Internación',
    title:'Un lugar para cuidarte<br><em>las 24 horas</em>',
    sub:'Cuando hace falta frenar y empezar de nuevo, Creavida ofrece un entorno seguro y un equipo que acompaña cada día. No es el final: es un nuevo comienzo.' },

  // ---- HISTORIAS ----
  { id:'s7-efemeride', ...S, brain:.1, titleSize:82,
    kicker:'15 de noviembre',
    title:'Día Mundial<br><em>Sin Alcohol</em>',
    subBottom:'Un día para revisar el vínculo, sin culpa. · especialistaenadicciones.uy' },

  { id:'s8-faq', ...S, frame:true,
    quote:'¿Online o presencial?<br>El que puedas<br>sostener.' },

  { id:'s9-cierre', ...S, brain:.12, titleSize:86,
    kicker:'Cuando quieras',
    title:'El primer paso<br><em>lo das vos</em>',
    wa:'099 134 136',
    subBottom:'Te acompañamos el resto del camino. · Uruguay' },
];

let manifest = [];
for (const p of POSTS.concat(BATCH2).concat(BATCH3)) {
  const file = path.join(PAGES, `${p.id}.html`);
  fs.writeFileSync(file, page(p), 'utf8');
  manifest.push({ id: p.id, w: p.w, h: p.h });
}
fs.writeFileSync(path.join(ROOT, 'manifest.json'), JSON.stringify(manifest, null, 2));
console.log('Generadas', manifest.length, 'piezas');
manifest.forEach(m => console.log(` - ${m.id}  ${m.w}x${m.h}`));
