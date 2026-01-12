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
 * LOAD USER
 *************************************************/
window.addEventListener("load", () => {
  const savedName = localStorage.getItem("bt_user");
  if (savedName) {
    fnameEl.value = savedName;
    greetEl.textContent = `Welcome back, ${savedName}`;
  }
});

/*************************************************
 * CALCULATE + SAVE
 *************************************************/
btn.addEventListener("click", async (e) => {
  e.preventDefault();

  // Reset results
  [resultEl, idealEl, energyEl].forEach(el => {
    el.textContent = "";
    el.classList.remove("show-result");
  });

  // Collect input
  const name = fnameEl.value.trim();
  const gender = genderEl.value;
  const age = Number(ageEl.value);
  const weight = Number(weightEl.value);
  const height = Number(heightEl.value);
  const activity = Number(activityEl.value);

  // Validation
  if (!name || !gender || age <= 0 || weight <= 0 || height <= 0 || !activity) {
    resultEl.textContent = "Please fill in all required fields correctly.";
    resultEl.classList.add("show-result");
    return;
  }

  greetEl.textContent = `Hello ${name}`;

  /**************** BMI ****************/
  const bmi = weight / ((height / 100) ** 2);
  const bmiValue = Number(bmi.toFixed(2));

  let category =
    bmi < 18.5 ? "Underweight" :
    bmi < 25 ? "Normal weight" :
    bmi < 30 ? "Overweight" : "Obese";

  resultEl.textContent =
    `${name}, your BMI is ${bmiValue} kg/m² (${category})`;

  /**************** IDEAL BODY WEIGHT ****************/
  let idealWeight = null;
  if (category !== "Normal weight") {
    idealWeight = Number((21.65 * ((height / 100) ** 2)).toFixed(2));
    idealEl.textContent = `Ideal body weight ≈ ${idealWeight} kg`;
  }

  /**************** ENERGY ****************/
  const BMR =
    gender === "male"
      ? 66.5 + (13.7 * weight) + (5 * height) - (6.8 * age)
      : 665 + (9.6 * weight) + (1.8 * height) - (4.7 * age);

  const energyNeed = Number((BMR * activity * 1.1).toFixed(0));
  energyEl.textContent =
    `Daily energy requirement ≈ ${energyNeed} kcal/day`;

  [resultEl, idealEl, energyEl].forEach(el =>
    el.classList.add("show-result")
  );

  /*************************************************
   * SAVE TO BACKEND (/nutrition route)
   *************************************************/
  const record = {
    name,
    gender,
    age,
    weight,
    height,
    bmi: bmiValue,
    category,
    ideal_weight: idealWeight,
    energy: energyNeed
  };

  // Save username locally
  localStorage.setItem("bt_user", name);

  try {
    const res = await fetch("/nutrition", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(record)
    });

    const data = await res.json();
    if (res.ok) {
      console.log("✅ Nutrition record saved:", data.record);
    } else {
      console.error("❌ Failed to save record:", data.message);
    }
  } catch (err) {
    console.error("❌ Server save failed:", err);
  }
});
