
(function () {

  const PASSWORD = "anuj123";   // <-- SET YOUR PASSWORD

  const modal = document.getElementById("pwModal");
  const input = document.getElementById("pwInput");
  const submitBtn = document.getElementById("pwSubmit");
  const cancelBtn = document.getElementById("pwCancel");
  const error = document.getElementById("pwError");
  const main = document.getElementById("mainContent");

  /* Show modal */
  function showModal() {
    modal.setAttribute("aria-hidden", "false");
    main.setAttribute("aria-hidden", "true");
    input.focus();
  }

  /* Hide modal */
  function hideModal() {
    modal.setAttribute("aria-hidden", "true");
    main.setAttribute("aria-hidden", "false");
  }

  /* Validate password */
  function checkPassword() {
    if (input.value === PASSWORD) {
      error.classList.remove("show");
      hideModal();
      input.value = "";
    } else {
      error.classList.add("show");
      input.select();
    }
  }

  submitBtn.addEventListener("click", checkPassword);

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") checkPassword();
  });

  cancelBtn.addEventListener("click", () => {
    input.value = "";
    error.classList.remove("show");
  });

  /* Always ask for password on page load — NO SESSION, NO MEMORY */
  document.addEventListener("DOMContentLoaded", () => {
    showModal();
  });

})();


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




