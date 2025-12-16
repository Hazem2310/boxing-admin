import express from "express";
import cors from "cors";
import "dotenv/config";

import adminRoutes from "./routes/admin.js";
import exercisesRoutes from "./routes/exercises.js";
import membersRoutes from "./routes/members.js";
import subscriptionsRoutes from "./routes/subscriptions.js";

const app = express();

// ✅ CORS — خليه يسمح لـ Netlify + localhost
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://amazing-gnome-ef27d8.netlify.app/", // ✅ حط رابطك هنا
];

app.use(
  cors({
    origin: (origin, cb) => {
      // السماح للـ requests اللي بدون origin (زي Postman)
      if (!origin) return cb(null, true);
      if (allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ ضروري للـ preflight
app.options("*", cors());

app.use(express.json({ limit: "1mb" }));

await adminRoutes.seedAdminIfNeeded();

app.get("/api/health", (req, res) => res.json({ ok: true }));

app.use("/api/admin", adminRoutes);
app.use("/api/exercises", exercisesRoutes);
app.use("/api/members", membersRoutes);
app.use("/api/subscriptions", subscriptionsRoutes);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log("✅ Backend running on", port));
