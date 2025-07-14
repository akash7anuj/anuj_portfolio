'use strict';

// Toggle element class
const elementToggleFunc = function (elem) {
  elem.classList.toggle("active");
};

// Sidebar toggle (for mobile)
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

if (sidebar && sidebarBtn) {
  sidebarBtn.addEventListener("click", function () {
    elementToggleFunc(sidebar);
  });
}

// Image modal functionality
function openModal(src) {
  const modal = document.getElementById("imageModal");
  const img = document.getElementById("modalImage");
  if (modal && img) {
    modal.style.display = "block";
    img.src = src;
  }
}

function closeModal() {
  const modal = document.getElementById("imageModal");
  if (modal) modal.style.display = "none";
}

// Testimonials modal
const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const overlay = document.querySelector("[data-overlay]");
const modalImgData = document.querySelector("[data-modal-img]");
const modalTitleData = document.querySelector("[data-modal-title]");
const modalTextData = document.querySelector("[data-modal-text]");

const testimonialsModalFunc = function () {
  if (modalContainer && overlay) {
    modalContainer.classList.toggle("active");
    overlay.classList.toggle("active");
  }
};

testimonialsItem.forEach(item => {
  item.addEventListener("click", function () {
    modalImgData.src = this.querySelector("[data-testimonials-avatar]").src;
    modalImgData.alt = this.querySelector("[data-testimonials-avatar]").alt;
    modalTitleData.innerHTML = this.querySelector("[data-testimonials-title]").innerHTML;
    modalTextData.innerHTML = this.querySelector("[data-testimonials-text]").innerHTML;
    testimonialsModalFunc();
  });
});

if (modalCloseBtn && overlay) {
  modalCloseBtn.addEventListener("click", testimonialsModalFunc);
  overlay.addEventListener("click", testimonialsModalFunc);
}

// Escape key closes modal
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    if (modalContainer?.classList.contains("active")) {
      testimonialsModalFunc();
    }
    closeModal();
  }
});

function setupFilter(suffix = '') {
  const sel         = document.querySelector(`[data-select${suffix}]`);
  const selItems    = document.querySelectorAll(`[data-select-item${suffix}]`);
  const selValue    = document.querySelector(`[data-select-value${suffix}]`);
  const filterBtns  = document.querySelectorAll(`[data-filter-btn${suffix}]`);
  const filterItems = document.querySelectorAll(`[data-filter-item${suffix}]`);

  if (!sel || !selItems.length || !selValue || !filterItems.length) return;

  const runFilter = (value) => {
    filterItems.forEach(el => {
      // split on commas, trim whitespace
      const cats = el.dataset.category
        .toLowerCase()
        .split(/\s*,\s*/)
        .map(c => c.trim());
      // match if 'all' or exact category
      const match = value === 'all' || cats.includes(value);
      el.classList.toggle('active', match);
    });
  };

  sel.addEventListener('click', () => elementToggleFunc(sel));

  selItems.forEach(item => {
    item.addEventListener('click', () => {
      const value = item.innerText.toLowerCase();
      selValue.innerText = item.innerText;
      elementToggleFunc(sel);
      runFilter(value);
    });
  });

  let lastClickedBtn = filterBtns[0] || null;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const value = btn.innerText.toLowerCase();
      selValue.innerText = btn.innerText;
      runFilter(value);
      if (lastClickedBtn) lastClickedBtn.classList.remove("active");
      btn.classList.add("active");
      lastClickedBtn = btn;
    });
  });
}

// initialize
setupFilter();
setupFilter('-blog');



// ========== Blog Modal Functionality ==========

// 1. Grab all relevant elements
const blogLinks     = document.querySelectorAll(".blog-post-item a");
const blogModal     = document.getElementById("blogModal");
const closeBtn      = blogModal.querySelector(".blog-modal-close");
const modalImg      = document.getElementById("modalImage");
const modalCategory = document.getElementById("modalCategory");
const modalDate     = document.getElementById("modalDate");
const modalTitle    = document.getElementById("modalTitle");
const modalText     = document.getElementById("modalText");
const modalDot      = document.getElementById("modalDot");

// 2. On click of any blog item…
blogLinks.forEach(link => {
  link.addEventListener("click", function(e) {
    e.preventDefault();

    const item = this.closest(".blog-post-item");

    // Image
    modalImg.src = item.querySelector("img").src;
    // Category
    modalCategory.innerText = item.querySelector(".blog-category").innerText;
    
    // Date (text + datetime attr)
    const timeEl = item.querySelector("time");
    modalDate.innerText = timeEl.innerText;
    modalDate.setAttribute("datetime", timeEl.getAttribute("datetime"));
    // Title & Text
    modalTitle.innerText = item.querySelector(".blog-item-title").innerText;
    modalText.innerText  = item.querySelector(".blog-text").innerText;

    // Show modal
    blogModal.style.display = "flex";
  });
});

// 3. Close handlers
closeBtn.addEventListener("click", () => {
  blogModal.style.display = "none";
});
// click outside content to close
blogModal.addEventListener("click", function(e) {
  if (e.target === this) {
    blogModal.style.display = "none";
  }
});
// Esc key to close
document.addEventListener("keydown", e => {
  if (e.key === "Escape" && blogModal.style.display === "flex") {
    blogModal.style.display = "none";
  }
});

// ========== Blog Modal Functionality (Alternative) ==========
// const blogLinks   = document.querySelectorAll(".blog-post-item a");
// const blogModal   = document.getElementById("blogModal");
// const closeBtn    = blogModal.querySelector(".blog-modal-close");
// const modalImg    = document.getElementById("modalImage");
// const modalTitle  = document.getElementById("modalTitle");
// const modalText   = document.getElementById("modalText");


// blogLinks.forEach(link => {
//   link.addEventListener("click", function(e) {
//     e.preventDefault();
//     const item = this.closest(".blog-post-item");

//     modalImg.src      = item.querySelector("img").src;
//     modalTitle.innerText = item.querySelector(".blog-item-title").innerText;
//     modalText.innerText  = item.querySelector(".blog-text").innerText;

//     blogModal.style.display = "flex";
//   });
// });


// closeBtn.addEventListener("click", () => {
//   blogModal.style.display = "none";
// });


// blogModal.addEventListener("click", function(e) {
//   if (e.target === this) {
//     blogModal.style.display = "none";
//   }
// });


// ========== Contact Form Validation ==========
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

if (form && formInputs.length && formBtn) {
  formInputs.forEach(input => {
    input.addEventListener("input", function () {
      if (form.checkValidity()) {
        formBtn.removeAttribute("disabled");
      } else {
        formBtn.setAttribute("disabled", "");
      }
    });
  });
}

// ========== Page Navigation ==========
const navLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

navLinks.forEach(link => {
  link.addEventListener("click", () => {
    const target = link.textContent.trim().toLowerCase();

    pages.forEach(page => {
      page.classList.toggle("active", page.dataset.page === target);
    });

    navLinks.forEach(btn => {
      btn.classList.toggle("active", btn === link);
    });

    // Smooth scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});
