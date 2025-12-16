import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../db.js";

const router = express.Router();

async function seedAdminIfNeeded() {
  const u = process.env.ADMIN_SEED_USER || "admin";
  const p = process.env.ADMIN_SEED_PASS || "admin123";

  const [rows] = await pool.query("SELECT id FROM admins WHERE username=?", [u]);
  if (rows.length) return;

  const hash = await bcrypt.hash(p, 10);
  await pool.query("INSERT INTO admins (username, password_hash) VALUES (?,?)", [u, hash]);
  console.log(`✅ Seeded admin: ${u} / ${p}`);
}

router.post("/login", async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password)
    return res.status(400).json({ ok: false, message: "username/password required" });

  const [rows] = await pool.query("SELECT * FROM admins WHERE username=?", [username]);
  const admin = rows[0];
  if (!admin) return res.status(401).json({ ok: false, message: "Invalid credentials" });

  const ok = await bcrypt.compare(password, admin.password_hash);
  if (!ok) return res.status(401).json({ ok: false, message: "Invalid credentials" });

  const token = jwt.sign({ id: admin.id, username: admin.username }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.json({ ok: true, token, admin: { id: admin.id, username: admin.username } });
});

router.seedAdminIfNeeded = seedAdminIfNeeded;
export default router;
