import express from "express";
import { pool } from "../db.js";
import { requireAdmin } from "../middleware/auth.js";

const router = express.Router();

const mapRow = (r) => ({
  id: r.id,
  title: r.title,
  level: r.level,
  category: r.category,
  duration_sec: Number(r.duration_sec || 0),
  description: r.description || "",
  video_url: r.video_url || "",
  equipment: r.equipment || "",
  created_at: r.created_at,
  updated_at: r.updated_at,
});

router.get("/", requireAdmin, async (req, res) => {
  const { q = "", level = "", category = "" } = req.query;

  const where = ["is_deleted=0"];
  const params = [];

  if (q) {
    where.push("(title LIKE ? OR description LIKE ? OR category LIKE ?)");
    params.push(`%${q}%`, `%${q}%`, `%${q}%`);
  }
  if (level) {
    where.push("level=?");
    params.push(level);
  }
  if (category) {
    where.push("category=?");
    params.push(category);
  }

  const [rows] = await pool.query(
    `SELECT * FROM exercises WHERE ${where.join(" AND ")} ORDER BY updated_at DESC`,
    params
  );

  res.json({ ok: true, items: rows.map(mapRow) });
});

router.post("/", requireAdmin, async (req, res) => {
  const {
    title,
    level = "beginner",
    category = "General",
    duration_sec = 180,
    description = "",
    video_url = "",
    equipment = "",
  } = req.body || {};

  if (!title?.trim()) return res.status(400).json({ ok: false, message: "title required" });

  const [r] = await pool.query(
    `INSERT INTO exercises (title, level, category, duration_sec, description, video_url, equipment)
     VALUES (?,?,?,?,?,?,?)`,
    [title.trim(), level, category.trim(), Number(duration_sec), description, video_url, equipment]
  );

  const [rows] = await pool.query("SELECT * FROM exercises WHERE id=?", [r.insertId]);
  res.json({ ok: true, item: mapRow(rows[0]) });
});

router.put("/:id", requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  if (!id) return res.status(400).json({ ok: false, message: "bad id" });

  const [cur] = await pool.query("SELECT * FROM exercises WHERE id=? AND is_deleted=0", [id]);
  if (!cur.length) return res.status(404).json({ ok: false, message: "Not found" });

  const {
    title,
    level,
    category,
    duration_sec,
    description,
    video_url,
    equipment,
  } = req.body || {};

  const next = {
    title: (title ?? cur[0].title)?.trim(),
    level: level ?? cur[0].level,
    category: (category ?? cur[0].category)?.trim(),
    duration_sec: Number(duration_sec ?? cur[0].duration_sec),
    description: description ?? cur[0].description,
    video_url: video_url ?? cur[0].video_url,
    equipment: equipment ?? cur[0].equipment,
  };

  await pool.query(
    `UPDATE exercises
     SET title=?, level=?, category=?, duration_sec=?, description=?, video_url=?, equipment=?
     WHERE id=?`,
    [
      next.title,
      next.level,
      next.category,
      next.duration_sec,
      next.description,
      next.video_url,
      next.equipment,
      id,
    ]
  );

  const [rows] = await pool.query("SELECT * FROM exercises WHERE id=?", [id]);
  res.json({ ok: true, item: mapRow(rows[0]) });
});

router.delete("/:id", requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  await pool.query("UPDATE exercises SET is_deleted=1 WHERE id=?", [id]);
  res.json({ ok: true });
});

export default router;
