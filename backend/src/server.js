import express from "express";
import cors from "cors";
import "dotenv/config";

import adminRoutes from "./routes/admin.js";
import exercisesRoutes from "./routes/exercises.js";
import membersRoutes from "./routes/members.js";
import subscriptionsRoutes from "./routes/subscriptions.js";

const app = express();
import cors from "cors";

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://amazing-gnome-ef27d8.netlify.app",
];

app.use(
  cors({
    origin: allowedOrigins, // ✅ أبسط وأضمن
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ لازم للـ preflight
app.options("*", cors({ origin: allowedOrigins }));

app.use(express.json({ limit: "1mb" }));

try {
  await adminRoutes.seedAdminIfNeeded();
} catch (e) {
  console.error("⚠️ seedAdminIfNeeded failed:", e.message);
}

app.get("/api/health", (req, res) => res.json({ ok: true }));
app.options("/api/admin/login", (req, res) => {
  res.sendStatus(204);
});

app.use("/api/admin", adminRoutes);
app.use("/api/exercises", exercisesRoutes);
app.use("/api/members", membersRoutes);
app.use("/api/subscriptions", subscriptionsRoutes);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log("✅ Backend running on", port));
