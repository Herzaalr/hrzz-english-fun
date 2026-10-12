/* HRZZ English Fun — page bootstrap */
(function () {
  const { U, DB, E, Timer, UI, ensureProfile } = window.HRZZ; const T = window.T;
  window.HRZZ_PAGES = window.HRZZ_PAGES || {};
  const LEARNING = new Set(['mission', 'speak', 'play']);

  async function boot() {
    const main = document.getElementById('app'); const page = main.dataset.page;
    UI.renderShell(page);
    try { await DB.open(); } catch (e) {
      DB.useMemory();
      const b = document.createElement('div'); b.className = 'banner warn'; b.style.margin = '16px 0 -8px'; b.innerHTML = `⚠️ <span><b>${T('Session-only mode:')}</b> ${T('this browser blocks local storage (IndexedDB), so nothing you do here will be saved after you leave. Open the app in a normal (non-private) Chrome, Edge, Firefox or Safari window to keep your progress.')}</span>`; main.before(b);
    }
    main.innerHTML = `<div style="display:grid;gap:14px;margin-top:24px"><div class="skeleton" style="height:140px"></div><div class="skeleton" style="height:90px"></div><div class="skeleton" style="height:200px"></div></div>`;
    const profile = await ensureProfile();
    if (LEARNING.has(page)) Timer.start();
    const renderer = window.HRZZ_PAGES[page];
    try { await renderer(main, profile); } catch (err) { console.error(err); main.innerHTML = `<div class="card card-pad" style="margin-top:24px"><h2>${T('Something went wrong')}</h2><p class="muted" style="margin:8px 0 4px">${T('Page:')} ${page} · ${U.esc(err.message)}</p><p class="faint" style="font-size:12px;margin-bottom:14px">${T('Your data is not lost. If this keeps happening, use Settings → Export backup, then Delete all local data.')}</p><div style="display:flex;gap:8px;flex-wrap:wrap"><a class="btn btn-primary" href="/">${T('Back to Home')}</a><button class="btn btn-ghost" onclick="location.reload()">${T('Reload')}</button><a class="btn btn-ghost" href="/settings/">${T('Settings')}</a></div></div>`; }
    UI.bindTTS(); UI.refreshHeader();
  }
  // Active-time pill shown on learning pages
  window.HRZZ_PAGES.timerPill = function (host) {
    const el = document.createElement('div'); el.className = 'chip'; el.style.cssText = 'gap:8px'; el.innerHTML = `<span class="dot" style="width:8px;height:8px;border-radius:50%;background:var(--mint)"></span><span class="t">0:00 ${T('active')}</span><button class="btn btn-ghost btn-sm" style="padding:2px 8px;font-size:11px" type="button">${T('Pause')}</button>`;
    const btn = el.querySelector('button'); btn.addEventListener('click', () => { Timer.paused = !Timer.paused; btn.textContent = Timer.paused ? T('Resume') : T('Pause'); });
    Timer.onTick = (t) => { const m = Math.floor(t.sec / 60), s = t.sec % 60; el.querySelector('.t').textContent = `${m}:${String(s).padStart(2, '0')} ${T('active')}${t.paused ? ' · ' + T('paused') : t.isIdle() ? ' · ' + T('idle') : ''}`; el.querySelector('.dot').style.background = t.running ? 'var(--mint)' : 'var(--faint)'; };
    host.appendChild(el); return el;
  };

  // ---- PWA: manifest built at runtime (absolute URLs so it works on any published domain) + install prompt
  const PWA = { prompt: null, installed: false };
  window.HRZZ_PWA = PWA;
  try {
    const iconEl = document.querySelector('link[rel="apple-touch-icon"]');
    const icon = iconEl ? new URL(iconEl.getAttribute('href'), location.href).href : null;
    const manifest = {
      name: 'HRZZ English Fun', short_name: 'HRZZ English', description: 'Your personal daily English coach. Learn English. Speak Freely. Have Fun.',
      start_url: location.origin + '/?source=pwa', scope: location.origin + '/', id: location.origin + '/', display: 'standalone', orientation: 'portrait',
      background_color: '#0c0e14', theme_color: '#0c0e14', lang: 'id', dir: 'ltr',
      icons: icon ? [{ src: icon, sizes: '1024x1024', type: 'image/png', purpose: 'any' }, { src: icon, sizes: '1024x1024', type: 'image/png', purpose: 'maskable' }] : [],
      shortcuts: [{ name: 'Speaking Studio', url: location.origin + '/speak/' }, { name: 'Explore', url: location.origin + '/explore/' }],
    };
    if (!document.querySelector('link[rel="manifest"]')) { // a static /manifest.webmanifest (self-hosted build) wins over the runtime one
      const link = document.createElement('link'); link.rel = 'manifest';
      link.href = 'data:application/manifest+json,' + encodeURIComponent(JSON.stringify(manifest));
      document.head.appendChild(link);
    }
    // Offline-first service worker: only on self-hosted builds that ship /sw.js (Moda hosting does not serve one).
    if ('serviceWorker' in navigator && document.documentElement.dataset.sw === 'true') {
      window.addEventListener('load', () => { navigator.serviceWorker.register('/sw.js', { scope: '/' }).then((reg) => { PWA.sw = reg; reg.addEventListener('updatefound', () => { const w = reg.installing; w && w.addEventListener('statechange', () => { if (w.state === 'installed' && navigator.serviceWorker.controller) document.dispatchEvent(new CustomEvent('hrzz:sw-updated')); }); }); }).catch(() => {}); });
    }
    PWA.installed = window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
    window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); PWA.prompt = e; document.dispatchEvent(new CustomEvent('hrzz:installable')); });
    window.addEventListener('appinstalled', () => { PWA.installed = true; PWA.prompt = null; document.dispatchEvent(new CustomEvent('hrzz:installed')); });
    PWA.install = async () => {
      if (!PWA.prompt) return 'unavailable';
      PWA.prompt.prompt(); const r = await PWA.prompt.userChoice; PWA.prompt = null; return r && r.outcome === 'accepted' ? 'accepted' : 'dismissed';
    };
  } catch (e) { /* manifest is a progressive enhancement; never block the app */ }
  document.addEventListener('DOMContentLoaded', boot);
})();
