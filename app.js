/* Portfolio app v2: bento grid render, filters, inline playback,
   ticker count-up, nav state, and purposeful motion (GSAP, guarded).
   VIDEOS comes from videos.js. Content stays visible if GSAP or the
   CDN fails: initial hidden states are set from JS only, never CSS. */
(function () {
  var grid = document.getElementById('grid');
  var filtersEl = document.getElementById('filters');
  var currentFilter = 'all';
  var players = [];

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasGsap = !reducedMotion && typeof window.gsap !== 'undefined';

  function clientLabel(key) {
    return { ahp: 'Art Home Photo', as: 'Art Social', charlie: "Charlie's Pokécards", hercules: 'Hercules Training' }[key] || key;
  }

  function pauseAll(except) {
    players.forEach(function (p) {
      if (p !== except && !p.paused) p.pause();
    });
  }

  function makeTile(v) {
    var tile = document.createElement('article');
    tile.className = 'tile' + (v.feat ? ' feat' : '') + (v.vertical ? ' tile-vertical' : ' tile-horizontal');
    tile.dataset.client = v.client;

    var media = document.createElement('div');
    media.className = 'tile-media';

    var play = document.createElement('div');
    play.className = 'play';

    if (v.youtube) {
      var img = document.createElement('img');
      img.src = v.poster;
      img.alt = v.title;
      img.loading = 'lazy';
      media.appendChild(img);
      play.addEventListener('click', function () {
        pauseAll();
        var frame = document.createElement('iframe');
        frame.src = 'https://www.youtube-nocookie.com/embed/' + v.youtube + '?autoplay=1&rel=0';
        frame.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
        frame.allowFullscreen = true;
        frame.title = v.title;
        frame.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;border:0;';
        media.innerHTML = '';
        media.appendChild(frame);
      });
      media.appendChild(play);
    } else {
      var video = document.createElement('video');
      video.src = v.src;
      video.poster = v.poster;
      video.preload = 'metadata';
      video.playsInline = true;
      video.setAttribute('playsinline', '');
      video.setAttribute('webkit-playsinline', '');
      video.controls = true;
      media.appendChild(video);
      players.push(video);
      play.addEventListener('click', function () {
        pauseAll(video);
        video.play().catch(function () {});
      });
      video.addEventListener('play', function () { play.style.display = 'none'; });
      video.addEventListener('pause', function () { play.style.display = ''; });
      media.appendChild(play);
    }

    var cap = document.createElement('div');
    cap.className = 'tile-caption';
    var client = document.createElement('div');
    client.className = 'tile-client';
    client.textContent = clientLabel(v.client);
    var name = document.createElement('div');
    name.className = 'tile-name';
    name.textContent = v.title;
    cap.appendChild(client);
    cap.appendChild(name);

    tile.appendChild(media);
    tile.appendChild(cap);
    return tile;
  }

  function revealTiles() {
    if (!hasGsap) return;
    var tiles = grid.querySelectorAll('.tile');
    window.gsap.fromTo(tiles,
      { y: 28, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', stagger: 0.05, overwrite: true });
  }

  function render() {
    grid.innerHTML = '';
    players = [];
    VIDEOS.forEach(function (v) {
      if (currentFilter !== 'all' && v.client !== currentFilter) return;
      grid.appendChild(makeTile(v));
    });
    revealTiles();
  }

  filtersEl.addEventListener('click', function (e) {
    var btn = e.target.closest('.filter');
    if (!btn) return;
    currentFilter = btn.dataset.filter;
    filtersEl.querySelectorAll('.filter').forEach(function (b) {
      b.classList.toggle('active', b === btn);
    });
    render();
  });

  render();

  /* Nav state on scroll */
  var nav = document.getElementById('nav');
  function onScroll() {
    if (window.scrollY > 40) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Hero entrance + section reveals: motion with a purpose only.
     No bounce, no elastic easing anywhere. */
  if (hasGsap) {
    var tl = window.gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.from('.hero-kicker', { y: 20, opacity: 0, duration: 0.7 })
      .from('h1', { y: 28, opacity: 0, duration: 0.9 }, '-=0.45')
      .from('.hero-sub', { y: 20, opacity: 0, duration: 0.7 }, '-=0.55')
      .from('.hero-cta', { y: 16, opacity: 0, duration: 0.6 }, '-=0.45')
      .from('.hb-photo', { y: 24, opacity: 0, duration: 0.9 }, '-=0.7')
      .from('.hb-stat', { y: 18, opacity: 0, duration: 0.6, stagger: 0.08 }, '-=0.6');

    if (window.ScrollTrigger) {
      window.gsap.registerPlugin(window.ScrollTrigger);
      window.gsap.utils.toArray('main section').forEach(function (sec) {
        window.gsap.from(sec, {
          y: 28, opacity: 0, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: sec, start: 'top 85%' }
        });
      });
    }
  }
})();

/* Stats ticker: scrolling tape + count-up numbers. */
(function () {
  var STATS = [
    { value: 2300, suffix: '+', label: 'videos delivered' },
    { value: 1489, suffix: '+', label: 'reels cut' },
    { value: 118, suffix: 'K+', label: 'YouTube views generated' },
    { value: 6, suffix: '+', label: 'brands edited for' },
    { value: 8, suffix: '+', label: 'years editing' }
  ];

  var track = document.getElementById('tickerTrack');
  if (!track) return;

  function halfHTML() {
    return STATS.map(function (s) {
      return '<span><b class="tick-num" data-value="' + s.value + '" data-suffix="' + s.suffix + '">0</b> ' + s.label + '</span>';
    }).join('');
  }
  track.innerHTML = halfHTML() + halfHTML();

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
