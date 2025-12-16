import express from "express";
import cors from "cors";
import "dotenv/config";
import adminRoutes from "./routes/admin.js";
import exercisesRoutes from "./routes/exercises.js";
import membersRoutes from "./routes/members.js";
import subscriptionsRoutes from "./routes/subscriptions.js";

const app = express();

app.use(cors({ origin: true, credentials: false }));
app.use(express.json({ limit: "1mb" }));

await adminRoutes.seedAdminIfNeeded();

app.get("/api/health", (req, res) => res.json({ ok: true }));
app.use("/api/admin", adminRoutes);
app.use("/api/exercises", exercisesRoutes);
app.use("/api/members", membersRoutes);
app.use("/api/subscriptions", subscriptionsRoutes);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log("✅ Backend running on", port));
