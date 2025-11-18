// --------- Life filter: unified dropdown + top-buttons (works on mobile & desktop) ----------
(function () {
  // use existing elementToggleFunc if present, otherwise define simple fallback
  if (typeof elementToggleFunc !== 'function') {
    window.elementToggleFunc = function (elem) { elem.classList.toggle('active'); };
  }

  const sel         = document.querySelector('[data-life-select]');
  const selItems    = Array.from(document.querySelectorAll('[data-life-select-item]'));
  const selValue    = document.querySelector('[data-life-select-value]');
  const filterBtns  = Array.from(document.querySelectorAll('[data-life-filter-btn]'));
  const filterItems = Array.from(document.querySelectorAll('[data-life-filter-item]'));
  if (!sel || !selItems.length || !selValue || !filterItems.length) {
    // nothing to do
    // console.warn('[life-filter] missing required elements');
    return;
  }

  // normalize string
  const norm = s => (s || '').toString().toLowerCase().trim();

  // Read categories safely from element dataset (HTML uses data-life-category)
  const getCats = (el) => {
    // check both dataset.lifeCategory and dataset.category for compatibility
    const raw = (el.dataset.lifeCategory !== undefined) ? el.dataset.lifeCategory : (el.dataset.category || '');
    return raw
      .toString()
      .toLowerCase()
      .split(/\s*,\s*/)
      .map(c => c.trim())
      .filter(Boolean);
  };

  // Apply filter: toggles 'active' class on posts (consistent with your HTML initial state)
  function runFilter(value) {
    const v = norm(value || 'all');
    filterItems.forEach(el => {
      const cats = getCats(el);
      const matched = (v === 'all') || cats.includes(v);
      el.classList.toggle('active', matched);
    });
  }

  // Make sure UI shows default
  if (!selValue.innerText || selValue.innerText.trim() === '') {
    selValue.innerText = document.querySelector('[data-life-filter-btn].active')?.innerText?.trim() || 'All';
  }

  // Toggle dropdown open/close
  sel.addEventListener('click', (e) => {
    e.stopPropagation();
    elementToggleFunc(sel);
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', (ev) => {
    if (sel.classList.contains('active') && !sel.contains(ev.target)) {
      sel.classList.remove('active');
    }
  });

  // Close on ESC
  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape' && sel.classList.contains('active')) {
      sel.classList.remove('active');
    }
  });

  // When selecting a dropdown item
  selItems.forEach(item => {
    item.addEventListener('click', (ev) => {
      ev.stopPropagation();
      const label = item.innerText.trim();
      const value = norm(label);
      // update visible value
      selValue.innerText = label;
      // close dropdown
      sel.classList.remove('active');
      // sync top buttons active state
      filterBtns.forEach(b => b.classList.toggle('active', norm(b.innerText) === value));
      // run filter
      runFilter(value);
    });
  });

  // Top filter buttons (desktop)
  let lastClickedBtn = filterBtns.find(b => b.classList.contains('active')) || filterBtns[0] || null;
  filterBtns.forEach(btn => {
    btn.addEventListener('click', (ev) => {
      ev.preventDefault();
      const label = btn.innerText.trim();
      const value = norm(label);
      // update select visible label (so mobile shows same)
      if (selValue) selValue.innerText = label;
      // run actual filter
      runFilter(value);
      // manage active states
      if (lastClickedBtn && lastClickedBtn !== btn) lastClickedBtn.classList.remove('active');
      btn.classList.add('active');
      lastClickedBtn = btn;
    });
  });

  // Ensure initial state: if there is an active filter button, apply it — else show all
  const activeBtn = filterBtns.find(b => b.classList.contains('active'));
  if (activeBtn) {
    runFilter(norm(activeBtn.innerText));
    if (selValue) selValue.innerText = activeBtn.innerText.trim();
  } else {
    runFilter('all');
    // set first available label if not set
    if (selValue && (!selValue.innerText || selValue.innerText.trim() === '')) {
      selValue.innerText = 'All';
    }
  }

})();



// life.js — integrated final version


document.addEventListener('DOMContentLoaded', () => {
  const q = (sel, ctx = document) => (ctx || document).querySelector(sel);
  const qAll = (sel, ctx = document) => Array.from((ctx || document).querySelectorAll(sel));

  const posts = qAll('[data-life-filter-item]');
  const filterList = q('#lifeFilterList');
  const searchInput = q('#lifeSearch');
  const postsContainer = q('#lifePosts');

  // Modal elements
  const pwModal = q('#pwModal');
  const pwInput = q('#pwInput');
  const pwError = q('#pwError');
  const pwSubmit = q('#pwSubmit');
  const pwCancel = q('#pwCancel');

  let pending = { slug: null, password: null };

  // decorate protected posts with a small lock if not present
  // function decorateProtectedPosts(){
  //   posts.forEach(post => {
  //     const pw = post.getAttribute('data-life-password');
  //     if (pw && !post.querySelector('.lock-badge')) {
  //       const badge = document.createElement('span');
  //       badge.className = 'lock-badge';
  //       badge.innerText = '🔒';
  //       // place inside .thumb if exists else prepend
  //       const thumb = post.querySelector('.thumb');
  //       if (thumb) thumb.insertAdjacentElement('afterbegin', badge);
  //       else post.insertAdjacentElement('afterbegin', badge);
  //     }
  //   });
  // }
  // decorateProtectedPosts();

  function decorateProtectedPosts() {
    const posts = document.querySelectorAll("[data-life-filter-item]");
    posts.forEach(post => {
      const pw = post.getAttribute("data-life-password");

      // only add lock if post is protected AND lock not already added
      if (pw && !post.querySelector(".protected-lock")) {
        const imgWrap = post.querySelector(".project-img") || post;

        const lock = document.createElement("span");
        lock.className = "protected-lock";
        lock.setAttribute("aria-hidden", "true");

        lock.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
          xmlns="http://www.w3.org/2000/svg" focusable="false">
          <path d="M7 10V8a5 5 0 0110 0v2" 
                stroke="currentColor" stroke-width="1.5" 
                stroke-linecap="round" stroke-linejoin="round"/>
          <rect x="3" y="10" width="18" height="11" rx="2"
                stroke="currentColor" stroke-width="1.5"
                stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      `;

        // ensure container is positioned
        imgWrap.style.position = imgWrap.style.position || "relative";
        imgWrap.insertAdjacentElement("afterbegin", lock);
      }
    });
  }
  decorateProtectedPosts();

  // normalize helper
  const norm = s => (s || '').toString().toLowerCase().trim();

  // apply category filter
  function applyFilterCategory(cat) {
    const c = norm(cat || 'all');
    posts.forEach(p => {
      const pcat = norm(p.getAttribute('data-life-category') || '');
      p.style.display = (c === 'all' || pcat === c) ? '' : 'none';
    });
    // if searching, reapply search
    if (searchInput && searchInput.value.trim() !== '') applySearch(searchInput.value.trim());
  }

  // search across title, excerpt, category, slug
  function applySearch(qstr) {
    const qlower = norm(qstr || '');
    if (!qlower) {
      // reapply active category
      const activeBtn = document.querySelector('[data-life-filter-btn].active');
      const activeCat = activeBtn ? activeBtn.getAttribute('data-life-filter') : 'all';
      applyFilterCategory(activeCat);
      return;
    }
    posts.forEach(post => {
      const title = norm(q('.blog-item-title', post)?.innerText);
      const excerpt = norm(q('.blog-text', post)?.innerText);
      const cat = norm(post.getAttribute('data-life-category'));
      const slug = norm(post.getAttribute('data-life-post-slug'));
      const matches = (title && title.includes(qlower)) ||
        (excerpt && excerpt.includes(qlower)) ||
        (cat && cat.includes(qlower)) ||
        (slug && slug.includes(qlower));
      post.style.display = matches ? '' : 'none';
    });
  }

  // delegated filter click
  if (filterList) {
    filterList.addEventListener('click', (ev) => {
      const btn = ev.target.closest('[data-life-filter-btn]');
      if (!btn) return;
      ev.preventDefault();
      qAll('[data-life-filter-btn]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const category = btn.getAttribute('data-life-filter') || 'all';
      applyFilterCategory(category);
    });
  }

  // search input debounced
  if (searchInput) {
    let timer;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(timer);
      timer = setTimeout(() => applySearch(e.target.value || ''), 150);
    });
  }

  // open modal
  function openModal(slug, password) {
    pending.slug = slug;
    pending.password = password;
    pwInput.value = '';
    pwError.style.display = 'none';
    pwModal.style.display = 'flex';
    pwModal.setAttribute('aria-hidden', 'false');
    pwInput.focus();
  }

  function closeModal() {
    pwModal.style.display = 'none';
    pwModal.setAttribute('aria-hidden', 'true');
    pending.slug = null;
    pending.password = null;
    pwError.style.display = 'none';
  }

  // modal submit
  pwSubmit.addEventListener('click', () => {
    const val = pwInput.value || '';
    if (val === pending.password) {
      // correct, navigate
      window.location.href = `life/${pending.slug}`;
    } else {
      pwError.style.display = 'block';
    }
  });

  // cancel or outside click
  pwCancel.addEventListener('click', closeModal);
  pwModal.addEventListener('click', (e) => {
    if (e.target === pwModal) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && pwModal.style.display === 'flex') closeModal();
  });

  // handle post clicks
  function handlePostClick(ev) {
    const post = ev.target.closest('[data-life-filter-item]');
    if (!post) return;
    // ignore clicks on links if any
    if (ev.target.closest('a')) return;
    const slug = post.getAttribute('data-life-post-slug');
    const password = post.getAttribute('data-life-password');
    if (!slug) return;
    if (!password) {
      window.location.href = `life/${slug}`;
      return;
    }
    openModal(slug, password);
  }

  if (postsContainer) postsContainer.addEventListener('click', handlePostClick);
  else posts.forEach(p => p.addEventListener('click', handlePostClick));

  // init
  applyFilterCategory('all');
});

document.addEventListener('contextmenu', event => event.preventDefault()); // disables right-click

document.onkeydown = function(e) {
  // Disable Ctrl+U, Ctrl+Shift+I, Ctrl+S, F12, etc.
  if (e.ctrlKey && (e.key === 'u' || e.key === 's' || e.key === 'U' || e.key === 'S')) return false;
  if (e.key === 'F12') return false;
  if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i')) return false;
};

const toggle = document.getElementById("themeToggle");
        const label = document.getElementById("modeLabel");
        const body = document.body;

        // Initialize based on saved preference
        const saved = localStorage.getItem("darkMode") === "false" ? false : true;
        body.classList.toggle("light-mode", !saved);
        toggle.checked = !saved;
        label.textContent = saved ? "Light Mode" : "Dark Mode";

        // Listen for changes
        toggle.addEventListener("change", () => {
            const isLight = toggle.checked;
            body.classList.toggle("light-mode", isLight);
            // save inverse of dark-mode
            localStorage.setItem("darkMode", !isLight);
            label.textContent = isLight ? "Dark Mode" : "Light Mode";
        });
