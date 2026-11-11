(() => {
  'use strict';

  /* ==========================================================
     الإعدادات — غيّر الكلام والتاريخ من هنا بس
     ========================================================== */
  const CFG = {
    from: 'أحمد',
    day: 22,
    month: 11,                 // نوفمبر
    hour: '١٢:٠٠ بالليل',
    place: 'هنا',
    note: 'ماتناميش بدري، أنا صاحي.',
    holdMs: 4000,              // مدة الضغط المطلوبة بالملي ثانية

    title: 'كل سنة وإنت طيبة يا حور، وكل سنة وإنت جميلة ومميزة زي ما إنت ❤️',
    paragraphs: [
      'مش عارف أقولك إيه في يوم زي ده، بس أتمنى من قلبي إن سنتك الجديدة تكون مليانة فرحة وراحة بال، وإن كل حاجة نفسك فيها تتحقق، وإن ضحكتك تفضل منورة أيامك دايما.',
      'يمكن مش من حقي أكون أقرب شخص ليكي دلوقتي، ويمكن مش عارف الأيام لسه مخبيالنا ايه، بس أكيد إنت بالنسبالي مش مجرد شخص عادي، وليكي مكانة مميزة مش محتاجة مناسبة عشان أقولها.',
      'أتمنى أشوفك دايما مبسوطة، ودايما في أحسن حال، وتكون السنة دي بداية لكل حاجة حلوة تستاهليها.'
    ],
    closing: 'عيد ميلاد سعيد يا حور، ويا رب أشوفك دايما سعيدة.. ❤️✨'
  };

  /* ---------- أدوات ---------- */
  const $ = (id) => document.getElementById(id);
  const ar = (s) => String(s).replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[d]);
  const DAYS = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  const MONTHS = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
  const rnd = (a, b) => a + Math.random() * (b - a);

  /* أقرب تاريخ ميلاد جاي (بيتحسب تلقائي كل سنة) */
  function targetDate() {
    const now = new Date();
    let y = now.getFullYear();
    const endOfDay = new Date(y, CFG.month - 1, CFG.day, 23, 59, 59);
    if (now > endOfDay) y += 1;
    return new Date(y, CFG.month - 1, CFG.day);
  }
  const t = targetDate();
  const dateLabel = `${DAYS[t.getDay()]} ${ar(t.getDate())} ${MONTHS[t.getMonth()]}`;

  /* ---------- تعبئة النصوص ---------- */
  $('fromLine').textContent = `من ${CFG.from}`;
  $('vDay').textContent = dateLabel;
  $('vHour').textContent = CFG.hour;
  $('vPlace').textContent = CFG.place;
  $('vNote').textContent = CFG.note;
  $('fTitle').textContent = CFG.title;
  $('fClosing').textContent = CFG.closing;
  $('fDate').textContent = `${dateLabel} · ${CFG.hour}`;
  CFG.paragraphs.forEach((txt) => {
    const p = document.createElement('p');
    p.className = 'reveal';
    p.textContent = txt;
    $('fParas').appendChild(p);
  });

  /* ---------- نجوم الخلفية والكارت ---------- */
  function sprinkle(host, n) {
    for (let i = 0; i < n; i++) {
      const s = document.createElement('i');
      const size = rnd(1, 2.4);
      s.className = 'tw';
      s.style.cssText =
        `left:${rnd(0, 100)}%;top:${rnd(0, 100)}%;width:${size}px;height:${size}px;` +
        `animation-delay:${-rnd(0, 6)}s;animation-duration:${rnd(3, 7)}s`;
      host.appendChild(s);
    }
  }
  sprinkle($('bgStars'), 70);
  sprinkle($('cardStars'), 34);

  /* ---------- الساعة ---------- */
  const NS = 'http://www.w3.org/2000/svg';
  const ticks = $('ticks');
  for (let i = 0; i < 60; i++) {
    const big = i % 15 === 0;
    const hr = i % 5 === 0;
    const len = big ? 14 : hr ? 8 : 4;
    const w = big ? 3 : hr ? 2 : 1;
    const l = document.createElementNS(NS, 'line');
    l.setAttribute('x1', 100);
    l.setAttribute('x2', 100);
    l.setAttribute('y1', 12);
    l.setAttribute('y2', 12 + len);
    l.setAttribute('stroke-width', w);
    l.setAttribute('class', 'tk');
    l.setAttribute('transform', `rotate(${i * 6} 100 100)`);
    if (!hr) l.style.opacity = '.6';
    ticks.appendChild(l);
  }
  const hHour = $('hHour'), hMin = $('hMin'), hSec = $('hSec');
  const setRot = (el, a) => el.setAttribute('transform', `rotate(${a} 100 100)`);

  /* ---------- حالة الضغط ---------- */
  const card = $('card'), btn = $('holdBtn'), orb = $('orb');
  const label = $('btnLabel'), digital = $('digital'), backMsg = $('backMsg');
  let p = 0, holding = false, done = false, last = performance.now(), msgTimer = null;

  function start(e) {
    if (done) return;
    holding = true;
    card.classList.add('holding');
    label.textContent = 'ماتسيبيش';
    backMsg.classList.remove('show');
    clearTimeout(msgTimer);
    moveOrb(e);
    orb.classList.add('on');
    if (navigator.vibrate) navigator.vibrate(15);
  }
  function release() {
    if (!holding || done) return;
    holding = false;
    card.classList.remove('holding');
    label.textContent = 'دوسي';
    orb.classList.remove('on');
    if (p > 0.04) {
      backMsg.textContent = `سيبتي، فالساعة رجعت ${ar('11:59')}.`;
      backMsg.classList.add('show');
      clearTimeout(msgTimer);
      msgTimer = setTimeout(() => backMsg.classList.remove('show'), 2800);
    }
  }
  function moveOrb(e) {
    if (!e || e.clientX === undefined) {
      const r = btn.getBoundingClientRect();
      orb.style.left = r.left + r.width / 2 + 'px';
      orb.style.top = r.top + r.height / 2 + 'px';
      return;
    }
    const lift = e.pointerType === 'touch' ? -34 : 0;
    orb.style.left = e.clientX + 'px';
    orb.style.top = e.clientY + lift + 'px';
  }

  btn.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    try { btn.setPointerCapture(e.pointerId); } catch (_) {}
    start(e);
  });
  btn.addEventListener('pointermove', (e) => { if (holding) moveOrb(e); });
  ['pointerup', 'pointercancel', 'lostpointercapture'].forEach((n) => btn.addEventListener(n, release));
  btn.addEventListener('contextmenu', (e) => e.preventDefault());
  btn.addEventListener('keydown', (e) => {
    if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) { e.preventDefault(); start(); }
  });
  btn.addEventListener('keyup', (e) => {
    if (e.key === ' ' || e.key === 'Enter') release();
  });
  btn.addEventListener('blur', release);

  /* ---------- حلقة الرسم ---------- */
  function render(now) {
    const sBase = ((Date.now() % 60000) / 1000) * 6;
    const e = p;
    setRot(hMin, 354 + e * (6 + 360 * 5));
    setRot(hHour, 359.5 + e * (0.5 + 360));
    setRot(hSec, done ? 0 : sBase * (1 - e) + e * 3600);
    card.style.setProperty('--p', p.toFixed(4));
  }
  function frame(now) {
    const dt = Math.min(64, now - last);
    last = now;
    if (!done) {
      if (holding) p = Math.min(1, p + dt / CFG.holdMs);
      else if (p > 0) p = Math.max(0, p - dt / 450);
      if (holding && p >= 1) complete();
    }
    render(now);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  /* ---------- نص الليل ---------- */
  function complete() {
    if (done) return;
    done = true;
    holding = false;
    p = 1;
    card.classList.remove('holding');
    card.classList.add('gold');
    digital.textContent = ar('12:00');
    label.textContent = 'ماتسيبيش';
    if (navigator.vibrate) navigator.vibrate([30, 50, 80]);

    setTimeout(() => { card.classList.add('out'); orb.classList.remove('on'); $('rings').classList.add('go'); }, 1300);
    setTimeout(() => { $('rings').classList.add('bigphase'); $('sky').classList.add('open'); }, 2800);
    setTimeout(startFinal, 3600);
  }

  function startFinal() {
    fxStart();
    document.querySelectorAll('.reveal').forEach((el, i) => {
      setTimeout(() => el.classList.add('in'), i * 1200);
    });
    setTimeout(fallingStars, 4000);
  }

  /* ---------- النجوم الساقطة ---------- */
  function fallingStars() {
    const host = $('fallStars');
    for (let i = 0; i < 16; i++) {
      const s = document.createElement('i');
      const size = rnd(10, 22);
      s.className = 'fs';
      s.style.cssText =
        `left:${rnd(2, 96)}%;width:${size}px;height:${size}px;` +
        `animation-duration:${rnd(7, 12)}s;animation-delay:${rnd(0, 8)}s`;
      host.appendChild(s);
    }
  }

  /* ---------- الألعاب النارية ---------- */
  const fx = $('fx'), ctx = fx.getContext('2d');
  let W = 0, H = 0, parts = [], rockets = [], fxOn = false, fxTimer = null;
  const COLORS = ['#ffe3b0', '#ffc2d2', '#fff4dc', '#f8cf85', '#ffffff'];

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth; H = window.innerHeight;
    fx.width = W * dpr; fx.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  window.addEventListener('resize', resize);
  resize();

  function burst(x, y, type) {
    const col = COLORS[(Math.random() * COLORS.length) | 0];
    if (type === 'ring') {
      const n = 30;
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2;
        parts.push({ x, y, vx: Math.cos(a) * 2.3, vy: Math.sin(a) * 2.3, life: 1, decay: 0.009, col, len: 5, drag: 0.982, g: 0.012, w: 2.2 });
      }
    } else if (type === 'heart') {
      const n = 46;
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2;
        const hx = 16 * Math.pow(Math.sin(a), 3);
        const hy = -(13 * Math.cos(a) - 5 * Math.cos(2 * a) - 2 * Math.cos(3 * a) - Math.cos(4 * a));
        parts.push({ x, y, vx: hx * 0.13, vy: hy * 0.13, life: 1, decay: 0.0085, col: '#ffc2d2', len: 0.1, drag: 0.955, g: 0.004, w: 2.6 });
      }
    } else {
      const n = 36;
      for (let i = 0; i < n; i++) {
        const a = rnd(0, Math.PI * 2), s = rnd(0.6, 3);
        parts.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 1, decay: rnd(0.008, 0.014), col, len: 3, drag: 0.98, g: 0.02, w: 2 });
      }
    }
  }

  function launch(type) {
    const x = rnd(W * 0.15, W * 0.85);
    rockets.push({ x, y: H * 0.72, vy: -rnd(5.5, 7), ty: rnd(H * 0.1, H * 0.36), type });
  }

  function fxLoop() {
    if (!fxOn) return;
    ctx.clearRect(0, 0, W, H);

    rockets = rockets.filter((r) => {
      r.y += r.vy;
      ctx.strokeStyle = 'rgba(255,240,210,.95)';
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(r.x, r.y); ctx.lineTo(r.x, r.y + 12); ctx.stroke();
      if (r.y <= r.ty) { burst(r.x, r.y, r.type); return false; }
      return true;
    });

    parts = parts.filter((q) => {
      q.vx *= q.drag; q.vy = q.vy * q.drag + q.g;
      q.x += q.vx; q.y += q.vy;
      q.life -= q.decay;
      if (q.life <= 0) return false;
      ctx.globalAlpha = Math.max(0, q.life);
      ctx.strokeStyle = q.col;
      ctx.lineWidth = q.w;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(q.x, q.y);
      ctx.lineTo(q.x - q.vx * q.len, q.y - q.vy * q.len);
      ctx.stroke();
      return true;
    });
    ctx.globalAlpha = 1;
    requestAnimationFrame(fxLoop);
  }

  function fxStart() {
    if (fxOn) return;
    fxOn = true;
    resize();
    requestAnimationFrame(fxLoop);
    const types = ['ring', 'heart', 'dots', 'ring', 'heart'];
    let i = 0;
    launch('ring');
    setTimeout(() => launch('heart'), 700);
    fxTimer = setInterval(() => { launch(types[i++ % types.length]); }, 1400);
  }
})();
