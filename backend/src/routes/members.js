import express from "express";
import { pool } from "../db.js";
import { requireAdmin } from "../middleware/auth.js";

const router = express.Router();

router.get("/", requireAdmin, async (req, res) => {
  const { q = "" } = req.query;
  const where = ["is_deleted=0"];
  const params = [];
  if (q) {
    where.push("(full_name LIKE ? OR phone LIKE ? OR email LIKE ?)");
    params.push(`%${q}%`, `%${q}%`, `%${q}%`);
  }
  const [rows] = await pool.query(
    `SELECT * FROM members WHERE ${where.join(" AND ")} ORDER BY id DESC`,
    params
  );
  res.json({ ok: true, items: rows });
});

router.post("/", requireAdmin, async (req, res) => {
  const { full_name, phone = "", email = "" } = req.body || {};
  if (!full_name?.trim()) return res.status(400).json({ ok: false, message: "full_name required" });

  const [r] = await pool.query(
    `INSERT INTO members (full_name, phone, email) VALUES (?,?,?)`,
    [full_name.trim(), phone, email]
  );
  const [rows] = await pool.query("SELECT * FROM members WHERE id=?", [r.insertId]);
  res.json({ ok: true, item: rows[0] });
});

router.put("/:id", requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  const { full_name, phone, email } = req.body || {};
  if (!id) return res.status(400).json({ ok: false, message: "bad id" });

  const [cur] = await pool.query("SELECT * FROM members WHERE id=? AND is_deleted=0", [id]);
  if (!cur.length) return res.status(404).json({ ok: false, message: "Not found" });

  const next = {
    full_name: (full_name ?? cur[0].full_name)?.trim(),
    phone: phone ?? cur[0].phone,
    email: email ?? cur[0].email,
  };

  await pool.query(
    `UPDATE members SET full_name=?, phone=?, email=? WHERE id=?`,
    [next.full_name, next.phone, next.email, id]
  );

  const [rows] = await pool.query("SELECT * FROM members WHERE id=?", [id]);
  res.json({ ok: true, item: rows[0] });
});

router.delete("/:id", requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  await pool.query("UPDATE members SET is_deleted=1 WHERE id=?", [id]);
  res.json({ ok: true });
});

export default router;
