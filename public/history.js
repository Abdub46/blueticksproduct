/*************************************************
 * ELEMENTS
 *************************************************/
const historyList = document.getElementById("historyList");

/*************************************************
 * LOAD HISTORY ON PAGE LOAD
 *************************************************/
document.addEventListener("DOMContentLoaded", loadHistory);

async function loadHistory() {
  historyList.innerHTML = `<p class="loading">Loading records...</p>`;

  try {
    // Fetch from backend
    const res = await fetch("/nutrition");
    if (!res.ok) throw new Error("Failed to fetch records");

    const data = await res.json();

    if (!data || data.length === 0) {
      historyList.innerHTML = `<p class="empty">No nutrition records found</p>`;
      return;
    }

    historyList.innerHTML = "";

    // Display newest first
    data.forEach(record => {
      const card = document.createElement("div");
      card.className = "history-card";

      card.innerHTML = `
        <div class="card-header">
          <strong>${record.name}</strong>
          <span class="date">
            ${new Date(record.created_at).toLocaleDateString()}
          </span>
        </div>

        <div class="card-body">
          <p><b>Gender:</b> ${record.gender}</p>
          <p><b>Age:</b> ${record.age}</p>
          <p><b>Weight:</b> ${record.weight} kg</p>
          <p><b>Height:</b> ${record.height} cm</p>
          <p><b>BMI:</b> ${record.bmi} (${record.category})</p>
          ${record.ideal_weight ? `<p><b>Ideal Weight:</b> ${record.ideal_weight} kg</p>` : ""}
          <p><b>Energy:</b> ${record.energy} kcal/day</p>
        </div>
      `;

      historyList.appendChild(card);
    });
  } catch (err) {
    console.error("Failed to load history:", err);
    historyList.innerHTML = `<p class="error">Failed to load history ❌</p>`;
  }
}
