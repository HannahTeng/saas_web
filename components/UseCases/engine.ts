// @ts-nocheck
// Plays the use-case scenes: the agent types, clicks and navigates inside rebuilt client screens.
// Each scene fast-forwards to its finished state first (so it reads complete at rest), then loops while visible.
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const STOP = new Error('stopped');
let STATE = { dead: false };
let RM = false;

const n0 = v => Math.round(v).toLocaleString('en-US');



/* fit 1200x700 scenes like a photograph */
const CW = 1200, CH = 790;

class Demo{
  constructor(root, sc){
    this.root = root; this.sc = sc; this.st = STATE; this.gen = 0; this.visible = false; this.instant = false;
    this.items = $$('.strip li', root); this.cap = $('.cap', root);
    this.fit = $('.fit', root); this.canvas = $('.canvas', root); this.cursor = $('.cursor', root);
    new IntersectionObserver(e => this.visible = e[0].isIntersecting, {threshold:.3}).observe($('.scene', root));
  }
  async wait(ms){ if (this.instant) return; const g = this.gen; await sleep(ms); if (this.st.dead || g !== this.gen) throw STOP; while (!this.visible){ await sleep(250); if (this.st.dead || g !== this.gen) throw STOP; } }
  step(i, cap){
    if (this.onStep) this.onStep(i, this.items.length);
    this.items.forEach((s,j) => { s.classList.toggle('done', j < i); s.classList.toggle('active', j === i); });
    if (cap === undefined) return;
    if (this.instant){ this.cap.textContent = cap; return; }
    this.cap.classList.add('fade'); setTimeout(() => { this.cap.textContent = cap; this.cap.classList.remove('fade'); }, 250);
  }
  async type(el, text, cps = 28){
    if (this.instant){ el.textContent = text; return; }
    el.textContent = '';
    for (const ch of text){ el.textContent += ch; await this.wait(1000/cps + Math.random()*35); }
  }
  async typeIn(el, text, cps){ el.classList.add('v','f'); el.innerHTML = '<span></span><i class="caret"></i>'; await this.type(el.firstChild, text, cps); $('.caret', el)?.remove(); el.classList.remove('f'); }
  hideCursor(){ this.cursor.style.opacity = 0; }
  async to(el, ox = .5, oy = .55){
    if (this.instant) return;
    const c = this.canvas.getBoundingClientRect(), r = el.getBoundingClientRect(), k = c.width / CW || 1;
    this.cursor.style.opacity = 1;
    this.cursor.style.transform = `translate(${(r.left-c.left+r.width*ox)/k}px,${(r.top-c.top+r.height*oy)/k}px)`;
    await this.wait(900);
  }
  async click(el){
    if (this.instant) return;
    this.cursor.classList.remove('click'); void this.cursor.offsetWidth; this.cursor.classList.add('click');
    el.classList.add('pressed'); await this.wait(170); el.classList.remove('pressed'); await this.wait(120);
  }
  async tap(el, ox, oy){ await this.to(el, ox, oy); await this.click(el); }
  end(box){ box.scrollTo({top: box.scrollHeight, behavior: this.instant ? 'auto' : 'smooth'}); }
  async run(){
    this.instant = true; this.root.classList.add('instant');
    this.sc.reset(this); await this.sc.play(this); this.step(99); this.hideCursor();
    this.instant = false;
    requestAnimationFrame(() => requestAnimationFrame(() => { this.root.classList.remove('instant'); $$('.ja-chat,.im-body,.as-b', this.root).forEach(b => b.scrollTop = b.scrollHeight); }));
    if (RM) return;
    for(;;){
      while (!this.visible){ await sleep(250); if (this.st.dead) return; }
      await sleep(1200);
      this.sc.reset(this); this.hideCursor();
      await this.wait(600);
      await this.sc.play(this);
      await this.wait(4500);
    }
  }
}

/* ============ CASE · warehouse data (real Flowact desktop assistant) ============ */
const JS = [
  {k:'WH-USCA03', c:'#4E79A7', v:[1100,820,560,700,760,2250,1700,60,1900,1150,1650,5000,1700,1420,60,2900,4420,1240,1420,1400,1350,0,0,0,0,0,0,0,0]},
  {k:'WH-USGA01', c:'#F28E2B', v:[5950,1750,1700,1650,1700,5950,1020,1950,2000,2050,2260,8850,2780,2780,1900,1980,6650,3100,2480,2460,2650,7200,7200,7200,7200,7200,7200,7200,7200]},
  {k:'WH-USNJ01', c:'#59A14F', v:[3780,1400,1450,1650,1550,4750,1700,1660,1600,1660,1660,5230,3020,2010,2050,2050,6150,150,1250,1300,1350,3800,3800,3800,3800,3800,3800,3800,3800]},
  {k:'WH-USCA01', c:'#E15759', v:[5240,1320,1340,1080,1240,4050,1380,1180,1180,1210,1260,4520,1360,1220,1220,1200,3780,880,1100,850,950,0,0,0,0,0,0,0,0]},
  {k:'WH-USAZ01', c:'#76B7B2', v:[0,160,40,40,40,90,40,40,40,40,40,120,10,10,60,20,80,20,20,20,10,0,0,0,0,0,0,0,0]},
];
const DAYS = 21;
function jaChart(){
  const x0 = 36, x1 = 588, yb = 150, yt = 14, max = 9000, X = i => x0 + i*(x1-x0)/(DAYS-1), Y = v => yb - v/max*(yb-yt);
  let s = '';
  [0,2250,4500,6750,9000].forEach(v => s += `<line class="gl" x1="${x0}" x2="${x1}" y1="${Y(v)}" y2="${Y(v)}"/><text x="${x0-5}" y="${Y(v)+3}" text-anchor="end">${v.toLocaleString('en-US')}</text>`);
  for (let i = 0; i < DAYS; i += 2){ const d = new Date(2026,7,4+i); s += `<text x="${X(i)}" y="${yb+13}" text-anchor="middle">${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}</text>`; }
  JS.forEach(w => {
    const v = w.v.slice(0,DAYS);
    s += `<path class="ln" pathLength="1" stroke="${w.c}" d="${v.map((y,i)=>(i?'L':'M')+X(i).toFixed(1)+' '+Y(y).toFixed(1)).join(' ')}"/>`;
    s += v.map((y,i)=>`<circle class="dt" cx="${X(i).toFixed(1)}" cy="${Y(y).toFixed(1)}" r="1.8" fill="${w.c}"/>`).join('');
  });
  return `<svg viewBox="0 0 600 170" role="img" aria-label="Daily B2C outbound orders by warehouse">${s}</svg>`;
}
const ja = {
  ph:'<span class="ph">Ask anything… (Enter to send, Shift+Enter for a new line)</span>',
  reset(d){ const r = d.root; $('#ja-chat', r).innerHTML = ''; $('#ja-tx', r).innerHTML = this.ph; $('#ja-send', r).classList.remove('on'); $('#ja-cost', r).textContent = '$8.0189'; d.step(-1); },
  add(d, html){ const c = $('#ja-chat', d.root); c.insertAdjacentHTML('beforeend', html); d.end(c); return c.lastElementChild; },
  async ask(d, q){
    const r = d.root, tx = $('#ja-tx', r);
    await d.to(tx, .3); await d.click(tx);
    tx.innerHTML = '<span></span><i class="caret"></i>'; $('#ja-send', r).classList.add('on');
    await d.type(tx.firstChild, q);
    await d.tap($('#ja-send', r)); tx.innerHTML = this.ph; $('#ja-send', r).classList.remove('on');
    this.add(d, '<div class="jw r">You</div>'); this.add(d, `<div class="ju">${q}</div>`);
  },
  async play(d){
    const r = d.root;
    d.step(0, 'Operations asks one question in the desktop assistant.');
    await this.ask(d, 'How much of the Christmas stock has arrived?');
    const think = this.add(d, '<div class="jbox"><span class="spin"></span>Thinking…<span class="s">1s</span></div>');
    await d.wait(800);

    d.step(1, 'The agent signs in to the client\'s OMP and pulls the data itself.');
    think.remove();
    this.add(d, '<div class="jbox">▸ Querying…</div>');
    const tr = this.add(d, '<div class="jtrace"></div>');
    const lines = [
      ['x','Blocked','curl -s -o /dev/null -w "%{http_code}" --max-time 8 https://omp.client-wms.cn'],
      ['','Run','cd ~/agent/client/03-Code/client-logistics && python omp_login.py'],
      ['','Note','Login complete. Pulling the last 30 days again.'],
      ['','Run','cd ~/agent/client/03-Code/client-logistics && python export_inbound.py --season christmas --from 2026-08-03 --to 2026-08-31'],
      ['','Note','Export is an async queue job, polling. 5–10 minutes; I\'ll tell you when the data is in.'],
      ['','Run','cd ~/agent/client/03-Code/client-logistics && python reconcile.py --types linehaul,transfer,b2c_return'],
    ];
    for (const [c,l,t] of lines){ tr.insertAdjacentHTML('beforeend', `<div><b class="${c}">${l}</b><code class="${l==='Note'?'n':''}">${t}</code></div>`); d.end($('#ja-chat', r)); await d.wait(520); }
    $('#ja-cost', r).textContent = '$8.2417';

    d.step(2, 'It states exactly how the number was counted.');
    this.add(d, '<div class="jw">Assistant</div>');
    this.add(d, `<div class="jans">Christmas stock arrived: <b>113,190 units</b> shelved (15,577 cartons).
      <table><thead><tr><th>Metric</th><th>Count</th></tr></thead><tbody>
      <tr><td>Planned receipt</td><td>113,987 units / 15,691 cartons</td></tr>
      <tr><td>Received</td><td>113,479 units / 15,602 cartons</td></tr>
      <tr><td>Shelved (good)</td><td><b>113,190 units / 15,577 cartons</b></td></tr>
      <tr><td>Shelf rate</td><td>99.75%</td></tr>
      <tr><td>Awaiting put-away</td><td>289 units, 288 still in progress (not loss)</td></tr></tbody></table>
      Mostly in <b>WH-USCA03</b> (74.45%) and <b>WH-USCA01</b> (19.56%); both are nearly done.
      <div class="d">Definition: inbound export · created 2026-08-03 to 08-31 · 4 warehouses · line-haul, transfer and B2C return inbound · season = Christmas tag · count = good units shelved, cross-dock excluded</div></div>`);
    await d.wait(2200);

    d.step(3, 'Ask for a chart, get the chart. Save it as a PDF.');
    await this.ask(d, 'Chart each warehouse\'s daily B2C outbound orders');
    const th = this.add(d, '<div class="jbox"><span class="spin"></span>Thinking…<span class="s">2s</span></div>');
    await d.wait(900); th.remove();
    const ch = this.add(d, `<div class="jchart"><div class="ch"><b>Daily B2C outbound orders by warehouse</b><small>Data as of 2026-08-24</small></div>${jaChart()}
      <div class="jleg">${JS.map(w=>`<span><i style="background:${w.c}"></i>${w.k}</span>`).join('')}</div>
      <div class="jdef">Definition: 5 owned warehouses · B2C sales outbound · by completion date · 2026-08-04 to 08-24</div>
      <div class="jfoot"><span>Open in new window</span><span>Download</span><span class="pdf">Save as PDF</span></div></div>`);
    if (d.instant) ch.classList.add('draw'); else requestAnimationFrame(() => requestAnimationFrame(() => ch.classList.add('draw')));
    await d.wait(2000);
    d.end($('#ja-chat', r)); await d.wait(500);
    const pdf = $('.pdf', ch); await d.tap(pdf);
    pdf.textContent = 'Saved · B2C-outbound.pdf'; pdf.classList.add('ok');
    $('#ja-cost', r).textContent = '$8.4739';
    await d.wait(500); d.hideCursor(); d.step(4);
  }
};

/* ============ CASE · dispatch (real dispatch agent + client ERP + iMessage) ============ */
const TRUCKS = [
  {wh:'1001 Private WH', zip:'07064', cbm:99.7, lb:'28,314 lb / 12,843 kg', n:8, ct:'DSZU4815492, WHSU5812837', bl:'9504015961, WHL013G531276', wb:'MHDF2509100015, MDTB2604140023'},
  {wh:'1100 Private WH', zip:'91761, 08831', cbm:90.8, lb:'29,837 lb / 13,534 kg', n:10, ct:'WHSU9016671, CBHU9485318', bl:'WHL111G535047, 9506680426', wb:'MZGS2604210011, MZGB2604020013'},
  {wh:'1100 Private WH', zip:'91761, 08831', cbm:90.1, lb:'27,381 lb / 12,420 kg', n:5, ct:'DRYU4563429, TCKU6014583', bl:'2319277720, ZIMUSHH32163981', wb:'MZGB2601260012, MZGB2605110014'},
  {wh:'1100 Private WH', zip:'91761, 08831', cbm:93.7, lb:'32,826 lb / 14,890 kg', n:4, ct:'EGSU8023079, TGBU8699317', bl:'EGLV149600913816, 4055112953', wb:'MZGS2603130011, MZGB2604070020'},
];
const dp = {
  ph:'<span class="ph">iMessage</span>',
  reset(d){
    const r = d.root;
    $('#dp-login', r).classList.add('on'); $('#dp-work', r).classList.remove('on'); $('#dp-board', r).classList.remove('on');
    $('#dp-u .v', r).className = 'v ph'; $('#dp-u .v', r).textContent = 'Enter account';
    $('#dp-p .v', r).className = 'v ph'; $('#dp-p .v', r).textContent = 'Enter password';
    $('#dp-log', r).innerHTML = ''; $('#dp-grid', r).innerHTML = ''; $('#dp-toast', r).classList.remove('in');
    $('#m-body', r).innerHTML = '<div class="im-ts"><b>iMessage</b><br>Today 6:58 AM</div>'; $('#m-tx', r).innerHTML = this.ph; $('#m-snd', r).classList.remove('on');
    d.step(-1);
  },
  async msg(d, html, cls = 'in'){
    const b = $('#m-body', d.root);
    if (cls.startsWith('in') && !d.instant){ b.insertAdjacentHTML('beforeend', '<div class="typing"><i></i><i></i><i></i></div>'); d.end(b); await d.wait(1000); b.lastElementChild.remove(); }
    b.insertAdjacentHTML('beforeend', `<div class="bub ${cls}">${html}</div>`); d.end(b);
  },
  async toast(d, t){ const e = $('#dp-toast', d.root); $('span', e).textContent = t; e.classList.add('in'); await d.wait(1400); if (!d.instant) e.classList.remove('in'); },
  async field(d, el, text){ const v = $('.v', el); await d.tap(el, .4); el.classList.add('f'); v.className = 'v'; v.textContent = ''; await d.type(v, text, 26); el.classList.remove('f'); },
  async play(d){
    const r = d.root;
    d.step(0, '27 containers arrived overnight. The agent texts the dispatcher.');
    await this.msg(d, 'Morning Mike. 27 containers arrived overnight. Building full truckloads in the ERP now.');
    await d.wait(500);

    d.step(1, 'It signs in to the client\'s own ERP.');
    await this.field(d, $('#dp-u', r), 'dispatch.agent');
    await this.field(d, $('#dp-p', r), '••••••••••');
    await d.tap($('#dp-sign', r));
    $('#dp-login', r).classList.remove('on'); $('#dp-work', r).classList.add('on'); d.hideCursor();
    const log = $('#dp-log', r);
    const steps = [
      ['Reading arrived containers','<code>27 containers · 27 B/Ls</code>'],
      ['Matching waybills to containers','<code>waybill-level grouping · drayage only</code>'],
      ['Saving to local database','<code>sqlite · dispatch_2026-10-01.db</code>'],
      ['Packing by destination at 100 CBM','<code>4 full trucks · 0 left over</code>'],
    ];
    for (const [a,b] of steps){ log.insertAdjacentHTML('beforeend', `<div><span class="spin"></span>${a} ${b}</div>`); await d.wait(700); log.lastElementChild.classList.add('ok'); }
    await d.wait(400);

    d.step(2, 'Every truck packed to 100 CBM, grouped by destination, exported to Excel.');
    $('#dp-work', r).classList.remove('on'); $('#dp-board', r).classList.add('on');
    const g = $('#dp-grid', r);
    for (const t of TRUCKS){
      g.insertAdjacentHTML('beforeend', `<div class="dpc"><h5>${t.wh} <small>· ZIP ${t.zip}</small></h5>
        <div class="dpr"><span>CBM</span><span class="cbm"><span class="bar"><i data-w="${t.cbm}"></i></span><b>${t.cbm} / 100 (${Math.round(t.cbm)}%)</b></span></div>
        <div class="dpr"><span>Weight</span><span class="v">${t.lb}</span></div>
        <div class="dpr"><span>Ctrs</span><span class="v">${t.ct} …(${t.n} total)</span></div>
        <div class="dpr"><span>B/L</span><span class="v">${t.bl} …(${t.n} total)</span></div>
        <div class="dpr"><span>Waybill</span><span class="v">${t.wb} …</span></div>
        <div class="dpf"><span class="tg">Bookable</span><span class="vd">View all details</span><span class="xl">Export Excel</span></div></div>`);
      const bar = $('.dpc:last-child .bar i', g);
      if (d.instant) bar.style.width = t.cbm + '%'; else requestAnimationFrame(() => requestAnimationFrame(() => bar.style.width = t.cbm + '%'));
      await d.wait(380);
    }
    await d.wait(700);
    const xl = $('.dpc .xl', g); await d.tap(xl);
    await this.toast(d, 'Dispatch_2026-10-01.xlsx exported · 4 trucks');
    d.hideCursor();

    d.step(3, 'Nothing is booked until the dispatcher says yes.');
    await this.msg(d, '4 full trucks ready:\n1001 → 07064 · 99.7 CBM\n1100 → 91761 · 90.8 CBM\n1100 → 91761 · 90.1 CBM\n1100 → 91761 · 93.7 CBM\nAll under weight. Book all 4?');
    await this.msg(d, '<i>XLSX</i><span>Dispatch_2026-10-01.xlsx<small>4 trucks · 27 containers</small></span>', 'in file');
    await d.wait(800);
    const mt = $('#m-tx', r); mt.innerHTML = '<span></span><i class="caret"></i>'; $('#m-snd', r).classList.add('on');
    await d.type(mt.firstChild, 'Yes, book all 4', 14); await d.wait(300);
    mt.innerHTML = this.ph; $('#m-snd', r).classList.remove('on');
    await this.msg(d, 'Yes, book all 4', 'out gap');
    $('#m-body', r).insertAdjacentHTML('beforeend', '<div class="im-del">Delivered</div>');
    await d.wait(600);
    for (const tg of $$('.dpf .tg', r)){ tg.textContent = 'Booked'; tg.classList.add('bk'); await d.wait(200); }
    await this.msg(d, 'Booked. Pickup confirmations will come to this thread.');
    d.step(4);
  }
};

/* ============ CASE · clinical (client EDC + embedded assistant) ============ */
const LABS = [
  ['1018','S03','Wk 16','2026-03-02','2026-03-02','Chem, Hem','Verified',0],
  ['1042','S03','Wk 16','2026-03-04','','Chem, Hem','Entered',1],
  ['1063','S01','Wk 12','2026-02-11','2026-02-11','Chem','Verified',0],
  ['1077','S02','Wk 12','2026-02-13','2026-02-14','Chem, Hem','Verified',0],
  ['1107','S02','Wk 20','2026-04-01','','Chem','Entered',1],
  ['1115','S01','Wk 16','2026-03-09','2026-03-09','Chem, Hem','Verified',0],
  ['1131','S03','Wk 16','2026-03-12','','Chem, Hem','Entered',1],
  ['1144','S02','Wk 12','2026-02-18','2026-02-18','Chem','Verified',0],
  ['1152','S01','Wk 8','2026-01-20','','Chem','Entered',0],
];
const edcRows = rs => rs.map(l => `<tr data-s="${l[0]}"><td>${l[0]}</td><td>${l[1]}</td><td>${l[2]}</td><td>${l[3]}</td><td class="${l[4]?'':'miss'}">${l[4]||'—'}</td><td>${l[5]}</td><td>${l[6]}</td></tr>`).join('');
const edc = {
  ph:'<span class="ph">Ask about this study…</span>',
  reset(d){
    const r = d.root;
    $('#e-rows', r).innerHTML = edcRows(LABS); $('#e-cnt', r).textContent = 'Labs listing · 412 rows';
    $('#e-chips', r).innerHTML = ''; $('#e-pop', r).classList.remove('open'); $('#e-r2', r).style.display = 'none';
    const v1 = $('#e-v1', r); v1.textContent = 'Value'; v1.classList.remove('v','f');
    $('#e-rec', r).classList.remove('in'); $('#e-q', r).classList.remove('in'); $('#e-msg', r).textContent = ''; $('#e-qn', r).classList.remove('in');
    $('#a-b', r).innerHTML = ''; $('#a-tx', r).innerHTML = this.ph;
    d.step(-1);
  },
  add(d, html){ const b = $('#a-b', d.root); b.insertAdjacentHTML('beforeend', html); d.end(b); return b.lastElementChild; },
  async play(d){
    const r = d.root, q = 'Which participants are missing a lab date after week 12?';
    d.step(0, 'The data manager asks in plain English, inside the platform.');
    const tx = $('#a-tx', r); tx.innerHTML = '<span></span><i class="caret"></i>';
    await d.to(tx, .3); await d.type(tx.firstChild, q);
    await d.tap($('#a-send', r)); tx.innerHTML = this.ph;
    this.add(d, `<div class="au">${q}</div>`);
    const l1 = this.add(d, `<div class="al"><span class="spin"></span>Filtering Labs listing</div>`);
    await d.wait(400);

    d.step(1, 'It uses the platform\'s own filters: visit after week 12, lab date empty.');
    await d.tap($('#e-filter', r)); $('#e-pop', r).classList.add('open'); await d.wait(400);
    const v1 = $('#e-v1', r); await d.tap(v1, .3); await d.typeIn(v1, 'Week 12', 22);
    await d.tap($('#e-add', r)); $('#e-r2', r).style.display = ''; await d.wait(400);
    await d.tap($('#e-apply', r)); $('#e-pop', r).classList.remove('open');
    $('#e-chips', r).innerHTML = '<span>Visit is after Week 12</span><span>Lab date is empty</span>';
    $('#e-rows', r).innerHTML = edcRows(LABS.filter(l => l[7]));
    $('#e-cnt', r).textContent = 'Labs listing · 3 of 412 rows';
    l1.classList.add('ok'); l1.lastChild.textContent = 'Filtered 412 rows to 3';
    await d.wait(800);

    d.step(2, 'Before answering, it opens the source record and the audit trail.');
    const l2 = this.add(d, `<div class="al"><span class="spin"></span>Opening source records</div>`);
    await d.tap($('#e-rows tr', r), .2);
    $('#e-rec', r).classList.add('in'); await d.wait(1800);
    await d.tap($('#e-rec .dr-h span', r)); $('#e-rec', r).classList.remove('in');
    l2.classList.add('ok'); l2.lastChild.textContent = 'Checked 3 source records';
    await d.wait(400);

    d.step(3, 'It drafts the queries. The team decides what goes to sites.');
    $('#e-q', r).classList.add('in'); await d.wait(500);
    const msg = $('#e-msg', r); await d.tap(msg, .3); msg.classList.add('f');
    await d.type(msg, 'Lab date is missing for a visit after week 12. Please enter the collection date or confirm the sample was not collected.', 60);
    msg.classList.remove('f');
    await d.tap($('#e-save', r)); $('#e-q', r).classList.remove('in'); $('#e-qn', r).classList.add('in');
    d.hideCursor();
    this.add(d, `<div class="aa"><b>3 participants</b> have a visit after week 12 with no lab date: <b>1042</b>, <b>1107</b>, <b>1131</b>. 1152 is excluded because its visit is week 8. I drafted 3 queries; they are waiting in Queries for your review.
      <div class="cites"><span>Labs #214</span><span>Labs #388</span><span>Labs #402</span><span>Audit · 1042</span></div></div>`);
    await d.wait(400); d.step(4);
  }
};


const scripts = { ja, dp, edc };

/**
 * Product showcase: one stage, one scene at a time.
 * Every scene first renders its finished state (complete at rest); once the stage is on screen
 * the active scene plays, then hands over to the next. select(i) jumps and keeps auto-advancing.
 */
/* Phones: instead of shrinking the whole scene, a square "camera" frames where the agent is working. */
const CAMERA = {
  ja: [{ x: 410, y: 0, s: 640 }, { x: 410, y: 0, s: 640 }, { x: 410, y: 0, s: 640 }, { x: 410, y: 0, s: 640 }],
  dp: [{ x: 560, y: 30, s: 640 }, { x: 300, y: 100, s: 640 }, { x: 60, y: 0, s: 790 }, { x: 560, y: 30, s: 640 }],
  edc: [{ x: 560, y: 40, s: 550 }, { x: 140, y: 30, s: 560 }, { x: 300, y: 30, s: 560 }, { x: 500, y: 30, s: 580 }],
};
const PHONE = 640;

export function startShowcase(root, { onActive, onProgress }) {
  STATE = { dead: false };
  const mine = STATE;
  RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const arts = $$('article.demo', root);
  const ros = [];
  const shots = arts.map(() => 0);
  const fits = arts.map((a, idx) => {
    const f = $('.fit', a), c = $('.canvas', a), cam = CAMERA[a.dataset.demo];
    const go = () => {
      const w = f.clientWidth;
      if (w && w < PHONE && cam) {
        const r = cam[Math.max(0, Math.min(cam.length - 1, shots[idx]))], k = w / r.s;
        f._k = k; f.classList.add('cam');
        c.style.transform = `scale(${k}) translate(${-r.x}px, ${-r.y}px)`; f.style.height = w + 'px';
      } else {
        const k = w / CW; f._k = k; f.classList.remove('cam');
        c.style.transform = `scale(${k})`; f.style.height = CH * k + 'px';
      }
    };
    go(); const ro = new ResizeObserver(go); ro.observe(f); ros.push(ro);
    return go;
  });
  const demos = arts.map((a) => new Demo(a, scripts[a.dataset.demo]));
  let active = 0, started = false;
  demos.forEach((d, i) => {
    d.onStep = (s, n) => {
      shots[i] = s < 0 ? 0 : Math.min(n - 1, s); fits[i]();
      if (i === active) onProgress(s < 0 ? 0 : Math.min(1, (s + 1) / n));
    };
  });

  const settle = async (d) => {
    d.instant = true; d.root.classList.add('instant');
    d.sc.reset(d); await d.sc.play(d); d.step(99); d.hideCursor(); d.instant = false;
    requestAnimationFrame(() => requestAnimationFrame(() => {
      d.root.classList.remove('instant');
      $$('.ja-chat,.im-body,.as-b', d.root).forEach((b) => (b.scrollTop = b.scrollHeight));
    }));
  };

  function select(i, autoplay) {
    if (mine.dead) return;
    active = i; onActive(i);
    arts.forEach((a, j) => { a.hidden = j !== i; });
    requestAnimationFrame(() => fits.forEach((g) => g()));
    demos.forEach((d) => d.gen++);
    if (RM || !autoplay) { onProgress(1); return; }
    const d = demos[i], g = d.gen;
    (async () => {
      try {
        d.sc.reset(d); d.hideCursor(); onProgress(0);
        await d.wait(500);
        await d.sc.play(d); d.step(99); onProgress(1);
        await d.wait(2600);
        if (d.gen === g && active === i) select((i + 1) % demos.length, true);
      } catch (e) { /* interrupted by another selection or unmount */ }
    })();
  }

  let io;
  (async () => {
    for (const d of demos) await settle(d);
    if (mine.dead) return;
    select(0, false);
    if (RM) return;
    io = new IntersectionObserver((es) => { if (es[0].isIntersecting && !started) { started = true; select(active, true); } }, { threshold: 0.35 });
    io.observe(root);
  })();

  const onPrefill = (e) => {
    const a = e.target.closest('.prefill'); if (!a) return;
    e.preventDefault();
    window.dispatchEvent(new CustomEvent('flowact:prefill', { detail: a.dataset.text }));
  };
  root.addEventListener('click', onPrefill);

  return {
    select: (i) => { started = true; select(i, true); },
    destroy: () => { mine.dead = true; demos.forEach((d) => d.gen++); ros.forEach((r) => r.disconnect()); io && io.disconnect(); root.removeEventListener('click', onPrefill); },
  };
}
