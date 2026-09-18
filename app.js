/* ──────────────────────────────────────────────────────────────────
   Wanaka · First run in Studio — the whole of Figma section 0917.

   01 Wana says hi → 02–04 a three-stop tour (chat, scene, Plan mode)
   → 05 the idea typed on the landing page drops into the composer and
   sends itself, Plan mode already on → 06 the crew drafts → the plan
   opens over everything (Overview, then Game assets) → Approve.

   The director bar at the bottom is for the demo only (add ?clean to
   hide it). Every beat can also be reached with ?step=1…8.
   ────────────────────────────────────────────────────────────────── */
(() => {
const $ = (id) => document.getElementById(id);
const E = (tag, cls, html) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (html != null) n.innerHTML = html;
  return n;
};
const Q = new URLSearchParams(location.search);
let FAST = false;                         // true while the director fast-forwards
const wait = (ms) => new Promise((r) => setTimeout(r, FAST ? 0 : ms));
let RUN = 0;                              // bumps on every jump so old timers stop

// ── the stage is the Figma frame, scaled to the window ─────────────
function fit() {
  const s = Math.min(innerWidth / 1920, innerHeight / 1080);
  $('stage').style.transform = `translate(-50%, -50%) scale(${s})`;
}
addEventListener('resize', fit);
fit();

// ── copy ───────────────────────────────────────────────────────────
const BRIEF = 'Build a toy house exploration game: A boy collecting puzzles in the room to unlock the secret of the toy house';
const CREW = ['planner', 'artist', 'developer', 'tester'];
const NAME = { planner: 'Planner', artist: 'Artist', developer: 'Developer', tester: 'Tester' };

// ── chat bits ──────────────────────────────────────────────────────
const thread = () => $('thread');
function push(node) {
  thread().appendChild(node);
  const t = thread();
  t.classList.toggle('is-full', t.scrollHeight > t.clientHeight);
  return node;
}
const userSay = (text) => push(E('div', 'msg msg--user',
  `<span class="bub">${text}</span><span class="acts"><i></i><i></i></span>`));
const crewSay = (k, text) => push(E('div', 'msg msg--crew',
  `<span class="av"><img src="assets/crew-${k}.webp" alt=""></span>
   <span class="txt"><b>${NAME[k]} Wana</b><p>${text}</p></span>`));
function steps(list) {
  const box = E('div', 'msg');
  box.style.cssText = 'display:flex;flex-direction:column;gap:12px';
  box.innerHTML = list.map(([k, t]) => `<div class="step step--${k}"><i></i>${t}</div>`).join('');
  return push(box);
}

function setPlan(on) {
  $('planTog').classList.toggle('is-on', on);
  $('model').textContent = on ? 'Wanaka 1.0 · Plan' : 'Wanaka 1.0 Lite';
}

// ── the tour ───────────────────────────────────────────────────────
const tour = $('tour');
function stageRect(el) {
  const s = $('stage').getBoundingClientRect();
  const k = s.width / 1920;
  const r = el.getBoundingClientRect();
  return { x: (r.left - s.left) / k, y: (r.top - s.top) / k, w: r.width / k, h: r.height / k };
}
// the scrim is one path with holes cut in it, so two areas can light at once
function scrim(holes) {
  const rr = ([x, y, w, h, r]) =>
    `M${x + r} ${y}h${w - 2 * r}a${r} ${r} 0 0 1 ${r} ${r}v${h - 2 * r}a${r} ${r} 0 0 1 -${r} ${r}h-${w - 2 * r}a${r} ${r} 0 0 1 -${r} -${r}v-${h - 2 * r}a${r} ${r} 0 0 1 ${r} -${r}z`;
  const d = `M0 0H1920V1080H0Z ${holes.map(rr).join(' ')}`;
  return `<svg class="scrim" viewBox="0 0 1920 1080"><path d="${d}" fill="rgba(8,5,5,.68)" fill-rule="evenodd"/></svg>
    ${holes.map(([x, y, w, h, r]) =>
      `<i class="ring" style="left:${x - 3}px;top:${y - 3}px;width:${w + 6}px;height:${h + 6}px;border-radius:${r + 3}px"></i>`).join('')}`;
}
function coach({ place, title, body, step, skip = 'Skip', next = 'Next', lime = false }) {
  const tip = '<i class="cm__tip"></i>';
  const card = `<div class="cm__card">
      <b>${title}</b><p>${body}</p>
      <div class="cm__foot">
        <span class="cm__step">${step || ''}</span>
        ${skip ? `<button class="cm__skip" data-a="skip">${skip}</button>` : ''}
        <button class="cm__next${lime ? ' cm__next--lime' : ''}" data-a="next">${next}</button>
      </div></div>`;
  const before = place === 'left' || place === 'top';
  return E('div', `cm cm--${place}`, before ? tip + card : card + tip);
}
function tourStep(n) {
  return new Promise((done) => {
    tour.hidden = false;
    tour.innerHTML = '';
    let c;
    if (n === 1) {
      tour.innerHTML = scrim([]) + '<img class="wana" src="assets/crew-planner.webp" alt="">';
      c = coach({ place: 'left', title: 'Hi, I’m Wana! 👋',
        body: 'Welcome to Wanaka Studio — I’m here to build your game with you. Want a quick look around first? It takes 20 seconds.',
        skip: 'Skip tour', next: 'Let’s go' });
      tour.appendChild(c);
      c.style.left = '836px'; c.style.top = `${540 - c.offsetHeight / 2}px`;
    } else if (n === 2) {
      tour.innerHTML = scrim([[1524, 48, 392, 1028, 12]]);
      c = coach({ place: 'right', title: 'Chat with your AI game builder',
        body: 'Tell me what to make or change, in plain words — I’ll build it. You can also generate any asset right here: characters, props, music and more.',
        step: '1 / 3' });
      tour.appendChild(c);
      c.style.left = `${1524 - 24 - c.offsetWidth}px`; c.style.top = `${540 - c.offsetHeight / 2}px`;
    } else if (n === 3) {
      tour.innerHTML = scrim([[4, 48, 1512, 1024, 12], [490, 5, 190, 34, 8]]);
      c = coach({ place: 'top', title: 'Build your world, precisely',
        body: 'This is your scene. Add or delete models, then move, rotate and scale anything freely — down to the last detail.',
        step: '2 / 3' });
      tour.appendChild(c);
      c.style.left = `${585 - c.offsetWidth / 2}px`; c.style.top = '44px';
    } else if (n === 4) {
      setPlan(true);
      const r = stageRect($('planTog'));
      tour.innerHTML = scrim([[r.x - 6, r.y - 6, r.w + 12, r.h + 12, 20]]);
      c = coach({ place: 'bottom', title: 'Last one! Turn on Plan mode',
        body: 'A whole game team — Planner, Artist, Developer and Tester — takes your idea from game design to a finished game, step by step.',
        step: '3 / 3', skip: '', next: 'Start!', lime: true });
      tour.appendChild(c);
      c.style.left = `${Math.min(1920 - 16 - c.offsetWidth, r.x + r.w / 2 - c.offsetWidth / 2)}px`;
      c.style.top = `${r.y - 20 - c.offsetHeight}px`;
    }
    c.querySelectorAll('[data-a]').forEach((b) => {
      b.onclick = () => done(b.dataset.a);
    });
  });
}
const endTour = () => { tour.hidden = true; tour.innerHTML = ''; };

// ── 05 · the landing-page idea sends itself, Plan already on ───────
async function sendBrief(run) {
  setPlan(true);
  $('chatName').textContent = 'Toy house explorer';
  push(E('div', 'divider msg', '<i></i>Plan mode on · your game team is in'));
  const tip = E('div', 'hometip', '↩︎ Your idea from the homepage — sending…');
  document.querySelector('.dock').appendChild(tip);
  const box = $('input');
  $('composer').classList.add('is-lit');
  $('send').classList.add('is-live');
  if (FAST) box.textContent = BRIEF;
  else for (let i = 0; i <= BRIEF.length; i += 3) {
    if (run !== RUN) return;
    box.textContent = BRIEF.slice(0, i);
    await wait(18);
  }
  box.textContent = BRIEF;
  await wait(700);
  if (run !== RUN) return;
  tip.remove();
  box.textContent = '';
  $('composer').classList.remove('is-lit');
  $('send').classList.remove('is-live');
  $('send').classList.add('is-stop');
  userSay(BRIEF);
}

// ── 06 · the crew drafts, then hands you the plan ──────────────────
async function draft(run) {
  await wait(600);
  crewSay('planner', 'A toy house with a secret — love it. I’ve called in the team; we’ll draft the whole plan for you to check before anything gets built.');
  const crew = push(E('div', 'crewrow msg', CREW.map((k) =>
    `<span data-k="${k}"><img src="assets/crew-${k}.webp" alt="">${NAME[k]}</span>`).join('')));
  const list = steps([['busy', 'Read your idea'], ['todo', 'Shaping the core loop'], ['todo', 'Choosing a look'], ['todo', 'Sizing the build']]);
  const rows = [...list.querySelectorAll('.step')];
  const who = ['planner', 'planner', 'artist', 'developer'];
  for (let i = 0; i < rows.length; i++) {
    if (run !== RUN) return;
    crew.querySelectorAll('span').forEach((s) => s.classList.toggle('is-on', s.dataset.k === who[i]));
    rows[i].className = 'step step--busy';
    await wait(900);
    rows[i].className = 'step step--done';
  }
  crew.querySelectorAll('span').forEach((s) => s.classList.remove('is-on'));
  await wait(400);
  if (run !== RUN) return;
  crewSay('planner', 'Here it is. Every card is yours to change, and nothing gets built until you approve it.');
  const card = push(E('div', 'plancard msg', `
    <img src="assets/boy.jpg" alt="">
    <span><em>PLAN V1.0</em><b>Tiny Explorer: The Giant Bedroom</b>
      <small>A toy-sized kid crosses a bedroom the size of a country to reach the hoop on the far shelf.</small>
      <button>Open full plan ↗</button></span>`));
  card.querySelector('button').onclick = () => openPlan();
  $('send').classList.remove('is-stop');
}

// ── the full-cover plan ────────────────────────────────────────────
const GENRES = [
  ['Adventure', '<path d="M3 18l5-11 5 8 3-5 5 8z"/>'],
  ['Platformer', '<path d="M3 19h5v-5h5v-5h5V5h3"/>'],
  ['Puzzle', '<path d="M5 9h3.5a2 2 0 1 1 4 0H16v3.5a2 2 0 1 0 0 4V20H5z"/>'],
  ['Collectathon', '<path d="M12 4l2.4 5 5.4.6-4 3.7 1.1 5.4L12 16l-4.9 2.7 1.1-5.4-4-3.7 5.4-.6z"/>'],
  ['Racing', '<path d="M5 21V4m0 1h12l-2 4 2 4H5"/>'],
  ['Action', '<path d="M13 3L5 13h6l-1 8 8-10h-6z"/>'],
];
const gicon = (d) => `<svg class="gicon" viewBox="0 0 24 24">${d}</svg>`;
const STYLES = [['default', 'Default'], ['realistic', 'Realistic'], ['toon', 'Stylized Toon'], ['graphic-ink', 'Graphic Ink'],
  ['ink-wash', 'Ink Wash'], ['pixel', 'Pixel Screen'], ['crosshatch', 'Crosshatch'], ['one-bit', 'One-Bit'],
  ['phosphor', 'Phosphor'], ['retro-warm', 'Retro Warm'], ['horror', 'Horror']];
const SCOPES = [
  ['Slice', 'One room, one puzzle — a demo that proves the feel.', '1 room · 3 assets', '180–260 credits · ~6 min',
    '<rect x="2.5" y="5.5" width="6" height="7" rx="1.4"/>'],
  ['Standard', 'The whole course, from the first step to the goal.', '4 rooms · 6 assets', '320–560 credits · ~12 min',
    '<rect x="1.5" y="5.5" width="5" height="7" rx="1.4"/><rect x="7.5" y="5.5" width="5" height="7" rx="1.4"/><rect x="13.5" y="5.5" width="3" height="7" rx="1.4"/>'],
  ['Ambitious', 'Extra rooms, optional paths, and a polish pass.', '7 rooms · 11 assets', '640–980 credits · ~25 min',
    '<rect x="1.5" y="7.5" width="4" height="5" rx="1.2"/><rect x="6.5" y="4.5" width="4" height="8" rx="1.2"/><rect x="11.5" y="6" width="4" height="6.5" rx="1.2"/><path d="M13.2 1l.7 1.6 1.7.2-1.3 1.2.4 1.7-1.5-.9-1.5.9.4-1.7-1.3-1.2 1.7-.2z"/>'],
];
const ARROW = '<svg class="arr" viewBox="0 0 16 16"><path d="m4 6 4 4 4-4"/></svg>';
const seg = (list, on) => `<div class="seg">${list.map((t, i) =>
  `<button class="${i === on ? 'is-on' : ''}">${t}</button>`).join('')}</div>`;

let planStep = 0;
let scope = 1;

function openPlan(step = 0) {
  const host = $('planx');
  host.hidden = false;
  host.innerHTML = `
    <div class="px">
      <header class="px__h">
        <span class="px__brand"><img src="assets/crew-planner.webp" alt="">Plan Studio</span>
        <span class="px__steps">
          <button class="tabb is-on" data-s="0">1 · Overview</button><i></i>
          <button class="tabb" data-s="1">2 · Game assets</button>
        </span>
        <button class="px__x" id="pxX">✕</button>
      </header>
      <div class="px__body" id="pxBody"></div>
      <footer class="px__foot">
        <span class="px__sum" id="pxSum"></span>
        <button class="btn btn--sec" id="pxClose">Close</button>
        <button class="btn btn--go" id="pxGo"></button>
      </footer>
    </div>`;
  host.querySelectorAll('.tabb').forEach((b) => { b.onclick = () => goPlan(+b.dataset.s); });
  $('pxX').onclick = $('pxClose').onclick = closePlan;
  $('pxGo').onclick = () => (planStep === 0 ? goPlan(1) : approve());
  goPlan(step);
}
function closePlan() { $('planx').hidden = true; $('planx').innerHTML = ''; }

function goPlan(n) {
  planStep = n;
  document.querySelectorAll('.tabb').forEach((b) => b.classList.toggle('is-on', +b.dataset.s === n));
  $('pxBody').innerHTML = n === 0 ? overview() : assets();
  $('pxGo').innerHTML = n === 0 ? 'Next · game assets →' : 'Approve plan &amp; start build ↗';
  (n === 0 ? wireOverview : wireAssets)();
  paintSum();
}

function overview() {
  return `
    <div class="cover" id="cover"><img src="assets/boy.jpg" alt=""><button class="btn btn--sec">Retry cover</button></div>
    <div class="form">
      <div class="card">
        <span class="card__k">GAME INFORMATION</span>
        <div class="fld"><label>Game name</label><input class="inp" value="Tiny Explorer: The Giant Bedroom"></div>
        <div class="fld"><label>Genre</label>
          <button class="sel" id="genreSel">${gicon(GENRES[0][1])}<span>Adventure</span>${ARROW}</button>
          <div class="menu menu--genre" id="genreMenu">${GENRES.map(([n, d], i) =>
            `<button class="gopt${i === 0 ? ' is-on' : ''}" data-n="${n}">${gicon(d)}${n}</button>`).join('')}</div>
        </div>
        <div class="fld"><label>Core gameplay</label>
          <textarea class="inp">Cross a bedroom the size of a country — over the rug, up the blocks, past the truck — to the hoop on the far shelf.</textarea></div>
        <div class="fld"><label>Player experience</label>
          <textarea class="inp">Small and brave, in a room that was built for someone much bigger.</textarea></div>
      </div>
      <div class="card">
        <span class="card__k">VISUAL STYLE</span>
        <div class="fld"><label>Style</label>
          <button class="sel" id="styleSel"><img src="assets/boy-sty-toon.jpg" alt=""><span>Stylized Toon</span>${ARROW}</button>
          <div class="menu menu--style" id="styleMenu">${STYLES.map(([k, n]) =>
            `<button class="stile${k === 'toon' ? ' is-on' : ''}" data-k="${k}" data-n="${n}"><img src="assets/boy-sty-${k}.jpg" alt="">${n}</button>`).join('')}</div>
        </div>
        <div class="fld"><label>Render quality</label>${seg(['Low', 'Medium', 'High', 'Ultra', 'Cinematic'], 2)}</div>
      </div>
      <div class="card">
        <span class="card__k">BUILD SCOPE</span>
        ${SCOPES.map(([n, d, m1, m2, ic], i) => `
          <button class="scope${i === scope ? ' is-on' : ''}" data-i="${i}">
            <span class="scope__t"><svg viewBox="0 0 18 18">${ic}</svg><span>${n}</span></span>
            <span class="scope__d">${d}</span>
            <span class="scope__m"><span>${m1}</span><span>${m2}</span></span>
          </button>`).join('')}
        <div class="fld"><label>Platform</label>
          <div class="plats"><button class="plat is-on"><i class="cb"></i>Web</button><button class="plat is-on"><i class="cb"></i>Mobile</button></div>
          <span class="hint" id="platHint">Built for web and mobile</span></div>
        <div class="fld"><label>Session length</label>${seg(['3–5 min', '8–12 min', '15–20 min'], 1)}
          <span class="hint">Room for mastery and an arc</span></div>
        <div class="fld"><label>Difficulty</label>${seg(['Gentle', 'Normal', 'Tough'], 1)}
          <span class="hint">Fair, with room to fail</span></div>
      </div>
    </div>`;
}

function wireOverview() {
  const menus = [['genreSel', 'genreMenu'], ['styleSel', 'styleMenu']];
  menus.forEach(([s, m]) => {
    $(s).onclick = () => {
      const open = !$(m).classList.contains('is-open');
      menus.forEach(([s2, m2]) => { $(m2).classList.remove('is-open'); $(s2).classList.remove('is-open'); });
      $(m).classList.toggle('is-open', open);
      $(s).classList.toggle('is-open', open);
    };
  });
  document.querySelectorAll('.gopt').forEach((b) => {
    b.onclick = () => {
      document.querySelectorAll('.gopt').forEach((o) => o.classList.toggle('is-on', o === b));
      const d = GENRES.find((g) => g[0] === b.dataset.n)[1];
      $('genreSel').innerHTML = `${gicon(d)}<span>${b.dataset.n}</span>${ARROW}`;
      $('genreMenu').classList.remove('is-open');
    };
  });
  document.querySelectorAll('.stile').forEach((b) => {
    b.onclick = () => {
      document.querySelectorAll('.stile').forEach((o) => o.classList.toggle('is-on', o === b));
      $('styleSel').innerHTML = `<img src="assets/boy-sty-${b.dataset.k}.jpg" alt=""><span>${b.dataset.n}</span>${ARROW}`;
      $('styleMenu').classList.remove('is-open');
      const img = document.querySelector('#cover img');
      img.style.opacity = 0;
      setTimeout(() => { img.src = `assets/boy-${b.dataset.k}.jpg`; img.style.opacity = 1; }, 180);
    };
  });
  document.querySelectorAll('.seg').forEach((g) => g.querySelectorAll('button').forEach((b) => {
    b.onclick = () => g.querySelectorAll('button').forEach((o) => o.classList.toggle('is-on', o === b));
  }));
  document.querySelectorAll('.scope').forEach((b) => {
    b.onclick = () => {
      scope = +b.dataset.i;
      document.querySelectorAll('.scope').forEach((o) => o.classList.toggle('is-on', o === b));
      paintSum();
    };
  });
  // at least one platform stays on
  const plats = [...document.querySelectorAll('.plat')];
  plats.forEach((b) => {
    b.onclick = () => {
      if (b.classList.contains('is-on') && plats.filter((p) => p.classList.contains('is-on')).length === 1) return;
      b.classList.toggle('is-on');
      const on = plats.filter((p) => p.classList.contains('is-on')).map((p) => p.textContent.trim());
      $('platHint').textContent = on.length === 2 ? 'Built for web and mobile' : `Built for ${on[0].toLowerCase()}`;
    };
  });
}

// ── game assets ────────────────────────────────────────────────────
const P = ['toy-blocks', 'book-stacks', 'dresser', 'basketball', 'truck', 'teddy',
  'stars', 'baseballs', 'pencils', 'backpacker', 'robot-pal', 'dino-suit'];
const img = (k) => `assets/boy-part-${k}.jpg`;
// four the Artist puts forward, the rest of the shelf to browse, and a few only search finds
const SLOTS = [
  { k: 'bedroom', name: 'The bedroom', note: 'Floor, shelves, and how the room is laid out',
    picks: [['Toy blocks', 'toy-blocks'], ['Book stacks', 'book-stacks'], ['Dresser', 'dresser'], ['Play rug', 'pencils']],
    shelf: ['Bunk bed', 'Shelf wall', 'Toy chest', 'Play mat', 'Desk corner', 'Lamp post', 'Curtain set', 'Window seat',
      'Wardrobe', 'Step stool', 'Crate stack', 'Pillow fort'],
    deep: ['Wooden block set', 'Painted blocks', 'Block tower', 'Alphabet blocks', 'Block cart', 'Chunky blocks', 'Block city', 'Block crate'],
    chosen: ['Toy blocks', 'Book stacks'] },
  { k: 'bigtoys', name: 'Big toys', note: 'The giant things he climbs past',
    picks: [['Basketball', 'basketball'], ['Truck', 'truck'], ['Teddy', 'teddy'], ['Robot pal', 'robot-pal']],
    shelf: ['Rocking horse', 'Spinning top', 'Toy train', 'Kite', 'Drum', 'Robot dog', 'Race car', 'Dollhouse',
      'Beach ball', 'Jack-in-the-box', 'Toy piano', 'Plush whale'],
    deep: ['Giant block', 'Bouncy ball', 'Toy crane', 'Fire truck', 'Stuffed bear', 'Wind-up duck', 'Toy rocket', 'Ball pit'],
    chosen: [] },
  { k: 'collect', name: 'To collect', note: 'The thing he is after',
    picks: [['Stars', 'stars'], ['Baseballs', 'baseballs'], ['Pencils', 'pencils'], ['Marbles', 'book-stacks']],
    shelf: ['Puzzle pieces', 'Coins', 'Stickers', 'Buttons', 'Keys', 'Gems', 'Bottle caps', 'Crayons',
      'Seashells', 'Paper cranes', 'Toy soldiers', 'Glow sticks'],
    deep: ['Gold stars', 'Star badges', 'Glitter stars', 'Star cookies', 'Tin stars', 'Paper stars', 'Star beads', 'Star cards'],
    chosen: [] },
  { k: 'kid', name: 'The kid', note: 'Who you play as',
    picks: [['Backpacker', 'backpacker'], ['Dino suit', 'dino-suit'], ['Robot pal', 'robot-pal'], ['Pyjama kid', 'teddy']],
    shelf: ['Scout', 'Astronaut', 'Pirate', 'Knight', 'Wizard', 'Detective', 'Chef', 'Explorer',
      'Skater', 'Ninja', 'Cowboy', 'Superhero'],
    deep: ['Tiny backpacker', 'Hiker kid', 'Camp kid', 'Map reader', 'Trail kid', 'Cap kid', 'Sneaker kid', 'Satchel kid'],
    chosen: [] },
];
const picked = {};
SLOTS.forEach((s) => { picked[s.k] = new Set(s.chosen); });
const lib = (s) => [...s.picks.map(([n, p]) => [n, p]), ...s.shelf.map((n, i) => [n, P[(i + 4) % 12]])];
const deep = (s) => s.deep.map((n, i) => [n, P[i % 12]]);

const acard = (n, p, note) => `
  <button class="acard" data-n="${n}">
    <span class="acard__art" style="background-image:url(${img(p)})"><i class="cb"></i></span>
    <span class="acard__lab"><b>${n}</b><em data-note="${note}">${note}</em></span>
  </button>`;
const later = (label = 'Generate later', note = 'The Artist makes it') => `
  <button class="acard acard--later">
    <span class="acard__art">✦</span>
    <span class="acard__lab"><b>${label}</b><em>${note}</em></span>
  </button>`;

function assets() {
  return `<div class="slots" id="slots">
    <header class="slots__h"><b>Game assets</b>
      <p>Optional. Pick as many as you like for each part — anything you leave alone, the Artist makes during the build.</p></header>
    ${SLOTS.map((s) => {
      const all = lib(s);
      return `
      <div class="slot" data-k="${s.k}">
        <div class="slot__h">
          <span><b>${s.name}</b><em>${s.note}</em></span>
          <i class="slot__state"></i>
          <button class="chip slot__seek"><svg viewBox="0 0 16 16" style="width:12px;height:12px"><circle cx="7" cy="7" r="4.5"/><path d="m10.5 10.5 3 3"/></svg>Search</button>
          <button class="chip slot__less" hidden>Show less ⌃</button>
          <span class="slot__open">Browse all ${all.length + s.deep.length} ⌄</span>
        </div>
        <div class="row5 row5--picks">${s.picks.map(([n, p]) => acard(n, p, 'Artist’s pick')).join('')}${later()}</div>
        <div class="row5 peek">${all.slice(4, 9).map(([n, p]) => acard(n, p, '')).join('')}</div>
        <button class="allbar">Browse all ${all.length + s.deep.length} models ›</button>
        <div class="lib">
          <div class="tools2">
            <label class="sbox"><svg viewBox="0 0 16 16"><circle cx="7" cy="7" r="4.5"/><path d="m10.5 10.5 3 3"/></svg>
              <input type="text" spellcheck="false" placeholder="Search the ${s.name.replace(/^The /, '').toLowerCase()} library — ${s.shelf.slice(0, 3).join(', ').toLowerCase()}…"></label>
            <button class="sx" title="Clear search">✕</button>
            <span class="for">Artist’s picks first</span>
            <span class="sort">Sorted by fit</span>
          </div>
          <div class="libgrid">
            ${all.map(([n, p], i) => acard(n, p, i < 4 ? 'Artist’s pick' : '')).join('')}
            ${deep(s).map(([n, p]) => acard(n, p, 'In the library').replace('class="acard"', 'class="acard" data-deep hidden')).join('')}
            ${later()}
          </div>
          <div class="none">
            <i>✦</i><b>Nothing in the library matches <span class="none__q"></span></b>
            <p>Clear the search to go back to the Artist’s picks, or let the Artist model it for this slot.</p>
            <span class="acts"><button class="btn btn--sec none__clear">Clear search</button>
              <button class="btn btn--go none__ask">✦ Have the Artist make it</button></span>
            <small class="none__kept"></small>
          </div>
          <span class="libnote"></span>
        </div>
      </div>`;
    }).join('')}
  </div>`;
}

function wireAssets() {
  const page = $('slots');
  document.querySelectorAll('.slot').forEach((slot) => {
    const s = SLOTS.find((x) => x.k === slot.dataset.k);
    const set = picked[s.k];
    const box = slot.querySelector('.sbox input');
    const grid = slot.querySelector('.libgrid');
    const total = lib(s).length + s.deep.length;

    const paint = () => {
      slot.querySelectorAll('.acard[data-n]').forEach((b) => {
        const on = set.has(b.dataset.n);
        b.classList.toggle('is-on', on);
        const em = b.querySelector('em');
        em.textContent = on ? 'Picked' : em.dataset.note;
      });
      slot.querySelectorAll('.acard--later').forEach((b) => b.classList.toggle('is-on', set.size === 0));
      const st = slot.querySelector('.slot__state');
      const n = set.size;
      st.classList.toggle('is-lib', n > 0);
      if (slot.classList.contains('is-open')) {
        const q = box.value.trim();
        const shown = [...grid.querySelectorAll('.acard[data-n]')].filter((b) => !b.hidden).length;
        st.textContent = q ? `${shown || 'No'} match${shown === 1 ? '' : 'es'}${n ? ` · ${n} picked` : ''}`
          : `${lib(s).length} of ${total} models${n ? ` · ${n} picked` : ''}`;
        st.classList.remove('is-lib');
      } else {
        st.textContent = n === 0 ? (page.classList.contains('has-open') ? 'Left to the Artist' : 'The Artist will make it')
          : n === 1 ? '1 model from the library' : `${n} models from the library`;
      }
      paintSum();
    };
    slot.__paint = paint;

    slot.querySelectorAll('.acard[data-n]').forEach((b) => {
      b.onclick = () => { if (set.has(b.dataset.n)) set.delete(b.dataset.n); else set.add(b.dataset.n); paint(); };
    });
    // "later" is an answer of its own: it clears the slot's picks
    slot.querySelectorAll('.acard--later').forEach((b) => { b.onclick = () => { set.clear(); paint(); }; });

    // hovering the block pulls out a second row and a search
    slot.onmouseenter = () => { if (!page.classList.contains('has-open')) slot.classList.add('is-hot'); };
    slot.onmouseleave = () => slot.classList.remove('is-hot');

    const clear = () => {
      box.value = '';
      slot.classList.remove('is-search', 'is-empty');
      grid.querySelectorAll('.acard[data-n]').forEach((b) => { b.hidden = b.hasAttribute('data-deep'); });
      slot.querySelector('.for').textContent = 'Artist’s picks first';
      slot.querySelector('.sort').textContent = 'Sorted by fit';
      slot.querySelector('.libnote').textContent = 'Scroll for the rest of the library · Esc clears the search, Esc again closes the slot';
      paint();
    };
    const open = (on) => {
      if (on) document.querySelectorAll('.slot.is-open').forEach((o) => { if (o !== slot) o.__open(false); });
      slot.classList.toggle('is-open', on);
      slot.classList.remove('is-hot');
      slot.querySelector('.slot__less').hidden = !on;
      page.classList.toggle('has-open', !!document.querySelector('.slot.is-open'));
      clear();
      document.querySelectorAll('.slot').forEach((o) => o.__paint && o.__paint());
      if (on) { box.focus(); slot.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }
    };
    slot.__open = open;
    const search = () => {
      const q = box.value.trim().toLowerCase();
      slot.classList.toggle('is-search', !!q);
      let hits = 0;
      grid.querySelectorAll('.acard[data-n]').forEach((b) => {
        const hit = q ? b.dataset.n.toLowerCase().includes(q) : !b.hasAttribute('data-deep');
        b.hidden = !hit;
        if (hit) hits++;
      });
      slot.classList.toggle('is-empty', !!q && hits === 0);
      slot.querySelector('.for').textContent = q ? `for “${box.value.trim()}”` : 'Artist’s picks first';
      slot.querySelector('.sort').textContent = q ? 'Sorted by match' : 'Sorted by fit';
      slot.querySelector('.none__q').textContent = `“${box.value.trim()}”`;
      slot.querySelector('.none__kept').textContent = set.size
        ? `Your ${set.size} pick${set.size === 1 ? ' stays' : 's stay'} in this slot` : '';
      slot.querySelector('.libnote').textContent = q
        ? (hits ? 'Scroll for the rest of the matches' : 'Esc clears the search · Esc again closes the slot')
        : 'Scroll for the rest of the library · Esc clears the search, Esc again closes the slot';
      paint();
    };

    slot.querySelector('.allbar').onclick = () => open(true);
    slot.querySelector('.slot__seek').onclick = () => open(true);
    slot.querySelector('.slot__less').onclick = () => open(false);
    // a folded slot opens when you click its line
    slot.querySelector('.slot__h').addEventListener('click', (e) => {
      if (page.classList.contains('has-open') && !slot.classList.contains('is-open') && !e.target.closest('button')) open(true);
    });
    box.oninput = search;
    box.onkeydown = (e) => {
      if (e.key !== 'Escape') return;
      e.stopPropagation();
      if (box.value) clear(); else open(false);
    };
    slot.querySelector('.sx').onclick = () => { clear(); box.focus(); };
    slot.querySelector('.none__clear').onclick = () => { clear(); box.focus(); };
    // a search that finds nothing is the moment to hand the slot over
    slot.querySelector('.none__ask').onclick = () => { set.clear(); open(false); };
    paint();
  });
}

function paintSum() {
  const sc = SCOPES[scope];
  let mid = '';
  if (planStep === 1) {
    const lib = SLOTS.reduce((a, s) => a + picked[s.k].size, 0);
    const artist = SLOTS.filter((s) => picked[s.k].size === 0).length;
    mid = ` · <b>${lib} from the library</b>${artist ? `, ${artist} slot${artist === 1 ? '' : 's'} the Artist makes` : ''}`;
  }
  const sum = $('pxSum');
  if (sum) sum.innerHTML = `<b>${sc[2]}</b> · 5 Wanas on it${mid} · <b>${sc[3].split(' · ')[0]}</b> · playable in ${sc[3].split(' · ')[1]}`;
}

function approve() {
  closePlan();
  userSay('Approved — build it');
  setTimeout(() => {
    crewSay('planner', 'Building now. I will only interrupt you if someone genuinely needs a call.');
    $('send').classList.add('is-stop');
  }, FAST ? 0 : 500);
}

// ── the run ────────────────────────────────────────────────────────
function reset() {
  RUN++;
  endTour();
  closePlan();
  thread().innerHTML = '';
  thread().classList.remove('is-full');
  document.querySelectorAll('.hometip').forEach((t) => t.remove());
  $('input').textContent = '';
  $('composer').classList.remove('is-lit');
  $('send').className = 'send';
  $('chatName').textContent = 'New chat';
  setPlan(false);
  SLOTS.forEach((s) => { picked[s.k] = new Set(s.chosen); });
  scope = 1;
}

async function play(from = 1) {
  reset();
  const run = RUN;
  paintDirector(from);
  // 01–04 · the tour (skipping it jumps straight to the brief)
  for (let n = Math.max(1, from); n <= 4 && from <= 4; n++) {
    paintDirector(n);
    const a = await tourStep(n);
    if (run !== RUN) return;
    if (a === 'skip') break;
  }
  endTour();
  // 05 · the brief
  paintDirector(5);
  FAST = from > 5;
  await sendBrief(run);
  if (run !== RUN) return;
  // 06 · the crew drafts
  paintDirector(6);
  FAST = from > 6;
  await draft(run);
  FAST = false;
  if (run !== RUN) return;
  if (from >= 7) { paintDirector(from); openPlan(from === 8 ? 1 : 0); return; }
  await wait(1200);
  if (run !== RUN) return;
  paintDirector(7);
  openPlan(0);
}

// ── director (demo only) ───────────────────────────────────────────
const BEATS = ['Welcome', 'Chat', 'Scene', 'Plan mode', 'Brief sent', 'Crew drafts', 'Plan · Overview', 'Plan · Assets'];
function paintDirector(n) {
  const d = $('director');
  if (Q.has('clean')) { d.classList.add('is-hidden'); return; }
  d.innerHTML = BEATS.map((b, i) => `<button class="${i + 1 === n ? 'is-on' : ''}" data-n="${i + 1}">${i + 1} ${b}</button>`).join('')
    + '<button data-n="1">↺ Replay</button>';
  d.querySelectorAll('button').forEach((b) => { b.onclick = () => play(+b.dataset.n); });
}
document.addEventListener('click', (e) => {
  const t = e.target.closest('.tabb, #pxGo');
  if (t) paintDirector(planStep === 0 ? 7 : 8);
});

play(+(Q.get('step') || 1));
})();
