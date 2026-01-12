document.addEventListener("DOMContentLoaded", async () => {
  const historyList = document.getElementById("historyList");

  if (!historyList) {
    console.error("❌ historyList element not found");
    return;
  }

  historyList.innerHTML = "<p>Loading records...</p>";

  try {
    const res = await fetch("/nutrition");

    if (!res.ok) {
      throw new Error(`Server error: ${res.status}`);
    }

    const data = await res.json();

    if (!Array.isArray(data) || data.length === 0) {
      historyList.innerHTML = "<p>No nutrition records found</p>";
      return;
    }

    historyList.innerHTML = "";

    data.forEach(r => {
      const div = document.createElement("div");
      div.className = "history-card";

      div.innerHTML = `
        <p><b>Name:</b> ${r.name}</p>
        <p><b>Gender:</b> ${r.gender}</p>
        <p><b>Age:</b> ${r.age}</p>
        <p><b>Weight:</b> ${r.weight} kg</p>
        <p><b>Height:</b> ${r.height} cm</p>
        <p><b>BMI:</b> ${r.bmi} (${r.category})</p>
        ${r.ideal_weight ? `<p><b>Ideal:</b> ${r.ideal_weight} kg</p>` : ""}
        <p><b>Energy:</b> ${r.energy} kcal/day</p>
        <small>${new Date(r.created_at).toLocaleString()}</small>
      `;

      historyList.appendChild(div);
    });

  } catch (err) {
    console.error("❌ History load failed:", err);
    historyList.innerHTML = "<p>Failed to load history ❌</p>";
  }
});
