/* ============================================================
   光帆数艺 LUMIVELA ACADEMY · 交互与渲染
   数据源：data.js（单一数据源）· 设计语言：LightVela
   ============================================================ */
(function () {
  'use strict';

  /* ---------- 工具 ---------- */
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };
  var stars = function (d) { return '★'.repeat(d) + '☆'.repeat(5 - d); };
  var diffLabel = function (d) { return d <= 1 ? '入门' : d === 2 ? '进阶' : d === 3 ? '进阶' : d === 4 ? '深造' : '高阶'; };
  var catGlyph = function (cat) {
    return { 'AI设计': 'spark', '游戏设计': 'pad', '影视后期': 'clap', 'UI设计': 'grid', '插画原画': 'pen', '空间室内': 'lamp' }[cat] || 'spark';
  };
  var catCover = function (cat) {
    return {
      'AI设计': '', '游戏设计': 'course-cover--game', '影视后期': 'course-cover--film',
      'UI设计': 'course-cover--ui', '插画原画': 'course-cover--illus', '空间室内': 'course-cover--room'
    }[cat] || '';
  };

  /* SVG 图标库（线性，LightVela 线性图标谱系） */
  var ICONS = {
    spark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l1.9 5.6L19.5 10l-5.6 1.9L12 17.5l-1.9-5.6L4.5 10l5.6-1.4L12 3z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15z"/></svg>',
    pad: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6.5 7h11a4.5 4.5 0 0 1 4.4 5.4l-.8 4A3 3 0 0 1 16 18.4L14.8 17H9.2L8 18.4a3 3 0 0 1-5.1-2l-.8-4A4.5 4.5 0 0 1 6.5 7z"/><path d="M8 10.5v3M6.5 12h3"/><path d="M15.5 11h.01M17.5 13h.01"/></svg>',
    clap: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="9" width="18" height="11" rx="2"/><path d="M3.5 9l1.2-3.6L21 7.2 20.4 9M7.8 5.9l2 3M12.6 6.7l2 3"/></svg>',
    grid: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="3.5" width="17" height="17" rx="3"/><path d="M3.5 9.5h17M9.5 9.5v11"/></svg>',
    pen: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l2.5 5.5L20 11l-5.5 2.5L12 19l-2.5-5.5L4 11l5.5-2.5L12 3z" opacity=".4"/><path d="M4 20c2.5-1 4-2.5 5-5M14.5 3.5l6 6L9 21H3v-6L14.5 3.5z"/></svg>',
    lamp: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9 4h6l4 7H5l4-7z"/><path d="M12 11v6M8.5 20h7"/><path d="M12 3v1"/></svg>',
    play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13l11-6.5L8 5.5z"/></svg>',
    phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 4h4l1.5 4.5L8 10a12 12 0 0 0 6 6l1.5-2.5L20 15v4a2 2 0 0 1-2.2 2A16.8 16.8 0 0 1 3 6.2 2 2 0 0 1 5 4z"/></svg>',
    pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11z"/><circle cx="12" cy="10" r="2.6"/></svg>',
    clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></svg>',
    eye: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17L17 7M9 7h8v8"/></svg>',
    right: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    chev: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>',
    left: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M15 6l-6 6 6 6"/></svg>',
    up: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M6 11l6-6 6 6"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 12.5l5 5L19.5 7"/></svg>',
    msg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a8 8 0 0 1-8 8H4l2.3-2.9A8 8 0 1 1 21 12z"/><path d="M8.5 10.5h7M8.5 13.5h4"/></svg>',
    bot: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="8" width="14" height="11" rx="3.5"/><path d="M12 8V4.5M8.5 4.5h7"/><circle cx="9.5" cy="13" r="1"/><circle cx="14.5" cy="13" r="1"/><path d="M9.5 16.2h5"/></svg>',
    book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15.5H6.5A2.5 2.5 0 0 0 4 21V5.5z"/><path d="M4 18.5A2.5 2.5 0 0 1 6.5 16H20"/></svg>',
    cap: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 9.5L12 5l9.5 4.5L12 14 2.5 9.5z"/><path d="M6.5 11.5V16c0 1.4 2.5 2.8 5.5 2.8s5.5-1.4 5.5-2.8v-4.5M21.5 9.5V15"/></svg>',
    users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8.5" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 5.6a3.5 3.5 0 0 1 0 5.8M21.5 20a6.5 6.5 0 0 0-4.5-6.1"/></svg>',
    target: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1" fill="currentColor"/></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="M3.5 7l8.5 6 8.5-6"/></svg>',
    wechat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M15.5 4.5c-4.1 0-7.4 2.7-7.4 6 0 .8.2 1.5.5 2.2l-1.3 2.6 3-1a8.6 8.6 0 0 0 5.2.3"/><path d="M9.2 15.3c.7 2.9 3.6 5.2 7 5.2.9 0 1.8-.2 2.6-.5l2.4.8-1-2.3a5.5 5.5 0 0 0 1.3-3.5c0-3-2.8-5.5-6.3-5.5-3.2 0-5.8 2.1-6 4.8"/><path d="M12 4.7a8.4 8.4 0 0 0-8.5 8.3"/></svg>',
    camera: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="7" width="18" height="13" rx="3"/><path d="M8.5 7L10 4.5h4L15.5 7"/><circle cx="12" cy="13" r="3.5"/></svg>',
    home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 11l8-7 8 7"/><path d="M6 9.5V20h12V9.5"/><path d="M10 20v-5.5h4V20"/></svg>',
    sofa: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 11V8a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v3"/><path d="M3 11a2 2 0 0 1 2 2v2h14v-2a2 2 0 0 1 4 0v3a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2z"/><path d="M6 18v2M18 18v2"/></svg>',
    coffee: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9h12v6a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V9z"/><path d="M16 10h2a2.5 2.5 0 0 1 0 5h-2M7 5.5c0-1 1-1 1-2M11 5.5c0-1 1-1 1-2"/></svg>',
    x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>'
  };
  window.lvIcon = function (name) { return ICONS[name] || ''; };

  /* 全站图标占位替换：<i data-icon="phone"></i> */
  $$('i[data-icon]').forEach(function (el) {
    el.outerHTML = ICONS[el.getAttribute('data-icon')] || '';
  });

  /* ---------- 通用组件 ---------- */
  // 导航滚动描边
  var nav = $('#nav');
  var onScroll = function () {
    if (nav) nav.classList.toggle('is-scrolled', window.scrollY > 8);
    var bt = $('#backtop');
    if (bt) bt.classList.toggle('is-show', window.scrollY > 600);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // 移动端菜单
  var burger = $('#navBurger'), menu = $('#navMenu');
  if (burger && menu) {
    burger.addEventListener('click', function () {
      var open = menu.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', String(open));
    });
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) { menu.classList.remove('is-open'); burger.setAttribute('aria-expanded', 'false'); }
    });
  }

  // 巨型下拉（桌面 hover + 点击切换）
  var megaItem = $('#megaItem'), veil = $('#pageVeil');
  if (megaItem) {
    var setMega = function (open) {
      megaItem.classList.toggle('is-open', open);
      if (veil) veil.classList.toggle('is-on', open && window.innerWidth > 900);
      var btn = $('#megaBtn');
      if (btn) btn.setAttribute('aria-expanded', String(open));
    };
    var mq = window.matchMedia('(hover: hover) and (min-width: 901px)');
    megaItem.addEventListener('mouseenter', function () { if (mq.matches) setMega(true); });
    megaItem.addEventListener('mouseleave', function () { if (mq.matches) setMega(false); });
    $('#megaBtn').addEventListener('click', function () { setMega(!megaItem.classList.contains('is-open')); });
    if (veil) veil.addEventListener('click', function () { setMega(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMega(false); });
  }

  // 当前页高亮
  var page = document.body.getAttribute('data-page');
  if (page) {
    $$('.nav__link[data-nav]').forEach(function (a) {
      a.classList.toggle('is-active', a.getAttribute('data-nav') === page);
    });
  }

  // reveal 入场
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
    });
  }, { threshold: .08, rootMargin: '0px 0px -40px 0px' });
  var revealScan = function () { $$('.reveal:not(.is-in)').forEach(function (el) { io.observe(el); }); };
  window.lvRevealScan = revealScan;
  revealScan();

  // count-up
  var cio = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      cio.unobserve(en.target);
      var el = en.target, target = parseInt(el.getAttribute('data-count'), 10) || 0;
      var t0 = null, dur = 1500;
      var step = function (t) {
        if (!t0) t0 = t;
        var p = Math.min((t - t0) / dur, 1);
        p = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * p).toLocaleString();
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }, { threshold: .4 });
  $$('[data-count]').forEach(function (el) { cio.observe(el); });

  // 通用 tabs（data-tabs 容器 + [data-tab] 按钮 + [data-panel] 面板）
  $$('[data-tabs]').forEach(function (root) {
    root.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-tab]');
      if (!btn) return;
      $$('[data-tab]', root).forEach(function (b) {
        b.classList.toggle('is-active', b === btn);
        b.setAttribute('aria-selected', String(b === btn));
      });
      var val = btn.getAttribute('data-tab');
      var after = root.getAttribute('data-tabs');
      if (after && typeof window[after] === 'function') window[after](val);
    });
  });

  // 手风琴（.faq-item）
  var accInit = function (root) {
    $$('.faq-item', root).forEach(function (item) {
      var q = $('.faq-q', item), a = $('.faq-a', item);
      if (!q || q.dataset.bound) return;
      q.dataset.bound = '1';
      q.addEventListener('click', function () {
        var open = item.classList.toggle('is-open');
        a.style.maxHeight = open ? a.scrollHeight + 'px' : '0px';
        q.setAttribute('aria-expanded', String(open));
      });
    });
  };
  window.lvAccInit = accInit;
  accInit(document);

  // 返回顶部
  var bt = $('#backtop');
  if (bt) bt.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });

  // 年份
  var year = $('#year');
  if (year) year.textContent = String(new Date().getFullYear());

  /* ---------- 模态 ---------- */
  var modalVeil = $('#modalVeil');
  var modalOpen = function (html) {
    if (!modalVeil) return;
    $('#modalBox').innerHTML = html;
    modalVeil.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  };
  var modalClose = function () {
    if (!modalVeil) return;
    modalVeil.classList.remove('is-open');
    document.body.style.overflow = '';
  };
  window.lvModalOpen = modalOpen;
  if (modalVeil) {
    modalVeil.addEventListener('click', function (e) {
      if (e.target === modalVeil || e.target.closest('.modal__close')) modalClose();
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') modalClose(); });
  }

  /* ---------- 渲染：课程导航巨型下拉 ---------- */
  var megaMenu = $('#megaMenu');
  if (megaMenu) {
    megaMenu.innerHTML = CATS.map(function (cat) {
      var list = COURSES.filter(function (c) { return c.cat === cat; });
      return '<div class="mega__col"><h4>' + ICONS[catGlyph(cat)] + esc(cat) + '</h4>' +
        list.map(function (c) {
          return '<a href="course.html?id=' + c.id + '" role="menuitem"><span>' + esc(c.name) + '</span><i>' + esc(c.months) + '</i></a>';
        }).join('') + '</div>';
    }).join('') +
    '<div class="mega__foot"><span>6 大方向 · 16 门主力课程 · 每月滚动开班</span>' +
    '<button class="btn btn--dark" type="button" data-consult-open>让顾问帮你选</button></div>';
  }

  /* ---------- 全局：data-consult-open 委托 ---------- */
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-consult-open]');
    if (!t) return;
    e.preventDefault();
    var fab = $('#consultFab');
    if (fab) fab.click();
  });

  /* ---------- 渲染：课程卡 ---------- */
  var courseCard = function (c) {
    return '' +
      '<article class="course-card reveal">' +
      '  <div class="course-cover ' + catCover(c.cat) + '">' +
      '    <span class="cover-diff">难度 <i>' + stars(c.diff) + '</i> ' + diffLabel(c.diff) + '</span>' +
      '    <span class="cover-mode">' + esc(c.mode.split(' ')[0]) + '</span>' +
      '    <i class="glyph">' + ICONS[catGlyph(c.cat)] + '</i>' +
      '  </div>' +
      '  <div class="course-body">' +
      '    <h3>' + esc(c.name) + '</h3>' +
      '    <p class="tagline">' + esc(c.tagline) + '</p>' +
      '    <div class="feature-tags">' + c.features.slice(0, 3).map(function (f) { return '<span>' + esc(f) + '</span>'; }).join('') + '</div>' +
      '  </div>' +
      '  <div class="course-meta">' +
      '    <span class="m"><i>' + ICONS.clock + '</i>' + esc(c.months) + '</span>' +
      '    <span class="m"><i>' + ICONS.cap + '</i>' + esc(c.mode) + '</span>' +
      '  </div>' +
      '  <div class="course-foot">' +
      '    <div class="job-pills">' + c.jobs.slice(0, 2).map(function (j) { return '<span>' + esc(j.role) + ' <b>' + esc(j.pay) + '</b></span>'; }).join('') + '</div>' +
      '    <a class="course-go" href="course.html?id=' + c.id + '">详情 ' + ICONS.right + '</a>' +
      '  </div>' +
      '</article>';
  };
  window.lvCourseCard = courseCard;

  /* ---------- 首页：学院课程（每学院 3 门） ---------- */
  ACADEMIES.forEach(function (a) {
    var box = $('#academy-' + a.id);
    if (!box) return;
    var list = COURSES.filter(function (c) { return c.academy === a.id; }).slice(0, 3);
    box.innerHTML = list.map(courseCard).join('');
  });

  /* ---------- 首页：免费教程 ---------- */
  var tGrid = $('#tutorialGrid');
  var ARTS = [
    'linear-gradient(135deg,#241d30,#161220)', 'linear-gradient(135deg,#2b361c,#1c2415)',
    'linear-gradient(135deg,#3a3842,#26242c)', 'linear-gradient(135deg,#4e4666,#2e2840)',
    'linear-gradient(135deg,#46603a,#22301a)', 'linear-gradient(135deg,#4c4356,#2d2734)'
  ];
  var renderTutorials = function (cat) {
    if (!tGrid) return;
    var list = TUTORIALS.filter(function (t) { return cat === '全部' || t.cat === cat; });
    if (cat === '最新' ) { list = TUTORIALS.slice(0, 8); }
    tGrid.innerHTML = list.slice(0, 8).map(function (t, i) {
      return '' +
        '<button class="tutorial-card" data-tut="' + t.id + '">' +
        '  <span class="tutorial-cover"><span class="t-art" style="background:' + ARTS[i % ARTS.length] + '"></span>' +
        '    <i class="glyph">' + ICONS.play + '</i>' +
        '    <span class="dur">' + esc(t.dur) + '</span>' +
        '    <span class="play">' + ICONS.play + '</span>' +
        '  </span>' +
        '  <span class="tutorial-meta"><span class="free">免费</span><span>' + esc(t.views) + ' 次学习</span><span class="lvl">' + esc(t.level) + '</span></span>' +
        '  <span class="tutorial-title">' + esc(t.title) + '</span>' +
        '</button>';
    }).join('');
    revealScan();
  };
  window.lvRenderTutorials = renderTutorials;
  renderTutorials('最新');
  if (tGrid) {
    tGrid.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-tut]');
      if (!btn) return;
      var t = TUTORIALS.find(function (x) { return x.id === btn.getAttribute('data-tut'); });
      if (!t) return;
      modalOpen(
        '<div class="modal__cover" style="background:linear-gradient(135deg,#241d30,#161220)">' +
        '  <i class="glyph">' + ICONS.play + '</i>' +
        '  <button class="modal__close">' + ICONS.x + '</button>' +
        '</div>' +
        '<div class="modal__body">' +
        '  <h3>' + esc(t.title) + '</h3>' +
        '  <p>时长 ' + esc(t.dur) + ' · ' + esc(t.level) + ' · ' + esc(t.views) + ' 次学习<br>本站为设计演示站点，视频播放为占位演示；正式版将在此嵌入课程节选。</p>' +
        '  <div class="row"><span class="meta-pill">免费公开课</span><span class="meta-pill">含素材练习文件</span></div>' +
        '  <a class="btn btn--deep" href="courses.html">浏览完整课程 ' + ICONS.arrow + '</a>' +
        '</div>'
      );
    });
  }

  /* ---------- 师资渲染 ---------- */
  var AVA_BG = ['linear-gradient(135deg,#2f2540,#211a2a)', 'linear-gradient(135deg,#2b361c,#1c2415)', 'linear-gradient(135deg,#4e4666,#2e2840)', 'linear-gradient(135deg,#46603a,#22301a)'];
  var teacherCard = function (t, i) {
    return '' +
      '<article class="teacher-card reveal">' +
      '  <div class="teacher-avatar" style="background:' + AVA_BG[i % AVA_BG.length] + '">' + esc(t.name[0]) + '</div>' +
      '  <h3>' + esc(t.name) + ' <span class="role">' + esc(t.role) + '</span></h3>' +
      '  <div class="teacher-years">行业经验 ' + t.years + ' 年 · ' + esc((ACADEMIES.find(function (a) { return a.id === t.academy; }) || {}).name || '') + '</div>' +
      '  <p>' + esc(t.bio) + '</p>' +
      '</article>';
  };
  var teacherGrid = $('#teacherGrid');
  if (teacherGrid) teacherGrid.innerHTML = TEACHERS.map(teacherCard).join('');
  var teacherHome = $('#teacherGridHome');
  if (teacherHome) teacherHome.innerHTML = TEACHERS.slice(0, 4).map(teacherCard).join('');

  /* ---------- 学员作品渲染 ---------- */
  var workCard = function (w, i) {
    return '' +
      '<figure class="work-card reveal" data-work="' + w.id + '" tabindex="0" role="button" aria-label="' + esc(w.title) + '">' +
      '  <div class="work-art" style="background:' + ARTS[w.art % ARTS.length] + '">' +
      '    <span class="shape" style="width:150px;height:150px;left:-40px;top:-50px"></span>' +
      '    <span class="shape" style="width:210px;height:210px;right:-70px;bottom:-80px"></span>' +
      '    <i class="glyph">' + ICONS[catGlyph(w.cat)] + '</i>' +
      '  </div>' +
      '  <span class="work-cat">' + esc(w.cat) + '</span>' +
      '  <figcaption class="work-info"><b>' + esc(w.title) + '</b><span>' + esc(w.student) + '</span></figcaption>' +
      '</figure>';
  };
  var worksGrid = $('#worksGrid');
  if (worksGrid) {
    worksGrid.innerHTML = WORKS.map(workCard).join('');
    worksGrid.addEventListener('click', function (e) {
      var card = e.target.closest('[data-work]');
      if (!card) return;
      var w = WORKS.find(function (x) { return x.id === card.getAttribute('data-work'); });
      modalOpen(
        '<div class="modal__cover" style="background:' + ARTS[w.art % ARTS.length] + '">' +
        '  <i class="glyph">' + ICONS[catGlyph(w.cat)] + '</i>' +
        '  <button class="modal__close">' + ICONS.x + '</button>' +
        '</div>' +
        '<div class="modal__body">' +
        '  <h3>' + esc(w.title) + '</h3>' +
        '  <p>' + esc(w.student) + ' · 结业作品 · ' + esc(w.cat) + '方向<br>本站为设计演示站点，作品图以风格化占位呈现。</p>' +
        '  <div class="row"><span class="meta-pill">项目制结业作品</span><span class="meta-pill">按商业规格交付</span></div>' +
        '  <a class="btn btn--deep" href="courses.html">查看对应课程 ' + ICONS.arrow + '</a>' +
        '</div>'
      );
    });
  }
  window.lvWorkCard = workCard;

  /* ---------- 校区渲染 ---------- */
  var campusShot = function (i, tag, tall) {
    var icons = ['home', 'sofa', 'coffee', 'camera'];
    return '' +
      '<figure class="campus-shot' + (tall ? ' campus-shot--tall' : '') + '">' +
      '  <div class="art" style="background:' + ARTS[i % ARTS.length] + '"><i class="glyph">' + ICONS[icons[i % icons.length]] + '</i></div>' +
      '  <figcaption>' + esc(tag) + '</figcaption>' +
      '</figure>';
  };
  var campusInfo = $('#campusInfo'), campusGallery = $('#campusGallery');
  var renderCampus = function (idx) {
    var c = CAMPUSES[idx];
    if (!c) return;
    if (campusInfo) {
      campusInfo.innerHTML =
        '<div class="city-row"><h3>' + esc(c.city) + '校区</h3><span class="campus-tag">' + esc(c.tag) + '</span></div>' +
        '<p class="desc">光帆数艺直营校区 · 全职讲师驻场授课</p>' +
        '<ul class="campus-rows">' +
        '  <li>' + ICONS.pin + '<span><b>' + esc(c.addr) + '</b></span></li>' +
        '  <li>' + ICONS.home + '<span>' + esc(c.floor) + '</span></li>' +
        '  <li>' + ICONS.camera + '<span>' + esc(c.rooms) + '</span></li>' +
        '  <li>' + ICONS.clock + '<span>开放时间：' + esc(c.open) + '</span></li>' +
        '  <li>' + ICONS.phone + '<span>咨询热线：<b>' + esc(SITE.hotline) + '</b>（演示数据）</span></li>' +
        '</ul>' +
        '<a class="btn btn--deep" href="#consultFab" id="campusBook">预约参观校区 ' + ICONS.arrow + '</a>';
      var bookBtn = $('#campusBook');
      if (bookBtn) bookBtn.addEventListener('click', function (e) {
        e.preventDefault();
        var fab = $('#consultFab');
        if (fab) fab.click();
      });
    }
    if (campusGallery) {
      campusGallery.innerHTML =
        campusShot(idx, '实训机房', true) +
        campusShot(idx + 1, '学员影棚', false) +
        campusShot(idx + 2, '开放自习区', false);
    }
  };
  window.lvRenderCampus = renderCampus;
  if (campusInfo) {
    var cityRow = $('#cityTabs');
    cityRow.innerHTML = CAMPUSES.map(function (c, i) {
      return '<button class="city-tab' + (i === 0 ? ' is-active' : '') + '" data-city="' + i + '">' + esc(c.city) + (c.tag ? ' · ' + esc(c.tag) : '') + '</button>';
    }).join('');
    cityRow.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-city]');
      if (!btn) return;
      $$('.city-tab', cityRow).forEach(function (b) { b.classList.toggle('is-active', b === btn); });
      renderCampus(parseInt(btn.getAttribute('data-city'), 10));
    });
    renderCampus(0);
  }

  /* ---------- 新闻渲染 ---------- */
  var newsGrid = $('#newsGrid');
  if (newsGrid) {
    newsGrid.innerHTML = NEWS.slice(0, 3).map(function (n) {
      return '' +
        '<article class="news-card reveal">' +
        '  <div class="news-top"><span class="news-tag">' + esc(n.tag) + '</span><time>' + esc(n.date) + '</time></div>' +
        '  <h3>' + esc(n.title) + '</h3>' +
        '  <p>' + esc(n.excerpt) + '</p>' +
        '  <span class="more">阅读全文 ' + ICONS.right + '</span>' +
        '</article>';
    }).join('');
  }
  var newsList = $('#newsList');
  if (newsList) {
    newsList.innerHTML = NEWS.map(function (n) {
      return '' +
        '<article class="news-row reveal">' +
        '  <time>' + esc(n.date) + '</time>' +
        '  <div class="body"><span class="news-tag">' + esc(n.tag) + '</span>' +
        '  <h3>' + esc(n.title) + '</h3><p>' + esc(n.excerpt) + '</p></div>' +
        '</article>';
    }).join('');
  }

  /* ---------- FAQ 渲染 ---------- */
  var faqList = $('#faqList');
  if (faqList) {
    faqList.innerHTML = FAQS.map(function (f) {
      return '' +
        '<div class="faq-item">' +
        '  <button class="faq-q" aria-expanded="false"><span>' + esc(f.q) + '</span><span class="chev">' + ICONS.chev + '</span></button>' +
        '  <div class="faq-a"><div class="faq-a__inner">' + esc(f.a) + '</div></div>' +
        '</div>';
    }).join('');
    accInit(faqList);
  }

  /* ---------- 课程库页：筛选 ---------- */
  var coursesGrid = $('#coursesGrid');
  if (coursesGrid) {
    var renderCourses = function (cat) {
      var list = cat === '全部' ? COURSES : COURSES.filter(function (c) { return c.cat === cat; });
      coursesGrid.innerHTML = list.map(courseCard).join('');
      $('#coursesCount').textContent = '共 ' + list.length + ' 门课程';
      revealScan();
    };
    window.lvFilterCourses = renderCourses;
    renderCourses('全部');
    /* 支持 courses.html?cat=xxx 直达筛选 */
    var qcat = new URLSearchParams(location.search).get('cat');
    if (qcat) {
      var chip = document.querySelector('.chip[data-tab="' + qcat + '"]');
      if (chip && !chip.classList.contains('is-active')) chip.click();
    }
  }

  /* ---------- 课程详情页 ---------- */
  var detailRoot = $('#courseDetail');
  if (detailRoot) {
    var qid = new URLSearchParams(location.search).get('id');
    var c = COURSES.find(function (x) { return x.id === qid; }) || COURSES[0];
    document.title = c.name + ' · 光帆数艺 LumiVela Academy';
    $('#cdCrumbName').textContent = c.name;
    $('#cdTitle').textContent = c.name;
    $('#cdTagline').textContent = c.tagline;
    $('#cdDiff').innerHTML = '难度 <b>' + stars(c.diff) + '</b>' + diffLabel(c.diff);
    $('#cdMonths').innerHTML = '学制 <b>' + esc(c.months) + '</b>';
    $('#cdMode').innerHTML = '形式 <b>' + esc(c.mode) + '</b>';
    $('#cdCat').innerHTML = '方向 <b>' + esc(c.cat) + '</b>';
    $('#cdFeatures').innerHTML = c.features.map(function (f) {
      return '<li>' + ICONS.check + '<span>' + esc(f) + '</span></li>';
    }).join('');
    $('#cdJobs').innerHTML = c.jobs.map(function (j) {
      return '<li><div><b>' + esc(j.role) + '</b><span>一线城市参考区间 · 演示数据</span></div><em>' + esc(j.pay) + '</em></li>';
    }).join('');
    $('#cdAudience').textContent = c.audience;
    $('#cdOutline').innerHTML = c.outline.map(function (o, i) {
      return '' +
        '<div class="outline-item faq-item' + (i === 0 ? ' is-open' : '') + '">' +
        '  <button class="faq-q" aria-expanded="' + (i === 0 ? 'true' : 'false') + '"><span>' + esc(o.t) + '</span><span class="chev">' + ICONS.chev + '</span></button>' +
        '  <div class="faq-a"' + (i === 0 ? ' style="max-height:200px"' : '') + '><div class="faq-a__inner">' + esc(o.d) + '</div></div>' +
        '</div>';
    }).join('');
    accInit($('#cdOutline'));
    var apply = $('#cdApply');
    if (apply) {
      apply.href = 'course.html?id=' + c.id + '#consult';
      apply.addEventListener('click', function () {
        setTimeout(function () { var fab = $('#consultFab'); if (fab) fab.click(); }, 350);
      });
    }
  }

  /* ---------- 作品页筛选 ---------- */
  var worksFilterGrid = $('#worksFilterGrid');
  if (worksFilterGrid) {
    var renderWorks = function (cat) {
      var list = cat === '全部' ? WORKS : WORKS.filter(function (w) { return w.cat === cat; });
      worksFilterGrid.innerHTML = list.map(workCard).join('');
      revealScan();
    };
    window.lvFilterWorks = renderWorks;
    renderWorks('全部');
    worksFilterGrid.addEventListener('click', function (e) {
      var card = e.target.closest('[data-work]');
      if (!card) return;
      var w = WORKS.find(function (x) { return x.id === card.getAttribute('data-work'); });
      if (w) window.lvModalOpen(
        '<div class="modal__cover" style="background:' + ARTS[w.art % ARTS.length] + '">' +
        '  <i class="glyph">' + ICONS[catGlyph(w.cat)] + '</i>' +
        '  <button class="modal__close">' + ICONS.x + '</button>' +
        '</div>' +
        '<div class="modal__body"><h3>' + esc(w.title) + '</h3><p>' + esc(w.student) + ' · 结业作品 · ' + esc(w.cat) + '方向<br>本站为设计演示站点，作品图以风格化占位呈现。</p>' +
        '<div class="row"><span class="meta-pill">项目制结业作品</span><span class="meta-pill">按商业规格交付</span></div>' +
        '<a class="btn btn--deep" href="courses.html">查看对应课程 ' + ICONS.arrow + '</a></div>'
      );
    });
  }

  /* ---------- 首页 hero 轮播 ---------- */
  var heroTrack = $('#heroTrack');
  if (heroTrack) {
    var slides = $$('.hero-slide', heroTrack);
    var dots = $$('.hero-dot');
    var cur = 0, timer = null;
    var go = function (i) {
      cur = (i + slides.length) % slides.length;
      heroTrack.style.transform = 'translateX(-' + cur * 100 + '%)';
      dots.forEach(function (d, di) { d.classList.toggle('is-active', di === cur); });
      var h1 = $('h1', slides[cur]);
      if (h1) { h1.style.animation = 'none'; void h1.offsetWidth; h1.style.animation = ''; }
    };
    var play = function () { stop(); timer = setInterval(function () { go(cur + 1); }, 6000); };
    var stop = function () { if (timer) { clearInterval(timer); timer = null; } };
    dots.forEach(function (d, i) { d.addEventListener('click', function () { go(i); play(); }); });
    var prev = $('#heroPrev'), next = $('#heroNext');
    if (prev) prev.addEventListener('click', function () { go(cur - 1); play(); });
    if (next) next.addEventListener('click', function () { go(cur + 1); play(); });
    var hc = $('#heroCarousel');
    hc.addEventListener('mouseenter', stop);
    hc.addEventListener('mouseleave', play);
    document.addEventListener('visibilitychange', function () { document.hidden ? stop() : play(); });
    /* 触摸滑动 */
    var sx = 0;
    hc.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; stop(); }, { passive: true });
    hc.addEventListener('touchend', function (e) {
      var dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 40) go(cur + (dx < 0 ? 1 : -1));
      play();
    }, { passive: true });
    play();
  }

  /* ---------- 在线答疑浮窗 ---------- */
  var fab = $('#consultFab'), panel = $('#consultPanel');
  if (fab && panel) {
    var panelToggle = function (open) {
      panel.classList.toggle('is-open', open);
      fab.setAttribute('aria-expanded', String(open));
      if (open) panel.classList.remove('is-done');
    };
    fab.addEventListener('click', function () { panelToggle(!panel.classList.contains('is-open')); });
    var pclose = $('#consultClose');
    if (pclose) pclose.addEventListener('click', function () { panelToggle(false); });
    var ta = $('#consultText');
    $$('.consult-quick button', panel).forEach(function (b) {
      b.addEventListener('click', function () {
        if (ta) { ta.value = b.textContent; ta.focus(); }
      });
    });
    var form = $('#consultForm');
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        panel.classList.add('is-done');
      });
    }
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') panelToggle(false); });
  }

  /* 首次渲染后统一触发 reveal */
  revealScan();
})();
