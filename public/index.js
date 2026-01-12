/*************************************************
 * ELEMENTS
 *************************************************/
const btn = document.getElementById("btn");
const fnameEl = document.getElementById("fname");
const genderEl = document.getElementById("gender");
const ageEl = document.getElementById("age");
const weightEl = document.getElementById("weight");
const heightEl = document.getElementById("height");
const activityEl = document.getElementById("activity");

const greetEl = document.getElementById("greet");
const resultEl = document.getElementById("result");
const idealEl = document.getElementById("ideal");
const energyEl = document.getElementById("energy");

/*************************************************
 * CALCULATE + POST TO SERVER
 *************************************************/
btn.addEventListener("click", async (e) => {
  e.preventDefault();

  // Reset display
  [resultEl, idealEl, energyEl].forEach(el => {
    el.textContent = "";
    el.classList.remove("show-result");
  });

  const name = fnameEl.value.trim();
  const gender = genderEl.value;
  const age = Number(ageEl.value);
  const weight = Number(weightEl.value);
  const height = Number(heightEl.value);
  const activity = Number(activityEl.value);

  if (!name || !gender || age <= 0 || weight <= 0 || height <= 0 || !activity) {
    resultEl.textContent = "Please fill all fields correctly.";
    resultEl.classList.add("show-result");
    return;
  }

  // BMI
  const bmi = +(weight / ((height / 100) ** 2)).toFixed(2);
  const category =
    bmi < 18.5 ? "Underweight" :
    bmi < 25 ? "Normal weight" :
    bmi < 30 ? "Overweight" : "Obese";

  resultEl.textContent = `${name}, your BMI is ${bmi} (${category})`;

  // Ideal weight
  let idealWeight = null;
  if (category !== "Normal weight") {
    idealWeight = +(21.65 * ((height / 100) ** 2)).toFixed(2);
    idealEl.textContent = `Ideal body weight ≈ ${idealWeight} kg`;
  }

  // Energy
  const BMR = gender === "male"
    ? 66.5 + (13.7 * weight) + (5 * height) - (6.8 * age)
    : 665 + (9.6 * weight) + (1.8 * height) - (4.7 * age);

  const energyNeed = Math.round(BMR * activity * 1.1);
  energyEl.textContent = `Daily energy requirement ≈ ${energyNeed} kcal/day`;

  [resultEl, idealEl, energyEl].forEach(el => el.classList.add("show-result"));

  // POST to backend
  const record = { name, gender, age, weight, height, bmi, category, ideal_weight: idealWeight, energy: energyNeed };

  try {
    const res = await fetch("/nutrition", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(record)
    });

    if (!res.ok) throw new Error("Failed to save record");

    const data = await res.json();
    console.log("Record saved:", data.record);
  } catch (err) {
    console.error("Error saving record:", err);
  }
});
