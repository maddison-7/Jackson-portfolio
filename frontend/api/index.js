import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mysql from "mysql2/promise";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import multer from "multer";
import serverless from "serverless-http";

dotenv.config();

const app = express();
const dbName = process.env.DB_NAME || "jackson_portfolio";
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "jackson";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "jackson123";
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || bcrypt.hashSync(ADMIN_PASSWORD, 10);
const JWT_SECRET = process.env.JWT_SECRET || "jackson-portfolio-v1-development-secret-please-change";
const loginAttempts = new Map();
const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const MAX_LOGIN_ATTEMPTS = 5;

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, callback) => {
    if (file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/")) {
      callback(null, true);
      return;
    }

    callback(new Error("Only image and video files are allowed."));
  }
});

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: dbName,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

function buildDataUrl(file) {
  if (!file) {
    return "";
  }

  return `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
}

async function initializeDatabase() {
  const adminConnection = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || ""
  });

  await adminConnection.query(
    `CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
  );
  await adminConnection.end();

  await pool.query(`
    CREATE TABLE IF NOT EXISTS projects (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      category VARCHAR(255) NOT NULL,
      year VARCHAR(20) NOT NULL,
      image TEXT,
      description TEXT NOT NULL,
      tools VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS contact_messages (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      phone VARCHAR(255),
      project_type VARCHAR(255),
      budget VARCHAR(255),
      message TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  const [existingProjects] = await pool.query(`SELECT COUNT(*) AS count FROM projects`);

  if (Number(existingProjects[0].count) === 0) {
    await pool.query(`
      INSERT INTO projects (title, category, year, image, description, tools)
      VALUES
        (
          'Urban Identity',
          'Branding',
          '2026',
          'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1200&q=80',
          'A modern visual identity concept focused on creating a bold and memorable brand presence.',
          'Adobe Illustrator, Photoshop'
        ),
        (
          'Creative Poster',
          'Posters',
          '2026',
          'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1200&q=80',
          'An experimental poster composition combining typography, photography and geometric forms.',
          'Adobe Photoshop, Illustrator'
        )
    `);
  }
}

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

function requireAdmin(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authentication required." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
}

app.get("/api/health", async (req, res) => {
  res.json({ ok: true, message: "Portfolio API is running." });
});

app.post("/api/admin/login", (req, res) => {
  const { username, password } = req.body || {};
  const attemptKey = `${req.ip}:${username || "unknown"}`;
  const previousAttempt = loginAttempts.get(attemptKey);
  const now = Date.now();

  if (previousAttempt && now - previousAttempt.startedAt < LOGIN_WINDOW_MS && previousAttempt.count >= MAX_LOGIN_ATTEMPTS) {
    return res.status(429).json({ message: "Too many login attempts. Try again later." });
  }

  if (!username || typeof username !== "string" || !password || typeof password !== "string") {
    return res.status(400).json({ message: "Username and password are required." });
  }

  const passwordMatches = ADMIN_PASSWORD_HASH
    ? bcrypt.compareSync(password, ADMIN_PASSWORD_HASH)
    : password === ADMIN_PASSWORD;

  if (username === ADMIN_USERNAME && passwordMatches) {
    loginAttempts.delete(attemptKey);
    const token = jwt.sign({ sub: ADMIN_USERNAME, role: "admin" }, JWT_SECRET, {
      expiresIn: "8h"
    });

    return res.json({ token, user: ADMIN_USERNAME });
  }

  const nextAttempt = previousAttempt && now - previousAttempt.startedAt < LOGIN_WINDOW_MS
    ? previousAttempt
    : { startedAt: now, count: 0 };
  nextAttempt.count += 1;
  loginAttempts.set(attemptKey, nextAttempt);

  return res.status(401).json({ message: "Invalid admin credentials." });
});

app.get("/api/admin/me", requireAdmin, (req, res) => {
  res.json({ user: req.admin.sub, role: req.admin.role });
});

app.get("/api/projects", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM projects ORDER BY id DESC");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch projects.", error: error.message });
  }
});

app.post("/api/projects", requireAdmin, upload.single("media"), async (req, res) => {
  const { title, category, year, image, description, tools } = req.body;
  const imageValue = buildDataUrl(req.file) || image || "";

  if (!title || !category || !year || !description || (!imageValue && !req.file)) {
    return res.status(400).json({ message: "Title, category, year, description and project media are required." });
  }

  try {
    const [result] = await pool.query(
      "INSERT INTO projects (title, category, year, image, description, tools) VALUES (?, ?, ?, ?, ?, ?)",
      [title, category, year, imageValue, description, tools || ""]
    );

    const [rows] = await pool.query("SELECT * FROM projects WHERE id = ?", [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Failed to create project.", error: error.message });
  }
});

app.put("/api/projects/:id", requireAdmin, upload.single("media"), async (req, res) => {
  const { title, category, year, image, description, tools } = req.body;
  const imageValue = buildDataUrl(req.file) || image || "";

  try {
    await pool.query(
      "UPDATE projects SET title = ?, category = ?, year = ?, image = ?, description = ?, tools = ? WHERE id = ?",
      [title, category, year, imageValue, description, tools || "", req.params.id]
    );

    const [rows] = await pool.query("SELECT * FROM projects WHERE id = ?", [req.params.id]);
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Failed to update project.", error: error.message });
  }
});

app.delete("/api/projects/:id", requireAdmin, async (req, res) => {
  try {
    await pool.query("DELETE FROM projects WHERE id = ?", [req.params.id]);
    res.json({ message: "Project deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete project.", error: error.message });
  }
});

app.post("/api/contact", async (req, res) => {
  const { name, email, phone, projectType, budget, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: "Name, email and message are required." });
  }

  try {
    await pool.query(
      "INSERT INTO contact_messages (name, email, phone, project_type, budget, message) VALUES (?, ?, ?, ?, ?, ?)",
      [name, email, phone || "", projectType || "", budget || "", message]
    );

    res.status(201).json({ message: "Message saved successfully." });
  } catch (error) {
    res.status(500).json({ message: "Failed to save message.", error: error.message });
  }
});

app.use((error, req, res, next) => {
  console.error(error);
  res.status(error instanceof multer.MulterError ? 400 : 500).json({
    message: error.message || "Internal server error."
  });
});

if (!process.env.VERCEL) {
  async function startServer() {
    try {
      await initializeDatabase();
      app.listen(5000, () => {
        console.log("Portfolio API listening on http://localhost:5000");
      });
    } catch (error) {
      console.error("Failed to initialize database:", error);
      process.exit(1);
    }
  }

  startServer();
}

export default serverless(app);
