import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import pool from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import internshipRoutes from "./routes/internshipRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";   // ADD THIS

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

//add vercel url to cors
// telling backend to allow requests from the frontend. as they are running diff ports
app.use(cors({
  origin: ["http://localhost:5173", "https://intern-nexus-six.vercel.app"],
  credentials: true
}));
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/internships", internshipRoutes);
app.use("/api/applications", applicationRoutes);
app.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
app.patch("/test", (req, res) => {
  res.json({ message: "patch works on server level" });
});

