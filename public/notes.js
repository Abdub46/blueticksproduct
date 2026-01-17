document.addEventListener("DOMContentLoaded", () => {

  const noteText = document.getElementById("noteText");
  const saveNote = document.getElementById("saveNote");
  const notesList = document.getElementById("notesList");
  const searchInput = document.getElementById("searchNotes");
  const dateFilter = document.getElementById("dateFilter");
  const exportBtn = document.getElementById("exportPDF");

  if (!noteText || !saveNote || !notesList) return;

  const loggedInUser = localStorage.getItem("loggedInUser");
  if (!loggedInUser) {
    window.location.href = "login.html";
    return;
  }

  const NOTES_KEY = `myNotes_${loggedInUser}`;

  function getNotes() {
    return JSON.parse(localStorage.getItem(NOTES_KEY)) || [];
  }

  function saveNotes(notes) {
    localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
  }

  function loadNotes() {
    notesList.innerHTML = "";

    let notes = getNotes();

    // 🔍 SEARCH
    const searchText = searchInput?.value.toLowerCase() || "";
    if (searchText) {
      notes = notes.filter(n => n.text.toLowerCase().includes(searchText));
    }

    // 📅 DATE FILTER
    const selectedDate = dateFilter?.value;
    if (selectedDate) {
      notes = notes.filter(n => n.date.startsWith(selectedDate));
    }

    if (notes.length === 0) {
      notesList.innerHTML = "<li>No notes found</li>";
      return;
    }

    notes.forEach((note, index) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <div class="note-date">${note.date}</div>
        <div class="note-text">${note.text}</div>

        <div class="note-actions">
          <button onclick="editNote(${index})">✏️</button>
          <button onclick="deleteNote(${index})">🗑️</button>
        </div>
      `;
      notesList.appendChild(li);
    });
  }

  // 💾 SAVE NOTE
  saveNote.addEventListener("click", () => {
    const text = noteText.value.trim();
    if (!text) return;

    const notes = getNotes();
    notes.unshift({
      text,
      date: new Date().toLocaleString()
    });

    saveNotes(notes);
    noteText.value = "";
    loadNotes();
  });

  // 🗑️ DELETE NOTE
  window.deleteNote = function (index) {
    const notes = getNotes();
    if (!confirm("Delete this note?")) return;

    notes.splice(index, 1);
    saveNotes(notes);
    loadNotes();
  };

  // ✏️ EDIT NOTE
  window.editNote = function (index) {
    const notes = getNotes();
    const newText = prompt("Edit note:", notes[index].text);
    if (newText === null || newText.trim() === "") return;

    notes[index].text = newText;
    notes[index].date = new Date().toLocaleString();
    saveNotes(notes);
    loadNotes();
  };

  // 📤 EXPORT TO PDF (OFFLINE)
  exportBtn?.addEventListener("click", () => {
    const notes = getNotes();
    if (notes.length === 0) {
      alert("No notes to export");
      return;
    }

    let content = `<h1>My Notes</h1><hr>`;
    notes.forEach(n => {
      content += `<p><strong>${n.date}</strong><br>${n.text}</p>`;
    });

    const win = window.open("", "", "width=800,height=600");
    win.document.write(content);
    win.document.close();
    win.print();
  });

  // 🔍 LISTENERS
  searchInput?.addEventListener("input", loadNotes);
  dateFilter?.addEventListener("change", loadNotes);

  loadNotes();
});

