import express from "express";
import cors from "cors";
import { onRequest } from "firebase-functions/v2/https";

// Rutas
import tournamentRoutes from "./routes/tournamentRoutes.js";
import teamRoutes from "./routes/teamRoutes.js";
import playerRoutes from "./routes/playerRoutes.js";
import matchRoutes from "./routes/matchRoutes.js";
import standingsRoutes from "./routes/standingsRoutes.js";

const app = express();

// ============================
// Middlewares
// ============================
app.use(cors({ origin: true }));
app.use(express.json());

// ============================
// Rutas API
// ============================
app.use("/api/tournaments", tournamentRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/players", playerRoutes);
app.use("/api/matches", matchRoutes);
app.use("/api/standings", standingsRoutes);

// ============================
// Ruta de prueba
// ============================
app.get("/", (_req, res) => {
  res.send("🚀 API de Tournaments funcionando en Firebase");
});

// ============================
// Exportar función a Firebase
// ============================
export const api = onRequest(app);

