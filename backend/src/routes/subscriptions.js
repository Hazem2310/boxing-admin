import express from "express";
import { pool } from "../db.js";
import { requireAdmin } from "../middleware/auth.js";

const router = express.Router();

function isoDate(d){
  if(!d) return "";
  return String(d).slice(0,10);
}

router.get("/", requireAdmin, async (req, res) => {
  const { status = "" } = req.query;

  const [rows] = await pool.query(`
    SELECT s.*, m.full_name, m.phone, m.email
    FROM subscriptions s
    JOIN members m ON m.id = s.member_id
    WHERE m.is_deleted=0
    ORDER BY s.id DESC
  `);

  const todayStr = new Date().toISOString().slice(0,10);
  const today = new Date(todayStr);

  let items = rows.map((x) => {
    const end = new Date(isoDate(x.end_date));
    const remaining = Math.ceil((end - today) / (1000 * 60 * 60 * 24));
    const st = remaining >= 0 ? "active" : "expired";
    return {
      ...x,
      start_date: isoDate(x.start_date),
      end_date: isoDate(x.end_date),
      status: st,
      remaining_days: remaining >= 0 ? remaining : 0
    };
  });

  if (status) items = items.filter((x) => x.status === status);

  res.json({ ok: true, items });
});

router.post("/", requireAdmin, async (req, res) => {
  const { member_id, start_date, end_date, plan="monthly", notes="" } = req.body || {};
  if (!member_id || !start_date || !end_date) {
    return res.status(400).json({ ok: false, message: "member_id/start_date/end_date required" });
  }

  await pool.query(
    `INSERT INTO subscriptions (member_id, start_date, end_date, plan, notes)
     VALUES (?,?,?,?,?)`,
    [Number(member_id), start_date, end_date, plan, notes]
  );

  res.json({ ok: true });
});

router.put("/:id", requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  const { start_date, end_date, plan, notes } = req.body || {};
  if (!id) return res.status(400).json({ ok: false, message: "bad id" });

  const [cur] = await pool.query("SELECT * FROM subscriptions WHERE id=?", [id]);
  if (!cur.length) return res.status(404).json({ ok: false, message: "Not found" });

  const next = {
    start_date: start_date ?? isoDate(cur[0].start_date),
    end_date: end_date ?? isoDate(cur[0].end_date),
    plan: plan ?? cur[0].plan,
    notes: notes ?? cur[0].notes,
  };

  await pool.query(
    `UPDATE subscriptions SET start_date=?, end_date=?, plan=?, notes=? WHERE id=?`,
    [next.start_date, next.end_date, next.plan, next.notes, id]
  );

  res.json({ ok: true });
});

router.delete("/:id", requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  await pool.query(`DELETE FROM subscriptions WHERE id=?`, [id]);
  res.json({ ok: true });
});

export default router;
