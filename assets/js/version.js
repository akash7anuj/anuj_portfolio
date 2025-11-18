
(function () {
  // CONFIG
  const VERSION_URL = '/version.json';   // relative path; works on GitHub Pages root
  const POLL_MS = 30 * 1000;             // 30 seconds

  let lastVersion = null;
  let checking = false;

  async function fetchVersion() {
    if (checking) return null;
    checking = true;
    try {
      const res = await fetch(VERSION_URL, { cache: 'no-cache' });
      if (!res.ok) return null;
      const data = await res.json();
      return data.version + '::' + (data.sha || '');
    } catch (e) {
      return null;
    } finally {
      checking = false;
    }
  }

  async function init() {
    const v = await fetchVersion();
    if (v) lastVersion = v;
    setInterval(async () => {
      try {
        const latest = await fetchVersion();
        if (!latest) return;
        if (lastVersion && latest !== lastVersion) {
          // Option A: immediate reload
          // window.location.reload();
          // Option B: gentle UX (recommended) — show banner
          showUpdateBanner();
        } else {
          lastVersion = latest;
        }
      } catch (e) {}
    }, POLL_MS);
  }

  // gentle banner: non-intrusive; user can click to reload
  function showUpdateBanner() {
    if (document.getElementById('site-update-banner')) return;
    const banner = document.createElement('div');
    banner.id = 'site-update-banner';
    banner.style = 'position:fixed;left:50%;transform:translateX(-50%);bottom:18px;padding:10px 14px;border-radius:8px;background:linear-gradient(90deg,#08112a,#04203a);color:#fff;box-shadow:0 8px 30px rgba(2,6,23,0.6);z-index:99999;font-family:sans-serif;font-weight:600;cursor:pointer';
    banner.textContent = 'New version available — click to reload';
    banner.onclick = () => window.location.reload();
    document.body.appendChild(banner);
    // auto remove after 5 minutes if user ignores
    setTimeout(() => { banner?.remove(); }, 5 * 60 * 1000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

