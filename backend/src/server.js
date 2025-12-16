import express from "express";
import cors from "cors";
import "dotenv/config";

import adminRoutes from "./routes/admin.js";
import exercisesRoutes from "./routes/exercises.js";
import membersRoutes from "./routes/members.js";
import subscriptionsRoutes from "./routes/subscriptions.js";

const app = express();

/* =========================
   CORS (نهائي + آمن)
   - يسمح لأي رابط netlify.app (Production + Preview)
   - يسمح للـ localhost للتطوير
========================= */
const allowLocal = ["http://localhost:5173", "http://localhost:3000"];

function isNetlify(origin) {
  try {
    const u = new URL(origin);
    return u.hostname.endsWith(".netlify.app");
  } catch {
    return false;
  }
}

app.use(
  cors({
    origin: (origin, cb) => {
      // Requests بدون Origin (Postman/Server-to-Server)
      if (!origin) return cb(null, true);

      if (allowLocal.includes(origin)) return cb(null, true);
      if (isNetlify(origin)) return cb(null, true);

      return cb(null, false);
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// لازم للـ preflight
app.options("*", cors());

/* =========================
   Parsers
========================= */
app.use(express.json({ limit: "1mb" }));

/* =========================
   Seed admin (آمن)
========================= */
try {
  await adminRoutes.seedAdminIfNeeded();
} catch (e) {
  console.error("⚠️ seedAdminIfNeeded failed:", e.message);
}

/* =========================
   Health + Root
========================= */
app.get("/", (req, res) => res.send("Boxing Admin API is running"));
app.get("/api/health", (req, res) => res.json({ ok: true }));

/* =========================
   Routes
========================= */
app.use("/api/admin", adminRoutes);
app.use("/api/exercises", exercisesRoutes);
app.use("/api/members", membersRoutes);
app.use("/api/subscriptions", subscriptionsRoutes);

/* =========================
   Start
========================= */
const port = process.env.PORT || 4000;
app.listen(port, () => console.log("✅ Backend running on", port));
