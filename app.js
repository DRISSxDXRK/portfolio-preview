/* Preview3 app: ledger render, filters, inline player drawers, ticker
   count-up, nav state, mobile menu, reveals, and one hero shader accent.
   Motion: Premium personality, signature easing cubic-bezier(0.23, 1,
   0.32, 1) via CSS. No animation framework, no CDN dependency.
   Hidden reveal states come from JS only (html.js-motion): without JS,
   or with reduced motion, the page is fully visible. */
(function () {
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var motion = !reducedMotion;
  if (motion) document.documentElement.classList.add('js-motion');

  /* Reveals: hero children stagger in on load, sections on scroll. */
  function armHero() {
    if (!motion) return;
    var items = document.querySelectorAll('header .reveal');
    items.forEach(function (el, i) {
      el.style.transitionDelay = Math.min(i * 60, 480) + 'ms';
    });
    requestAnimationFrame(function () {
      items.forEach(function (el) { el.classList.add('in'); });
    });
  }
  function armSections() {
    var secs = document.querySelectorAll('main section.reveal');
    if (!motion) return;
    if (!('IntersectionObserver' in window)) {
      secs.forEach(function (s) { s.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.15 });
    secs.forEach(function (s) { io.observe(s); });
  }
  armHero();
  armSections();

  /* Work ledger */
  var ledger = document.getElementById('ledger');
  var filtersEl = document.getElementById('filters');
  var currentFilter = 'all';
  var players = [];
  var openDrawer = null;

  function clientLabel(key) {
    return { ahp: 'Art Home Photo', as: 'Art Social', charlie: "Charlie's Pokécards", hercules: 'Hercules Training' }[key] || key;
  }

  function closeDrawer(drawer, thumb) {
    if (!drawer) return;
    var player = drawer.querySelector('.drawer-player');
    var video = player ? player.querySelector('video') : null;
    if (video && !video.paused) video.pause();
    if (player) player.innerHTML = '';
    drawer.classList.remove('open');
    if (thumb) thumb.setAttribute('aria-expanded', 'false');
    if (openDrawer === drawer) openDrawer = null;
  }

  function closeAllDrawers() {
    document.querySelectorAll('.row-drawer.open').forEach(function (d) {
      var row = d.closest('.ledger-row');
      var thumb = row ? row.querySelector('.row-thumb') : null;
      closeDrawer(d, thumb);
    });
  }

  function openDrawerFor(v, drawer, thumb) {
    closeAllDrawers();
    var player = drawer.querySelector('.drawer-player');
    if (v.youtube) {
      var frame = document.createElement('iframe');
      frame.src = 'https://www.youtube-nocookie.com/embed/' + v.youtube + '?autoplay=1&rel=0';
      frame.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      frame.allowFullscreen = true;
      frame.title = v.title;
      player.appendChild(frame);
    } else {
      var video = document.createElement('video');
      video.src = v.src;
      video.poster = v.poster;
      video.preload = 'metadata';
      video.playsInline = true;
      video.setAttribute('playsinline', '');
      video.setAttribute('webkit-playsinline', '');
      video.controls = true;
      player.appendChild(video);
      players.push(video);
      players.forEach(function (p) { if (p !== video && !p.paused) p.pause(); });
      video.play().catch(function () {});
    }
    drawer.classList.add('open');
    thumb.setAttribute('aria-expanded', 'true');
    openDrawer = drawer;
  }

  function makeRow(v, n) {
    var row = document.createElement('article');
    row.className = 'ledger-row';
    row.dataset.client = v.client;

    var index = document.createElement('span');
    index.className = 'row-index';
    index.textContent = (n < 10 ? '0' + n : '' + n);

    var thumb = document.createElement('button');
    thumb.type = 'button';
    thumb.className = 'row-thumb';
    thumb.setAttribute('aria-label', 'Play ' + v.title);
    thumb.setAttribute('aria-expanded', 'false');
    var drawerId = 'drawer-' + n;
    thumb.setAttribute('aria-controls', drawerId);
    var img = document.createElement('img');
    img.src = v.poster;
    img.alt = v.title;
    img.loading = 'lazy';
    var mark = document.createElement('span');
    mark.className = 'play-mark';
    mark.setAttribute('aria-hidden', 'true');
    mark.appendChild(document.createElement('i'));
    thumb.appendChild(img);
    thumb.appendChild(mark);

    var meta = document.createElement('div');
    meta.className = 'row-meta';
    var client = document.createElement('p');
    client.className = 'row-client';
    client.textContent = clientLabel(v.client);
    var title = document.createElement('h3');
    title.className = 'row-title';
    title.textContent = v.title;
    meta.appendChild(client);
    meta.appendChild(title);

    var format = document.createElement('span');
    format.className = 'row-format';
    format.textContent = v.youtube ? 'YouTube' : 'Reel';

    var drawer = document.createElement('div');
    drawer.className = 'row-drawer';
    drawer.id = drawerId;
    var playerWrap = document.createElement('div');
    playerWrap.className = 'drawer-player';
    var closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'drawer-close';
    closeBtn.textContent = 'Close player';
    closeBtn.addEventListener('click', function () {
      closeDrawer(drawer, thumb);
      thumb.focus();
    });
    drawer.appendChild(playerWrap);
    drawer.appendChild(closeBtn);

    thumb.addEventListener('click', function () {
      if (drawer.classList.contains('open')) closeDrawer(drawer, thumb);
      else openDrawerFor(v, drawer, thumb);
    });

    row.appendChild(index);
    row.appendChild(thumb);
    row.appendChild(meta);
    row.appendChild(format);
    row.appendChild(drawer);
    return row;
  }

  function render() {
    if (!ledger || typeof VIDEOS === 'undefined') return;
    ledger.innerHTML = '';
    players = [];
    openDrawer = null;
    var n = 0;
    VIDEOS.forEach(function (v) {
      if (currentFilter !== 'all' && v.client !== currentFilter) return;
      n += 1;
      ledger.appendChild(makeRow(v, n));
    });
    if (motion) {
      var rows = ledger.querySelectorAll('.ledger-row');
      rows.forEach(function (row, i) {
        row.style.transition = 'opacity 250ms cubic-bezier(0.23, 1, 0.32, 1), transform 250ms cubic-bezier(0.23, 1, 0.32, 1)';
        row.style.transitionDelay = Math.min(i * 40, 480) + 'ms';
        row.style.opacity = '0';
        row.style.transform = 'translateY(10px) scale(0.98)';
      });
      requestAnimationFrame(function () {
        rows.forEach(function (row) {
          row.style.opacity = '1';
          row.style.transform = 'none';
        });
      });
    }
  }

  if (filtersEl) {
    filtersEl.addEventListener('click', function (e) {
      var btn = e.target.closest('.filter');
      if (!btn) return;
      currentFilter = btn.dataset.filter;
      filtersEl.querySelectorAll('.filter').forEach(function (b) {
        var active = b === btn;
        b.classList.toggle('active', active);
        b.setAttribute('aria-pressed', active ? 'true' : 'false');
      });
      render();
    });
  }
  render();

  /* Nav state on scroll */
  var nav = document.getElementById('nav');
  function onScroll() {
    if (window.scrollY > 40) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Mobile menu */
  var menuBtn = document.getElementById('menuBtn');
  var menuPanel = document.getElementById('menuPanel');
  if (menuBtn && menuPanel) {
    function setMenu(open) {
      nav.classList.toggle('menu-open', open);
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      if (open) {
        var first = menuPanel.querySelector('a');
        if (first) first.focus();
      }
    }
    menuBtn.addEventListener('click', function () {
      setMenu(!nav.classList.contains('menu-open'));
    });
    menuPanel.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('menu-open')) {
        setMenu(false);
        menuBtn.focus();
      }
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 720 && nav.classList.contains('menu-open')) setMenu(false);
    });
  }
})();

/* Stats ticker: two identical halves for a seamless loop, count-up once. */
(function () {
  var STATS = [
    { value: 2300, suffix: '+', label: 'videos delivered' },
    { value: 1489, suffix: '+', label: 'reels cut' },
    { value: 118, suffix: 'K+', label: 'YouTube views generated' },
    { value: 6, suffix: '+', label: 'brands edited for' },
    { value: 8, suffix: '+', label: 'years editing' }
  ];
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var track = document.getElementById('tickerTrack');
  if (!track) return;

  function finalText(s) { return Math.round(s.value).toLocaleString('en-US') + s.suffix; }
  function groupHTML() {
    return '<div class="tick-group">' + STATS.map(function (s) {
      return '<span class="tick-item"><span class="tick-num" data-value="' + s.value +
        '" data-suffix="' + s.suffix + '">' + (reducedMotion ? finalText(s) : '0') +
        '</span> <span class="tick-label">' + s.label +
        '</span></span><span class="tick-sep" aria-hidden="true">\u2726</span>';
    }).join('') + '</div>';
  }
  track.innerHTML = groupHTML() + groupHTML();
  if (reducedMotion) return;

  function countUp(el) {
    var target = parseInt(el.dataset.value, 10);
    var suffix = el.dataset.suffix || '';
    var dur = 1600, start = null;
    function fmt(n) { return Math.round(n).toLocaleString('en-US') + suffix; }
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(target * eased);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  var started = false;
  function start() {
    if (started) return; started = true;
    track.querySelectorAll('.tick-num').forEach(countUp);
  }
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { start(); io.disconnect(); } });
    });
    io.observe(track);
  } else { start(); }
})();

/* Hero shader accent: one small WebGL2 noise field behind the headline.
   Static fallback is the flat hero background: the canvas stays hidden
   unless init, compile, and link all succeed, and it never starts under
   reduced motion. Pauses offscreen and when the tab is hidden. */
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var canvas = document.getElementById('shader');
  var hero = document.getElementById('top');
  if (!canvas || !hero) return;
  var gl = null;
  try { gl = canvas.getContext('webgl2', { alpha: true, antialias: false, depth: false, stencil: false }); } catch (e) { gl = null; }
  if (!gl) return;

  var vsSrc = '#version 300 es\nin vec2 a_pos;\nvoid main(){ gl_Position = vec4(a_pos, 0.0, 1.0); }';
  var fsSrc = '#version 300 es\nprecision mediump float;\nout vec4 fragColor;\nuniform vec2 u_res;\nuniform float u_time;\nfloat hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }\nfloat noise(vec2 p){ vec2 i = floor(p); vec2 f = fract(p); vec2 u = f * f * (3.0 - 2.0 * f);\nreturn mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y); }\nfloat fbm(vec2 p){ float v = 0.0; float a = 0.5; for(int i = 0; i < 4; i++){ v += a * noise(p); p *= 2.03; a *= 0.5; } return v; }\nvoid main(){\nvec2 uv = gl_FragCoord.xy / u_res;\nfloat n = fbm(uv * vec2(3.0, 1.5) + vec2(u_time * 0.02, 0.0));\nfloat a = smoothstep(0.35, 0.75, n) * 0.16;\nfragColor = vec4(0.545, 0.486, 0.780, a);\n}';

  function compile(type, src) {
    var sh = gl.createShader(type);
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) return null;
    return sh;
  }
  var vs = compile(gl.VERTEX_SHADER, vsSrc);
  var fs = compile(gl.FRAGMENT_SHADER, fsSrc);
  if (!vs || !fs) return;
  var prog = gl.createProgram();
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
  gl.useProgram(prog);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  var buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  var loc = gl.getAttribLocation(prog, 'a_pos');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  var uRes = gl.getUniformLocation(prog, 'u_res');
  var uTime = gl.getUniformLocation(prog, 'u_time');

  function resize() {
    var dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    var w = Math.max(1, Math.floor(canvas.clientWidth * dpr));
    var h = Math.max(1, Math.floor(canvas.clientHeight * dpr));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
    gl.viewport(0, 0, canvas.width, canvas.height);
  }

  var running = false;
  var raf = 0;
  var t0 = performance.now();
  function frame(now) {
    if (!running) return;
    resize();
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.uniform1f(uTime, (now - t0) / 1000);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    raf = requestAnimationFrame(frame);
  }
  function setRunning(on) {
    if (on && !running) { running = true; raf = requestAnimationFrame(frame); }
    else if (!on && running) { running = false; cancelAnimationFrame(raf); }
  }
  canvas.classList.add('on');
  setRunning(true);
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { setRunning(e.isIntersecting); });
    });
    io.observe(hero);
  }
  document.addEventListener('visibilitychange', function () {
    setRunning(!document.hidden);
  });
  window.addEventListener('resize', resize);
})();
