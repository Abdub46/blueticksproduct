document.addEventListener("DOMContentLoaded", () => {

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

});
