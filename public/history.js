data.forEach(record => {
  const card = document.createElement("div");
  card.className = "history-card";

  // Determine category class
  let catClass = "";
  switch(record.category.toLowerCase()) {
    case "underweight": catClass = "underweight"; break;
    case "normal weight": catClass = "normal"; break;
    case "overweight": catClass = "overweight"; break;
    case "obese": catClass = "obese"; break;
  }

  card.innerHTML = `
    <div class="card-header">
      <strong>${record.name}</strong>
      <span class="category-badge ${catClass}">
        ${record.category}
      </span>
    </div>

    <div class="card-body">
      <p><b>Gender:</b> ${record.gender}</p>
      <p><b>Age:</b> ${record.age}</p>
      <p><b>Weight:</b> ${record.weight} kg</p>
      <p><b>Height:</b> ${record.height} cm</p>
      <p><b>BMI:</b> ${record.bmi}</p>
      ${record.ideal_weight ? `<p><b>Ideal Weight:</b> ${record.ideal_weight} kg</p>` : ""}
      <p><b>Energy:</b> ${record.energy} kcal/day</p>
      <p class="date">${new Date(record.created_at).toLocaleDateString()}</p>
    </div>
  `;

  historyList.appendChild(card);
});
