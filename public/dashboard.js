async function loadStudents() {
  const res = await fetch("/students");
  const data = await res.json();

  const tbody = document.getElementById("tbody");
  tbody.innerHTML = "";

  data.forEach(s => {
    tbody.innerHTML += `
<tr>
  <td data-label="ID">${s.id}</td>
  <td data-label="Name">${s.name}</td>
  <td data-label="Department">${s.department}</td>
  <td data-label="Phone">${s.phone}</td>
  <td data-label="Date">${new Date(s.created_at).toLocaleString()}</td>
</tr>`;

  });
}

loadStudents();
