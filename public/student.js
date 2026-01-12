document.addEventListener("DOMContentLoaded", () => {

  /* ===============================
     FORM SUBMISSION (UNCHANGED)
  ================================ */
  const form = document.getElementById("studentForm");
  const msg = document.getElementById("msg");

  const nameInput = document.getElementById("name");
  const departmentInput = document.getElementById("department");
  const phoneInput = document.getElementById("phone");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const student = {
      name: nameInput.value.trim(),
      department: departmentInput.value.trim(),
      phone: phoneInput.value.trim()
    };

    try {
      const res = await fetch("/student", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(student)
      });

      const data = await res.json();
      msg.textContent = data.message;

      if (res.ok) {
        form.reset();
      }

    } catch (err) {
      msg.textContent = "Server error ❌";
      console.error(err);
    }
  });


  /* ===============================
     DARK / LIGHT MODE TOGGLE
  ================================ */

  const themeToggle = document.getElementById("themeToggle");
  const themeIcon = document.getElementById("themeIcon");

  // Load saved theme
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    if (themeIcon) themeIcon.textContent = "☀️";
  }

  // Toggle theme on click
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");

      const isDark = document.body.classList.contains("dark-mode");
      if (themeIcon) themeIcon.textContent = isDark ? "☀️" : "🌙";

      localStorage.setItem("theme", isDark ? "dark" : "light");
    });
  }

});
