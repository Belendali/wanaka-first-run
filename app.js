/* ──────────────────────────────────────────────────────────────────
   Wanaka · First run in Studio — 1:1 of Figma section 0917.

   Landing → login → Wana says hi → tour (chat, scene, the crew + Plan)
   → the landing-page idea goes straight to the Planner (Plan mode on)
   → only the Planner works; the rest of the crew waits on the bar
   → “View full plan” opens the plan over everything → Game assets
   → Approve: the Developer picks it up.

   The bar at the bottom is for the demo (?clean hides it, ?step=N
   opens any beat).
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
let FAST = false;
const wait = (ms) => new Promise((r) => setTimeout(r, FAST ? 0 : ms));
let RUN = 0;

function fit() {
  const s = Math.min(innerWidth / 1920, innerHeight / 1080);
  $('stage').style.transform = `translate(-50%, -50%) scale(${s})`;
}
addEventListener('resize', fit);
fit();

const BRIEF = 'Build a toy house exploration game: A boy collecting puzzles in the room to unlock the secret of the toy house';
const NAME = { planner: 'Planner', developer: 'Developer', artist: 'Artist', audio: 'Musician', tester: 'Tester' };

// ── chat ───────────────────────────────────────────────────────────
function push(node) {
  const t = $('thread');
  t.appendChild(node);
  t.classList.toggle('is-full', t.scrollHeight > t.clientHeight);
  if (window.__chatNews) window.__chatNews('game');
  return node;
}
const ACTS = `<span class="acts">
  <svg viewBox="0 0 16 16"><rect x="5" y="5" width="8.5" height="8.5" rx="1.5"/><path d="M11 5V3.5A1 1 0 0 0 10 2.5H3.5a1 1 0 0 0-1 1V10a1 1 0 0 0 1 1H5"/></svg>
  <svg viewBox="0 0 16 16"><rect x="2.5" y="3" width="11" height="10" rx="2"/><path d="M5.5 6.5h5M5.5 9h3"/></svg></span>`;
const userSay = (text) => push(E('div', 'msg msg--user', `<span class="bub">${text}</span>${ACTS}`));
const crewSay = (k, text) => push(E('div', 'msg msg--crew',
  `<span class="av"><img src="assets/crew-${k}.webp" alt=""></span><span class="txt"><b>${NAME[k]} Wana</b><p>${text}</p></span>`));

// ── the crew bar: only whoever is working moves; hover any cat to see what they're doing ──
const BAR = ['planner', 'developer', 'artist', 'audio', 'tester'];
const LINES = {
  plan: {
    planner: 'Planner: building your game plan...',
    developer: 'Developer: waiting for the plan — then I write the game logic',
    artist: 'Artist: waiting for the plan — then I make the models',
    audio: 'Musician: waiting for the plan — then I score it',
    tester: 'Tester: waiting for the plan — then I play it through',
  },
  build: {
    planner: 'Planner: plan approved — keeping the crew on track',
    developer: 'Developer: Writing your game logic...',
    artist: 'Artist: Modelling the bedroom and the toys...',
    audio: 'Musician: Scoring a theme loop for the bedroom...',
    tester: 'Tester: Playing it through before you do...',
  },
};
function crewbar(active, phase) {
  const bar = $('crewbar');
  bar.hidden = false;
  bar.classList.toggle('is-build', phase === 'build');
  bar.innerHTML = `<i class="crewbar__min" title="Minimise"></i>
    <div class="crewbar__row">${BAR.map((k) => `
      <span class="cat${k === active ? ' is-on' : ' is-idle'}" data-k="${k}">
        <img src="assets/${k === active ? `crew-${k}.webp` : `crew-${k}-still.png`}" alt="${NAME[k]}"></span>`).join('')}</div>
    <div class="crewbar__line" id="crewLine">${LINES[phase][active]}</div>`;
  const line = $('crewLine');
  bar.querySelectorAll('.cat').forEach((c) => {
    c.onmouseenter = () => { line.textContent = LINES[phase][c.dataset.k]; };
    c.onmouseleave = () => { line.textContent = LINES[phase][bar.dataset.active]; };
  });
  bar.dataset.active = active;
  bar.querySelector('.crewbar__min').onclick = () => { bar.hidden = true; };
}
// hand the work to the next cat: only its picture moves, the line says what it is doing
function crewTurn(active) {
  const bar = $('crewbar');
  bar.dataset.active = active;
  bar.querySelectorAll('.cat').forEach((c) => {
    const on = c.dataset.k === active;
    c.classList.toggle('is-on', on);
    c.classList.toggle('is-idle', !on);
    c.querySelector('img').src = `assets/crew-${c.dataset.k}${on ? '.webp' : '-still.png'}`;
  });
  $('crewLine').textContent = LINES.build[active];
}

// ── tour ───────────────────────────────────────────────────────────
const tour = $('tour');
function holes(list) {
  const rr = ([x, y, w, h, r]) =>
    `M${x + r} ${y}h${w - 2 * r}a${r} ${r} 0 0 1 ${r} ${r}v${h - 2 * r}a${r} ${r} 0 0 1 -${r} ${r}h-${w - 2 * r}a${r} ${r} 0 0 1 -${r} -${r}v-${h - 2 * r}a${r} ${r} 0 0 1 ${r} -${r}z`;
  return `<svg class="scrim" viewBox="0 0 1920 1080"><path d="M0 0H1920V1080H0Z ${list.map(rr).join(' ')}" fill="rgba(8,5,5,.7)" fill-rule="evenodd"/></svg>
    ${list.map(([x, y, w, h, r]) => `<i class="ring" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;border-radius:${r}px"></i>`).join('')}`;
}
function coach({ place, title, body, step, skip, next }) {
  const tip = '<i class="cm__tip"></i>';
  const card = `<div class="cm__card"><b>${title}</b><p>${body}</p>
    <div class="cm__foot">${step ? `<span class="cm__step">${step}</span>` : ''}
      ${skip ? `<button class="cm__skip" data-a="skip">${skip}</button>` : ''}
      <button class="cm__next" data-a="next">${next}</button></div></div>`;
  return E('div', `cm cm--${place}`, place === 'left' || place === 'top' ? tip + card : card + tip);
}
function tourStep(n) {
  return new Promise((done) => {
    tour.hidden = false;
    tour.innerHTML = '';
    let c;
    if (n === 1) {                                   // Wana waves
      tour.innerHTML = `<div class="tour__dim is-blur"></div>
        <i class="shadow" style="left:556px;top:652px"></i>
        <img class="tcat" src="assets/wana-hi.webp" style="left:544px;top:390px;width:300px;height:300px" alt="">`;
      c = coach({ place: 'left', title: 'Hi, I’m Wana! 👋',
        body: 'Welcome to Wanaka Studio — I’m here to build your game with you. Want a quick look around first?',
        skip: 'Skip', next: 'Let’s go' });
      tour.appendChild(c);
      c.style.left = '836px'; c.style.top = `${545 - c.offsetHeight / 2}px`;
    } else if (n === 2) {                            // the chat
      tour.innerHTML = holes([[1522, 46, 396, 1032, 12]]);
      c = coach({ place: 'right', title: 'Chat with your AI game builder',
        body: 'Tell me what to make or change, in plain words — I’ll build it. You can also generate any asset right here: characters, props, music and more.',
        step: '1 / 3', next: 'Next' });
      tour.appendChild(c);
      c.style.left = `${1510 - c.offsetWidth}px`; c.style.top = `${540 - c.offsetHeight / 2}px`;
    } else if (n === 3) {                            // the scene and the tools
      tour.innerHTML = holes([[2, 46, 1514, 1022, 12], [488, 5, 194, 34, 8]]);
      c = coach({ place: 'top', title: 'Build your world, precisely',
        body: 'This is your scene. Add or delete models, then move, rotate and scale anything freely — down to the last detail.',
        step: '2 / 3', skip: 'Skip', next: 'Next' });
      tour.appendChild(c);
      c.style.left = '405px'; c.style.top = '52px';
    } else if (n === 4) {                            // the crew, and Plan
      const cats = [['tester', 214, 598, 200, 200], ['artist', 406, 598, 200, 200],
        ['planner', 648, 470, 260, 300], ['audio', 950, 598, 200, 200], ['developer', 1142, 598, 200, 200]];
      tour.innerHTML = `<div class="tour__dim is-blur"></div>
        ${cats.map(([k, x, y, w, h]) => `<i class="shadow" style="left:${x + w / 2 - 100}px;top:${y + h - 34}px"></i>
          <img class="tcat" src="assets/crew-${k}.webp" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px" alt="">`).join('')}
        <div class="lift" style="left:1520px;top:896px;width:400px;height:48px;background:url(assets/chat-bg.png) 0 -852px/400px 1036px"></div>`;
      const dock = $('composer').cloneNode(true);
      dock.removeAttribute('id');
      dock.style.cssText = 'left:1532px;top:944px;z-index:2';
      dock.querySelector('.planpill').classList.add('is-lit');
      tour.appendChild(dock);
      c = coach({ place: 'bottom', title: 'Last one! Turn on Plan mode',
        body: 'A whole game team — Planner, Artist, Developer and Tester — takes your idea from game design to a finished game, step by step.',
        step: '3 / 3', next: 'Start' });
      tour.appendChild(c);
      c.style.left = `${778 - c.offsetWidth / 2}px`; c.style.top = `${466 - c.offsetHeight}px`;
    }
    c.querySelectorAll('[data-a]').forEach((b) => { b.onclick = () => done(b.dataset.a); });
  });
}
const endTour = () => { tour.hidden = true; tour.innerHTML = ''; };

// ── landing + login ────────────────────────────────────────────────
function web(which) {
  return new Promise((done) => {
    $('web').hidden = false;
    $('webImg').src = `assets/${which}.jpg`;
    $('hotCreate').hidden = which !== 'landing';
    $('hotGoogle').hidden = which !== 'login';
    $('hotCreate').onclick = () => done();
    $('hotGoogle').onclick = () => done();
  });
}

// ── the Planner works alone, then hands you the plan ───────────────
async function planning(run, auto) {
  push(E('div', 'divider msg', '<i></i>Plan mode on · your game team is in'));
  userSay(BRIEF);
  $('send').classList.add('is-stop');
  crewbar('planner', 'plan');
  await wait(700);
  if (run !== RUN) return false;
  crewSay('planner', 'A toy house with a secret — love it. I’ve called in the team; we’ll draft the whole plan for you to check before anything gets built.');
  const list = push(E('div', 'steps msg', ['Read your idea', 'Shaping the core loop', 'Choosing a look', 'Sizing the build']
    .map((t, i) => `<div class="step step--${i === 0 ? 'busy' : 'todo'}"><i></i>${t}</div>`).join('')));
  const rows = [...list.querySelectorAll('.step')];
  for (let i = 0; i < rows.length; i++) {
    if (run !== RUN) return false;
    rows[i].className = 'step step--busy';
    await wait(1300);
    rows[i].className = 'step step--done';
  }
  await wait(400);
  if (run !== RUN) return false;
  $('crewbar').hidden = true;
  $('send').classList.remove('is-stop');
  crewSay('planner', 'Here it is — it is open on the left. Every card is yours to change, and nothing gets built until you approve it.');
  const card = push(E('div', 'plancard msg', `<img src="assets/boy.jpg" alt="">
    <span><em>Plan v1.0</em><b>Tiny Explorer: The Giant Bedroom</b><button>View full plan</button></span>`));
  paintDirector(8);
  if (auto) return true;
  return new Promise((done) => { card.querySelector('button').onclick = () => done(run === RUN); });
}

// ── the plan, over everything ──────────────────────────────────────
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
const seg = (list, on) => `<div class="seg">${list.map((t, i) => `<button class="${i === on ? 'is-on' : ''}">${t}</button>`).join('')}</div>`;

let planStep = 0;
let scope = 1;
let onApprove = null;

function openPlan(step = 0) {
  const host = $('planx');
  host.hidden = false;
  host.innerHTML = `
    <div class="px">
      <header class="px__h">
        <span class="px__brand">Plan Studio</span>
        <span class="px__steps"><button class="tabb" data-s="0">1 · Overview</button><i></i><button class="tabb" data-s="1">2 · Game assets</button></span>
        <button class="px__x" id="pxX"><svg viewBox="0 0 16 16"><path d="M4 4l8 8M12 4l-8 8"/></svg></button>
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
  $('pxGo').onclick = () => (planStep === 0 ? goPlan(1) : onApprove && onApprove());
  goPlan(step);
}
function closePlan() { $('planx').hidden = true; $('planx').innerHTML = ''; }
function goPlan(n) {
  planStep = n;
  document.querySelectorAll('.tabb').forEach((b) => b.classList.toggle('is-on', +b.dataset.s === n));
  $('pxBody').innerHTML = n === 0 ? overview() : assets();
  $('pxGo').textContent = n === 0 ? 'Next · game assets' : 'Approve plan & start build';
  (n === 0 ? wireOverview : wireAssets)();
  paintSum();
  paintDirector(n === 0 ? 9 : 10);
}

function overview() {
  return `
    <div class="cover" id="cover"><img src="assets/boy.jpg" alt=""><button class="btn btn--sec">Retry cover</button></div>
    <div class="form">
      <div class="card">
        <span class="card__k">GAME INFORMATION</span>
        <div class="fld"><label>Game name</label><input class="inp" value="Tiny Explorer: The Giant Bedroom"></div>
        <div class="fld"><label>Genre</label>
          <button class="sel" id="genreSel"><span>Adventure</span>${ARROW}</button>
          <div class="menu menu--genre" id="genreMenu">${GENRES.map(([n, d], i) =>
            `<button class="gopt${i === 0 ? ' is-on' : ''}" data-n="${n}">${gicon(d)}${n}</button>`).join('')}</div></div>
        <div class="fld"><label>Core gameplay</label>
          <textarea class="inp">Cross a bedroom the size of a country — over the rug, up the blocks, past the truck — to the hoop on the far shelf.</textarea></div>
        <div class="fld"><label>Player experience</label>
          <textarea class="inp short">Small and brave, in a room that was built for someone much bigger.</textarea></div>
      </div>
      <div class="card">
        <span class="card__k">VISUAL STYLE</span>
        <div class="fld"><label>Style</label>
          <button class="sel" id="styleSel"><img src="assets/boy-sty-toon.jpg" alt=""><span>Stylized Toon</span>${ARROW}</button>
          <div class="menu menu--style" id="styleMenu">${STYLES.map(([k, n]) =>
            `<button class="stile${k === 'toon' ? ' is-on' : ''}" data-k="${k}" data-n="${n}"><img src="assets/boy-sty-${k}.jpg" alt="">${n}</button>`).join('')}</div></div>
        <div class="fld"><label>Render quality</label>${seg(['Low', 'Medium', 'High', 'Ultra', 'Cinematic'], 2)}</div>
      </div>
      <div class="card">
        <span class="card__k">BUILD SCOPE</span>
        ${SCOPES.map(([n, d, m1, m2, ic], i) => `
          <button class="scope${i === scope ? ' is-on' : ''}" data-i="${i}">
            <span class="scope__t"><svg viewBox="0 0 18 18">${ic}</svg><span>${n}</span></span>
            <span class="scope__d">${d}</span><span class="scope__m"><span>${m1}</span><span>${m2}</span></span></button>`).join('')}
        <div class="fld"><label>Platform</label>
          <div class="plats"><button class="plat is-on"><i class="cb"></i>Web</button><button class="plat is-on"><i class="cb"></i>Mobile</button></div>
          <span class="hint" id="platHint">Built for web and mobile</span></div>
        <div class="fld"><label>Session length</label>${seg(['3–5 min', '8–12 min', '15–20 min'], 1)}<span class="hint">Room for mastery and an arc</span></div>
        <div class="fld"><label>Difficulty</label>${seg(['Gentle', 'Normal', 'Tough'], 1)}<span class="hint">Fair, with room to fail</span></div>
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
      $('genreSel').innerHTML = `<span>${b.dataset.n}</span>${ARROW}`;
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
    b.onclick = () => { scope = +b.dataset.i; document.querySelectorAll('.scope').forEach((o) => o.classList.toggle('is-on', o === b)); paintSum(); };
  });
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
const P = ['toy-blocks', 'book-stacks', 'dresser', 'basketball', 'truck', 'teddy', 'stars', 'baseballs', 'pencils', 'backpacker', 'robot-pal', 'dino-suit'];
const SLOTS = [
  { k: 'bedroom', name: 'The bedroom', note: 'Floor, shelves, and how the room is laid out',
    picks: [['Toy blocks', 'toy-blocks'], ['Book stacks', 'book-stacks'], ['Dresser', 'dresser'], ['Play rug', 'pencils']],
    shelf: ['Bunk bed', 'Shelf wall', 'Toy chest', 'Play mat', 'Desk corner', 'Lamp post', 'Curtain set', 'Window seat', 'Wardrobe', 'Step stool', 'Crate stack', 'Pillow fort'],
    deep: ['Wooden block set', 'Painted blocks', 'Block tower', 'Alphabet blocks', 'Block cart', 'Chunky blocks', 'Block city', 'Block crate'],
    chosen: ['Toy blocks', 'Book stacks'], hint: 'beds, rugs, shelves' },
  { k: 'bigtoys', name: 'Big toys', note: 'The giant things he climbs past',
    picks: [['Basketball', 'basketball'], ['Truck', 'truck'], ['Teddy', 'teddy'], ['Robot pal', 'robot-pal']],
    shelf: ['Rocking horse', 'Spinning top', 'Toy train', 'Kite', 'Drum', 'Robot dog', 'Race car', 'Dollhouse', 'Beach ball', 'Jack-in-the-box', 'Toy piano', 'Plush whale'],
    deep: ['Giant block', 'Bouncy ball', 'Toy crane', 'Fire truck', 'Stuffed bear', 'Wind-up duck', 'Toy rocket', 'Ball pit'],
    chosen: [], hint: 'trucks, balls, plush' },
  { k: 'collect', name: 'To collect', note: 'The thing he is after',
    picks: [['Stars', 'stars'], ['Baseballs', 'baseballs'], ['Pencils', 'pencils'], ['Marbles', 'book-stacks']],
    shelf: ['Puzzle pieces', 'Coins', 'Stickers', 'Buttons', 'Keys', 'Gems', 'Bottle caps', 'Crayons', 'Seashells', 'Paper cranes', 'Toy soldiers', 'Glow sticks'],
    deep: ['Gold stars', 'Star badges', 'Glitter stars', 'Star cookies', 'Tin stars', 'Paper stars', 'Star beads', 'Star cards'],
    chosen: [], hint: 'stars, coins, keys' },
  { k: 'kid', name: 'The kid', note: 'Who you play as',
    picks: [['Backpacker', 'backpacker'], ['Dino suit', 'dino-suit'], ['Robot pal', 'robot-pal'], ['Pyjama kid', 'teddy']],
    shelf: ['Scout', 'Astronaut', 'Pirate', 'Knight', 'Wizard', 'Detective', 'Chef', 'Explorer', 'Skater', 'Ninja', 'Cowboy', 'Superhero'],
    deep: ['Tiny backpacker', 'Hiker kid', 'Camp kid', 'Map reader', 'Trail kid', 'Cap kid', 'Sneaker kid', 'Satchel kid'],
    chosen: [], hint: 'heroes, costumes' },
];
const picked = {};
const resetPicks = () => SLOTS.forEach((s) => { picked[s.k] = new Set(s.chosen); });
resetPicks();
const shelf = (s) => s.shelf.map((n, i) => [n, P[(i + 4) % 12]]);
const deep = (s) => s.deep.map((n, i) => [n, P[i % 12]]);
const acard = (n, p, note, extra = '') => `
  <button class="acard" data-n="${n}"${extra}>
    <span class="acard__art" style="background-image:url(assets/boy-part-${p}.jpg)"><i class="cb"></i></span>
    <span class="acard__lab"><b>${n}</b><em data-note="${note}">${note}</em></span>
  </button>`;
const later = () => `
  <button class="acard acard--later">
    <span class="acard__art"><img src="assets/crew-artist-still.png" alt=""><span>✦</span></span>
    <span class="acard__lab"><b>Generate later</b><em>The Artist makes it</em></span>
  </button>`;
const CHEV = '<svg viewBox="0 0 16 16"><path d="m4.5 6.5 3.5 3.5 3.5-3.5"/></svg>';
const CHEVUP = '<svg viewBox="0 0 16 16"><path d="m4.5 9.5 3.5-3.5 3.5 3.5"/></svg>';

function assets() {
  return `<div class="slots" id="slots">
    <header class="slots__h"><b>Game assets</b>
      <p>Optional. Pick as many as you like for each part — anything you leave alone, the Artist makes during the build.</p></header>
    ${SLOTS.map((s) => `
      <div class="slot" data-k="${s.k}">
        <div class="slot__h">
          <span class="t"><b>${s.name}</b><em>${s.note}</em></span>
          <button class="pbtn more">Browse more ${CHEV}</button>
          <span class="fold"><span class="chipx">✦ Left to the Artist</span><span class="ba">Browse all ${4 + s.shelf.length + s.deep.length}</span>${CHEV}</span>
        </div>
        <div class="tools2">
          <label class="sbox"><input type="text" spellcheck="false" placeholder="Search the ${s.name.replace(/^The /, '').toLowerCase()} library — ${s.hint}..."></label>
          <button class="sx" title="Clear search">✕</button>
          <i class="gap"></i>
          <button class="pbtn less">Show less ${CHEVUP}</button>
        </div>
        <div class="row5 row5--picks">${s.picks.map(([n, p]) => acard(n, p, 'Artist’s pick')).join('')}${later()}</div>
        <div class="row5 peek">${shelf(s).slice(0, 5).map(([n, p]) => acard(n, p, '')).join('')}</div>
        <div class="lib">
          <div class="libgrid">
            ${s.picks.map(([n, p]) => acard(n, p, 'Artist’s pick')).join('')}${later()}
            ${shelf(s).map(([n, p]) => acard(n, p, '')).join('')}
            ${deep(s).map(([n, p]) => acard(n, p, 'In the library', ' data-deep hidden')).join('')}
          </div>
          <div class="none"><b>Nothing in the library matches <span class="none__q"></span></b>
            <button class="btn btn--sec none__later">Generate later</button></div>
        </div>
      </div>`).join('')}
  </div>`;
}

function wireAssets() {
  const page = $('slots');
  document.querySelectorAll('.slot').forEach((slot) => {
    const s = SLOTS.find((x) => x.k === slot.dataset.k);
    const set = picked[s.k];
    const box = slot.querySelector('.sbox input');
    const grid = slot.querySelector('.libgrid');
    const paint = () => {
      slot.querySelectorAll('.acard[data-n]').forEach((b) => {
        const on = set.has(b.dataset.n);
        b.classList.toggle('is-on', on);
        const em = b.querySelector('em');
        em.textContent = on ? 'Picked' : em.dataset.note;
      });
      slot.querySelectorAll('.acard--later').forEach((b) => b.classList.toggle('is-on', set.size === 0));
      // the first slot keeps the Artist in its "later" card; the rest show the spark
      slot.querySelectorAll('.acard--later .acard__art').forEach((a) => a.classList.toggle('is-plain', s.k !== 'bedroom'));
      slot.querySelector('.chipx').textContent = set.size ? `${set.size} from the library` : '✦ Left to the Artist';
      paintSum();
    };
    slot.querySelectorAll('.acard[data-n]').forEach((b) => {
      b.onclick = (e) => { e.stopPropagation(); if (set.has(b.dataset.n)) set.delete(b.dataset.n); else set.add(b.dataset.n); paint(); };
    });
    slot.querySelectorAll('.acard--later').forEach((b) => { b.onclick = (e) => { e.stopPropagation(); set.clear(); paint(); }; });

    // hover pulls out a second row
    slot.onmouseenter = () => { if (!page.classList.contains('has-open')) slot.classList.add('is-hot'); };
    slot.onmouseleave = () => slot.classList.remove('is-hot');

    const clear = () => {
      box.value = '';
      slot.classList.remove('is-search', 'is-empty');
      page.classList.remove('is-searching');
      grid.querySelectorAll('.acard').forEach((b) => { b.hidden = b.hasAttribute('data-deep'); });
    };
    const open = (on) => {
      if (on) document.querySelectorAll('.slot.is-open').forEach((o) => { if (o !== slot) o.__open(false); });
      clear();
      slot.classList.toggle('is-open', on);
      slot.classList.remove('is-hot');
      page.classList.toggle('has-open', !!document.querySelector('.slot.is-open'));
      if (on) box.focus();
    };
    slot.__open = open;
    const search = () => {
      const q = box.value.trim().toLowerCase();
      slot.classList.toggle('is-search', !!q);
      page.classList.toggle('is-searching', !!q);
      let hits = 0;
      grid.querySelectorAll('.acard[data-n]').forEach((b) => {
        const hit = q ? b.dataset.n.toLowerCase().includes(q) : !b.hasAttribute('data-deep');
        b.hidden = !hit;
        if (hit) hits++;
      });
      grid.querySelectorAll('.acard--later').forEach((b) => { b.hidden = !!q; });
      slot.classList.toggle('is-empty', !!q && hits === 0);
      slot.querySelector('.none__q').textContent = `“${box.value.trim()}”`;
    };
    slot.querySelector('.more').onclick = (e) => { e.stopPropagation(); open(true); };
    slot.querySelector('.less').onclick = (e) => { e.stopPropagation(); open(false); };
    slot.onclick = () => { if (page.classList.contains('has-open') && !slot.classList.contains('is-open')) open(true); };
    box.onclick = (e) => e.stopPropagation();
    box.oninput = search;
    box.onkeydown = (e) => { if (e.key !== 'Escape') return; e.stopPropagation(); if (box.value) clear(); else open(false); };
    slot.querySelector('.sx').onclick = (e) => { e.stopPropagation(); clear(); box.focus(); };
    // nothing fits: hand the slot to the Artist
    slot.querySelector('.none__later').onclick = (e) => { e.stopPropagation(); set.clear(); open(false); paint(); };
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

// ── the run ────────────────────────────────────────────────────────
function reset() {
  RUN++;
  endTour();
  closePlan();
  $('web').hidden = true;
  $('thread').innerHTML = '';
  $('thread').classList.remove('is-full');
  $('crewbar').hidden = true;
  $('scene').innerHTML = '';
  if (typeof resetChats === 'function') resetChats();
  setMode('build');
  $('planPill').classList.remove('is-lit');
  $('send').className = 'send';
  resetPicks();
  scope = 1;
}

async function play(from = 1) {
  reset();
  const run = RUN;
  FAST = false;
  // 1–2 · landing, then login
  if (from <= 1) { paintDirector(1); await web('landing'); if (run !== RUN) return; }
  if (from <= 2) { paintDirector(2); await web('login'); if (run !== RUN) return; }
  $('web').hidden = true;
  // 3–6 · Wana, then the tour (Skip goes straight to the crew)
  if (from <= 6) {
    for (let n = Math.max(3, from); n <= 6; n++) {
      paintDirector(n);
      const a = await tourStep(n - 2);
      if (run !== RUN) return;
      if (a === 'skip' && n < 6) n = 5;
    }
  }
  endTour();
  // 7–8 · the Planner works alone, then hands over the plan
  paintDirector(7);
  FAST = from >= 8;
  const ok = await planning(run, from >= 9);
  FAST = false;
  if (!ok || run !== RUN) return;
  // 9–11 · the plan, then the build
  onApprove = () => build(run);
  if (from >= 12) {
    FAST = true;
    closePlan();
    userSay('Approve and build now');
    crewSay('planner', 'Cool, my crew is working for you...');
    push(E('div', 'steps msg', ['Game logic', 'Models and scene', 'Theme music', 'Playtest']
      .map((t) => `<div class="step step--done"><i></i>${t}</div>`).join('')));
    FAST = false;
    version1(run);
    if (from >= 13) play1();
    return;
  }
  openPlan(from === 10 ? 1 : 0);
  if (from >= 11) build(run);
}

// ── the build: one cat every 5 seconds, the game assembles behind the bar ──
const scene = () => $('scene');
const room = () => { let r = scene().querySelector('.roomhost'); if (!r) { r = E('div', 'roomhost'); scene().prepend(r); Scene.mount(r); } return r; };
const devScene = () => { room(); Scene.wire(); };
const artScene = (fast) => { room(); Scene.art(fast); };
const audioScene = () => Scene.music(scene());
function testScene() {
  Scene.test(4200);
  const box = E('div', 'checks');
  scene().appendChild(box);
  ['Jump & land', 'Collect the stars', 'Reach the hoop'].forEach((t, i) =>
    setTimeout(() => box.appendChild(E('span', 'chk', `<i></i>${t}`)), FAST ? 0 : 500 + i * 1300));
}

async function build(run) {
  closePlan();
  paintDirector(11);
  userSay('Approve and build now');
  await wait(500);
  if (run !== RUN) return;
  crewSay('planner', 'Cool, my crew is working for you...');
  $('send').classList.add('is-stop');
  const list = push(E('div', 'steps msg', ['Game logic', 'Models and scene', 'Theme music', 'Playtest']
    .map((t, i) => `<div class="step step--${i === 0 ? 'busy' : 'todo'}"><i></i>${t}</div>`).join('')));
  const rows = [...list.querySelectorAll('.step')];
  crewbar('developer', 'build');
  const TURNS = [['developer', devScene], ['artist', artScene], ['audio', audioScene], ['tester', testScene]];
  for (let i = 0; i < TURNS.length; i++) {
    if (run !== RUN) return;
    crewTurn(TURNS[i][0]);
    rows[i].className = 'step step--busy';
    TURNS[i][1]();
    await wait(5000);
    rows[i].className = 'step step--done';
  }
  if (run !== RUN) return;
  version1(run);
}

function version1(run) {
  paintDirector(12);
  $('crewbar').hidden = true;
  $('send').classList.remove('is-stop');
  const sc = scene();
  sc.querySelectorAll('.tag,.checks,.note').forEach((n) => n.remove());
  if (!sc.querySelector('.thing')) { room(); Scene.art(true); }
  sc.appendChild(E('span', 'vtag', 'Version 1.0'));
  const big = E('button', 'bigplay', '<span>Play version 1.0</span>');
  sc.appendChild(big);
  big.onclick = () => play1();
  crewSay('tester', 'Version 1.0 is up and it holds together — five stars to find, one hoop to reach. Give it a go.');
  const card = push(E('div', 'v1card msg', `<img src="assets/boy.jpg" alt="">
    <span><em>Version 1.0</em><b>Tiny Explorer: The Giant Bedroom</b><button>▶ Play</button></span>`));
  card.querySelector('button').onclick = () => play1();
}

// ── Preview: version 1.0, playable ─────────────────────────────────
function play1() {
  paintDirector(13);
  setMode('play');
  const sc = scene();
  sc.querySelectorAll('.bigplay,.vtag,.hud,.hint2,.win').forEach((n) => n.remove());
  if (!sc.querySelector('.thing')) { room(); Scene.art(true); }
  sc.classList.add('is-playing');
  const t0 = performance.now();
  const hud = E('div', 'hud', '<span class="st">★ <b id="stN">0</b>/5</span><span id="clock">0:00</span>');
  const hint = E('div', 'hint2', 'Arrow keys / WASD, or click the floor — find five stars, then reach the hoop');
  sc.append(hud, hint);
  const clock = setInterval(() => {
    if (!hud.isConnected) return clearInterval(clock);
    const sec = Math.floor((performance.now() - t0) / 1000);
    $('clock').textContent = `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`;
  }, 250);
  Scene.play({
    onStar: (n) => { $('stN').textContent = n; if (n === 5) hint.textContent = 'All five! Now reach the hoop'; },
    onWin: () => {
      clearInterval(clock);
      const win = E('div', 'win', `<div class="win__c"><img src="assets/crew-tester.webp" alt="">
        <b>You reached the hoop!</b><p>★ 5/5 in ${$('clock').textContent} — that’s version 1.0.</p>
        <span class="acts"><button class="btn btn--sec" id="again">Play again</button><button class="btn btn--go" id="back">Back to Build</button></span></div>`);
      sc.appendChild(win);
      $('again').onclick = () => play1();
      $('back').onclick = () => { setMode('build'); paintDirector(12); };
    },
  });
}
function setMode(m) {
  document.querySelectorAll('.modes__b').forEach((b) => b.classList.toggle('is-on', b.dataset.m === m));
  if (m === 'build') {
    if (window.Scene) Scene.stop();
    scene().classList.remove('is-playing');
    scene().querySelectorAll('.hud,.hint2,.win').forEach((n) => n.remove());
    if (scene().querySelector('.thing') && !scene().querySelector('.bigplay')) {
      const big = E('button', 'bigplay', '<span>Play version 1.0</span>');
      scene().append(E('span', 'vtag', 'Version 1.0'), big);
      big.onclick = () => play1();
    }
  }
}
document.querySelectorAll('.modes__b').forEach((b) => {
  b.onclick = () => {
    const ready = !!scene().querySelector('.bigplay');
    if (b.dataset.m === 'play' && ready) play1();
    if (b.dataset.m === 'build') { setMode('build'); if (ready) paintDirector(12); }
  };
});

// ── chats with different Wanas, running side by side ──────────────
// The Game chat is the one that changes the game. The others make or think
// things through, and hand what they make back: an asset goes into the
// scene, a design idea goes to the Game chat.
const AGENTS = {
  game: { who: 'Wana', img: 'assets/wana-still.png', tag: 'Game', line: 'Build and change your game',
    ph: 'Ask, plan, build anything...' },
  assets: { who: 'Artist Wana', img: 'assets/crew-artist-still.png', tag: 'Assets', line: 'Characters, props, music — made to order',
    ph: 'Describe an asset — a toy robot, a wooden crate…',
    hello: 'I make the things in your game — characters, props, music. Tell me what you need; anything I make can go straight into the scene.',
    chips: ['A wind-up toy robot', 'A giant rubber duck', 'A cozy bedroom theme'] },
  design: { who: 'Planner Wana', img: 'assets/crew-planner-still.png', tag: 'Design', line: 'Talk through ideas, levels and rules',
    ph: 'Talk an idea through…',
    hello: 'Let’s think it through before anyone builds it — ideas, levels, rules. When something’s good, I’ll hand it to the Game chat.',
    chips: ['Add a second room', 'What makes it replayable?', 'A boss at the end?'] },
  biz: { who: 'Publisher Wana', img: 'assets/crew-marketing-still.png', tag: 'Business', line: 'Audience, pricing and launch',
    ph: 'Ask about audience, price, launch…',
    hello: 'I think about who plays it and how they find it. Ask me about your audience, pricing, or a launch plan.',
    chips: ['Who is this game for?', 'Free or paid?', 'A plan for launch week'] },
};
const TCLS = { game: 'game', assets: 'assets', design: 'design', biz: 'biz' };
let chats = [];
let current = 'game';
function resetChats() {
  document.querySelectorAll('.thread.side').forEach((t) => t.remove());
  $('thread').classList.remove('is-off');
  chats = [{ id: 'game', type: 'game', title: 'Toy house explorer', el: $('thread'), unread: false, busy: false }];
  current = 'game';
  $('chatPop').hidden = true;
  paintHead();
}
const chatOf = (id) => chats.find((c) => c.id === id);
const gameBusy = () => $('send').classList.contains('is-stop') || !$('crewbar').hidden;
function statusOf(c) {
  if (c.type === 'game') return gameBusy() ? ['busy', 'Your crew is building…'] : [c.unread ? 'dot' : '', 'The game — plan, build, change'];
  if (c.busy) return ['busy', `${AGENTS[c.type].who} is working…`];
  return [c.unread ? 'dot' : '', c.last || AGENTS[c.type].line];
}
function paintHead() {
  const c = chatOf(current);
  const a = AGENTS[c.type];
  const news = chats.some((o) => o.id !== current && (o.unread || (o.type === 'game' ? false : o.busy)));
  $('chatName').innerHTML = `<img src="${a.img}" alt=""><span class="n">${c.title}</span>
    <span class="ttag ttag--${TCLS[c.type]}">${a.tag}</span>${news ? '<i class="news"></i>' : ''}
    <svg viewBox="0 0 16 16"><path d="m4 6 4 4 4-4"/></svg>`;
  $('input').dataset.ph = a.ph;
  if (!$('chatPop').hidden && $('chatPop').dataset.mode === 'list') listPop();
}
window.__chatNews = (id) => {
  const c = chatOf(id);
  if (!c) return;
  if (id !== current) c.unread = true;
  paintHead();
};
function listPop() {
  const pop = $('chatPop');
  pop.dataset.mode = 'list';
  pop.innerHTML = `<div class="chatpop__k">OPEN CHATS · ${chats.length}</div>
    ${chats.map((c) => { const [st, line] = statusOf(c); const a = AGENTS[c.type]; return `
      <button class="crow${c.id === current ? ' is-on' : ''}" data-id="${c.id}"><img src="${a.img}" alt="">
        <span><b>${c.title}<span class="ttag ttag--${TCLS[c.type]}">${a.tag}</span></b><em>${line}</em></span>
        ${st === 'busy' ? '<i class="busy"></i>' : st === 'dot' ? '<i class="dot"></i>' : ''}
        ${c.id === current ? '<svg class="ok" viewBox="0 0 16 16"><path d="m3.5 8.5 3 3 6-7"/></svg>' : ''}</button>`; }).join('')}
    <div class="chatpop__sep"></div>
    <button class="chatpop__new"><svg viewBox="0 0 16 16" style="width:14px;height:14px"><path d="M8 3.5v9M3.5 8h9"/></svg>New chat with…</button>`;
  pop.querySelectorAll('.crow').forEach((b) => { b.onclick = () => { switchTo(b.dataset.id); pop.hidden = true; }; });
  pop.querySelector('.chatpop__new').onclick = newPop;
}
function newPop() {
  const pop = $('chatPop');
  pop.dataset.mode = 'new';
  pop.innerHTML = `<div class="chatpop__k">NEW CHAT WITH…</div>
    ${Object.entries(AGENTS).map(([k, a]) => `
      <button class="crow" data-t="${k}"><img src="${a.img}" alt="">
        <span><b>${k === 'game' ? 'Game' : a.tag}<span class="ttag ttag--${TCLS[k]}">${a.who}</span></b><em>${a.line}</em></span></button>`).join('')}`;
  pop.querySelectorAll('.crow').forEach((b) => {
    b.onclick = () => { pop.hidden = true; if (b.dataset.t === 'game') switchTo('game'); else newChat(b.dataset.t); };
  });
}
$('chatName').onclick = (e) => { e.stopPropagation(); const p = $('chatPop'); if (!p.hidden && p.dataset.mode === 'list') { p.hidden = true; return; } p.hidden = false; listPop(); };
$('chatPlus').onclick = (e) => { e.stopPropagation(); const p = $('chatPop'); if (!p.hidden && p.dataset.mode === 'new') { p.hidden = true; return; } p.hidden = false; newPop(); };
document.addEventListener('click', (e) => { if (!e.target.closest('#chatPop')) $('chatPop').hidden = true; });

const put = (c, node) => {
  c.el.appendChild(node);
  c.el.classList.toggle('is-full', c.el.scrollHeight > c.el.clientHeight);
  return node;
};
const agentSay = (c, html) => put(c, E('div', 'msg msg--crew',
  `<span class="av"><img src="${AGENTS[c.type].img}" alt=""></span><span class="txt"><b>${AGENTS[c.type].who}</b><p>${html}</p></span>`));
const youSay = (c, text) => put(c, E('div', 'msg msg--user', `<span class="bub">${text}</span>${ACTS}`));

function newChat(type) {
  const n = chats.filter((c) => c.type === type).length + 1;
  const el = E('div', 'thread side is-on');
  $('chat').insertBefore(el, $('composer'));
  const c = { id: `${type}${n}`, type, title: n > 1 ? `${AGENTS[type].tag} ${n}` : { assets: 'Bedroom assets', design: 'Level ideas', biz: 'Launch plan' }[type], el, unread: false, busy: false };
  chats.push(c);
  switchTo(c.id);
  agentSay(c, AGENTS[type].hello);
  const chips = put(c, E('div', 'chips msg', AGENTS[type].chips.map((t) => `<button>${t}</button>`).join('')));
  chips.querySelectorAll('button').forEach((b) => { b.onclick = () => { chips.remove(); sendIn(c, b.textContent); }; });
}
function switchTo(id) {
  current = id;
  chats.forEach((c) => {
    c.el.classList.toggle('is-off', c.id !== id);
    if (c.id !== 'game') c.el.classList.toggle('is-on', c.id === id);
  });
  chatOf(id).unread = false;
  $('input').focus();
  paintHead();
}

const PART = [['robot', 'robot-pal'], ['dino', 'dino-suit'], ['truck', 'truck'], ['ball', 'basketball'], ['bear', 'teddy'], ['teddy', 'teddy'],
  ['star', 'stars'], ['block', 'toy-blocks'], ['book', 'book-stacks'], ['pencil', 'pencils'], ['kid', 'backpacker'], ['dresser', 'dresser']];
function sendIn(c, text) {
  if (!text.trim()) return;
  youSay(c, text);
  if (c.type === 'game') {
    setTimeout(() => crewSay('planner', 'Got it — I’ll fold that into the next version.'), 900);
    return;
  }
  c.busy = true;
  c.last = `${AGENTS[c.type].who} is working…`;
  const th = put(c, E('div', 'think msg', `<i></i>${{ assets: 'Modelling it…', design: 'Thinking it through…', biz: 'Looking at the numbers…' }[c.type]}`));
  paintHead();
  setTimeout(() => {
    th.remove();
    c.busy = false;
    if (c.type === 'assets') {
      const hit = PART.find(([k]) => text.toLowerCase().includes(k));
      const name = text.replace(/^(a|an|the)\s+/i, '').replace(/^\w/, (m) => m.toUpperCase());
      agentSay(c, 'Here’s a first pass. It’s sized for the bedroom and ready to drop in.');
      const card = put(c, E('div', 'acard2 msg', `<img src="assets/boy-part-${hit ? hit[1] : 'toy-blocks'}.jpg" alt="">
        <div><b>${name}</b><span class="row"><button class="again">Regenerate</button><button class="go">Add to scene</button></span></div>`));
      card.querySelector('.go').onclick = (e) => {
        e.target.textContent = 'Added ✓'; e.target.disabled = true;
        toast(`${name} added to the scene`);
      };
      c.last = `Made: ${name}`;
    } else if (c.type === 'design') {
      agentSay(c, 'Here’s how I’d do it:');
      put(c, E('ul', 'bul msg', `<li><b>Where</b> — behind the dresser, a crawl-space into the attic</li>
        <li><b>Why go</b> — the last two stars are up there, in the dark</li><li><b>Cost</b> — one room, ~120 credits, ~4 min more</li>`));
      const hand = put(c, E('button', 'hand msg', 'Send to the Game chat →'));
      hand.onclick = () => {
        hand.textContent = 'Sent ✓'; hand.disabled = true;
        userSay(`From Level ideas: ${text}`);
        setTimeout(() => crewSay('planner', 'On it — I’ve added it to the plan for the next version.'), 900);
        toast('Sent to the Game chat');
      };
      c.last = 'An idea is ready to hand over';
    } else {
      agentSay(c, 'My read:');
      put(c, E('ul', 'bul msg', `<li><b>Audience</b> — 8–12-year-olds, and parents who play with them</li>
        <li><b>Price</b> — free to play; a $2.99 “more rooms” pack later</li><li><b>Launch</b> — a 20-second clip of the kid climbing the blocks</li>`));
      c.last = 'Audience, price and launch — ready';
    }
    if (current !== c.id) c.unread = true;
    paintHead();
  }, 2400);
}
function toast(t) {
  const n = E('div', 'toast', t);
  scene().appendChild(n);
  setTimeout(() => n.remove(), 2200);
}
const sendNow = () => {
  const box = $('input');
  const text = box.textContent;
  const c = chatOf(current);
  if (c.type === 'game' && gameBusy()) return;
  box.textContent = '';
  sendIn(c, text);
};
$('input').addEventListener('input', (e) => { if (!e.target.textContent.trim()) e.target.innerHTML = ''; });
$('input').addEventListener('keydown', (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendNow(); } });
$('send').onclick = sendNow;
// keep the header's busy spinner honest while the crew works
setInterval(() => { if (!$('chatPop').hidden && $('chatPop').dataset.mode === 'list') listPop(); }, 1000);

// ── director (demo only) ───────────────────────────────────────────
const BEATS = ['Landing', 'Login', 'Wana', 'Chat', 'Scene', 'Crew + Plan', 'Planner works', 'Plan ready', 'Overview', 'Game assets', 'Build', 'Version 1.0', 'Play'];
function paintDirector(n) {
  const d = $('director');
  if (Q.has('clean')) { d.classList.add('is-hidden'); return; }
  d.innerHTML = BEATS.map((b, i) => `<button class="${i + 1 === n ? 'is-on' : ''}" data-n="${i + 1}">${i + 1} ${b}</button>`).join('')
    + '<button data-n="1">↺ Replay</button>';
  d.querySelectorAll('button').forEach((b) => { b.onclick = () => play(+b.dataset.n); });
}

play(+(Q.get('step') || 1));
})();
