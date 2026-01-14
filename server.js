

require("dotenv").config();
const express = require("express");
const { Pool } = require("pg");
const path = require("path");
const cors = require("cors");

const app = express();

/* =======================
   MIDDLEWARE
======================= */
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "DELETE"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

// Serve frontend
app.use(express.static(path.join(__dirname, "public")));

/* =======================
   ENV VALIDATION (POOLER)
======================= */
if (!process.env.DATABASE_URL) {
  console.error("❌ Missing DATABASE_URL in environment variables");
  process.exit(1);
}




/* =======================
   POSTGRES (SUPABASE POOLER)
======================= */
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Test DB connection
(async () => {
  try {
    const result = await pool.query(
      "SELECT current_database(), current_user"
    );
    console.log("✅ Connected via Supabase Transaction Pooler");
    console.log("📚 Database info:", result.rows[0]);
  } catch (err) {
    console.error("❌ DB connection error:", err.message);
    process.exit(1);
  }
})();

/* =======================
   ROUTES
======================= */

// Health check
app.get("/", (req, res) => {
  res.json({ status: "OK", message: "Server is running ✅" });
});

// INSERT nutrition record
app.post("/nutrition", async (req, res) => {
  const {
    name,
    gender,
    age,
    weight,
    height,
    bmi,
    category,
    ideal_weight,
    energy
  } = req.body;

  if (!name || !gender || !age || !weight || !height || !bmi || !category || !energy) {
    return res.status(400).json({ message: "All fields are required ❌" });
  }

  try {
    const { rows } = await pool.query(
      `INSERT INTO nutrition_history
       (name, gender, age, weight, height, bmi, category, ideal_weight, energy)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       RETURNING *`,
      [
        name.trim(),
        gender,
        age,
        weight,
        height,
        bmi,
        category,
        ideal_weight,
        energy
      ]
    );

    res.status(201).json({
      message: "Nutrition record saved successfully ✅",
      record: rows[0]
    });
  } catch (err) {
    console.error("❌ Insert error:", err.message);
    res.status(500).json({ message: "Failed to save record ❌" });
  }
});

// FETCH nutrition history
app.get("/nutrition", async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT * FROM nutrition_history
       ORDER BY created_at DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error("❌ Fetch error:", err.message);
    res.status(500).json({ message: "Failed to fetch records ❌" });
  }
});

// DELETE nutrition record (server-side delete)
app.delete("/nutrition/:id", async (req, res) => {
  try {
    await pool.query(
      "DELETE FROM nutrition_history WHERE id = $1",
      [req.params.id]
    );
    res.json({ message: "Record deleted ✅" });
  } catch (err) {
    console.error("❌ Delete error:", err.message);
    res.status(500).json({ message: "Delete failed ❌" });
  }
});

/* =======================
   GLOBAL ERROR HANDLER
======================= */
app.use((err, req, res, next) => {
  console.error("🔥 Unhandled error:", err);
  res.status(500).json({ message: "Internal server error" });
});

/* =======================
   START SERVER
======================= */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
