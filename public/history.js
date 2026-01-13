/*************************************************
 * ELEMENTS
 *************************************************/
const historyList = document.getElementById("historyList");
const dateFilter = document.getElementById("dateFilter");
const undoContainer = document.getElementById("undoContainer");

/*************************************************
 * STATE
 *************************************************/
let allRecords = [];

/*************************************************
 * LOCAL STORAGE KEYS
 *************************************************/
const HIDDEN_KEY = "hiddenNutritionRecords";
const UNDO_KEY = "lastDeletedRecord";

/*************************************************
 * LOAD HISTORY
 *************************************************/
document.addEventListener("DOMContentLoaded", loadHistory);

async function loadHistory() {
  historyList.innerHTML = `<p class="loading">Loading records...</p>`;

  try {
    const res = await fetch("/nutrition");
    if (!res.ok) throw new Error("Fetch failed");

    allRecords = await res.json();

    const hiddenIds = JSON.parse(localStorage.getItem(HIDDEN_KEY)) || [];
    allRecords = allRecords.filter(r => !hiddenIds.includes(r.id));

    if (allRecords.length === 0) {
      historyList.innerHTML = `<p class="empty">No records found</p>`;
      return;
    }

    renderRecords(allRecords);

  } catch (err) {
    console.error("History load error:", err);
    historyList.innerHTML = `<p class="error">Failed to load history ❌</p>`;
  }
}

/*************************************************
 * RENDER RECORDS
 *************************************************/
function renderRecords(records) {
  historyList.innerHTML = "";

  records.forEach(record => {
    const card = document.createElement("div");
    card.className = "history-card";
    card.dataset.id = record.id;

    card.innerHTML = `
      <div class="card-header">
        <strong>${record.name}</strong>
        <span>${new Date(record.created_at).toLocaleDateString()}</span>
      </div>

      <div class="card-body">
        <p><b>Gender:</b> ${record.gender}</p>
        <p><b>Age:</b> ${record.age}</p>
        <p><b>Weight:</b> ${record.weight} kg</p>
        <p><b>Height:</b> ${record.height} cm</p>
        <p><b>BMI:</b> ${record.bmi} (${record.category})</p>
        ${record.ideal_weight ? `<p><b>Ideal Weight:</b> ${record.ideal_weight} kg</p>` : ""}
        <p><b>Energy:</b> ${record.energy} kcal/day</p>

        <button class="delete-btn">Delete</button>
      </div>
    `;

    card.querySelector(".delete-btn")
        .addEventListener("click", () => deleteLocal(record));

    historyList.appendChild(card);
  });
}

/*************************************************
 * DATE FILTER
 *************************************************/
dateFilter?.addEventListener("change", () => {
  const selectedDate = dateFilter.value;

  if (!selectedDate) {
    renderRecords(allRecords);
    return;
  }

  const filtered = allRecords.filter(r =>
    r.created_at.startsWith(selectedDate)
  );

  renderRecords(filtered);
});

/*************************************************
 * LOCAL DELETE + UNDO (NO DB TOUCH)
 *************************************************/
function deleteLocal(record) {
  // Save undo record
  localStorage.setItem(UNDO_KEY, JSON.stringify(record));

  // Hide locally
  const hidden = JSON.parse(localStorage.getItem(HIDDEN_KEY)) || [];
  hidden.push(record.id);
  localStorage.setItem(HIDDEN_KEY, JSON.stringify(hidden));

  // Update UI
  allRecords = allRecords.filter(r => r.id !== record.id);
  renderRecords(allRecords);

  showUndo();
}

/*************************************************
 * UNDO UI
 *************************************************/
function showUndo() {
  undoContainer.innerHTML = `
    <div class="undo-banner">
      Record deleted
      <button id="undoBtn">Undo</button>
    </div>
  `;

  document.getElementById("undoBtn").onclick = undoDelete;

  setTimeout(() => {
    undoContainer.innerHTML = "";
  }, 6000);
}

/*************************************************
 * UNDO DELETE
 *************************************************/
function undoDelete() {
  const record = JSON.parse(localStorage.getItem(UNDO_KEY));
  if (!record) return;

  // Remove from hidden list
  let hidden = JSON.parse(localStorage.getItem(HIDDEN_KEY)) || [];
  hidden = hidden.filter(id => id !== record.id);
  localStorage.setItem(HIDDEN_KEY, JSON.stringify(hidden));

  allRecords.unshift(record);

  localStorage.removeItem(UNDO_KEY);
  undoContainer.innerHTML = "";

  renderRecords(allRecords);
}

