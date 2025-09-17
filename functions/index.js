const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");

// ============================
// Inicializar Firebase Admin
// ============================
admin.initializeApp();
const db = admin.firestore();

// ============================
// Configuración Express
// ============================
const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

// ============================
// TOURNAMENTS
// ============================

// GET all tournaments
app.get("/tournaments", async (req, res) => {
  try {
    const snapshot = await db.collection("tournaments").get();
    const tournaments = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json(tournaments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST tournament
app.post("/tournaments", async (req, res) => {
  try {
    const ref = await db.collection("tournaments").add(req.body);
    res.json({ id: ref.id, ...req.body });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT tournament
app.put("/tournaments/:id", async (req, res) => {
  try {
    await db.collection("tournaments").doc(req.params.id).set(req.body, { merge: true });
    res.json({ id: req.params.id, ...req.body });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE tournament
app.delete("/tournaments/:id", async (req, res) => {
  try {
    await db.collection("tournaments").doc(req.params.id).delete();
    res.json({ message: "Torneo eliminado" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================
// TEAMS
// ============================

app.get("/teams", async (req, res) => {
  try {
    const snapshot = await db.collection("teams").get();
    const teams = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json(teams);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/teams", async (req, res) => {
  try {
    const ref = await db.collection("teams").add(req.body);
    res.json({ id: ref.id, ...req.body });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/teams/:id", async (req, res) => {
  try {
    await db.collection("teams").doc(req.params.id).set(req.body, { merge: true });
    res.json({ id: req.params.id, ...req.body });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/teams/:id", async (req, res) => {
  try {
    await db.collection("teams").doc(req.params.id).delete();
    res.json({ message: "Equipo eliminado" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================
// PLAYERS
// ============================

app.get("/players", async (req, res) => {
  try {
    const snapshot = await db.collection("players").get();
    const players = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json(players);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/players", async (req, res) => {
  try {
    const ref = await db.collection("players").add(req.body);
    res.json({ id: ref.id, ...req.body });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/players/:id", async (req, res) => {
  try {
    await db.collection("players").doc(req.params.id).set(req.body, { merge: true });
    res.json({ id: req.params.id, ...req.body });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/players/:id", async (req, res) => {
  try {
    await db.collection("players").doc(req.params.id).delete();
    res.json({ message: "Jugador eliminado" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH stats
app.patch("/players/:id/stats", async (req, res) => {
  try {
    await db.collection("players").doc(req.params.id).set(req.body, { merge: true });
    res.json({ id: req.params.id, ...req.body });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================
// MATCHES
// ============================

app.get("/matches", async (req, res) => {
  try {
    const snapshot = await db.collection("matches").get();
    const matches = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json(matches);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/matches", async (req, res) => {
  try {
    const ref = await db.collection("matches").add(req.body);
    res.json({ id: ref.id, ...req.body });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/matches/:id", async (req, res) => {
  try {
    await db.collection("matches").doc(req.params.id).set(req.body, { merge: true });
    res.json({ id: req.params.id, ...req.body });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/matches/:id", async (req, res) => {
  try {
    await db.collection("matches").doc(req.params.id).delete();
    res.json({ message: "Partido eliminado" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================
// STANDINGS (ejemplo simple)
// ============================

app.get("/standings/:tournamentId", async (req, res) => {
  try {
    const snapshot = await db.collection("standings")
      .where("tournamentId", "==", req.params.tournamentId).get();
    const standings = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json(standings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================
// CARDS (amarillas y rojas)
// ============================

app.get("/stats/cards/:tournamentId", async (req, res) => {
  try {
    const snapshot = await db.collection("players")
      .where("tournamentId", "==", req.params.tournamentId).get();

    const players = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    const yellow = players.filter((p) => p.yellowCards && p.yellowCards > 0);
    const red = players.filter((p) => p.redCards && p.redCards > 0);

    res.json({ yellow, red });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================
// EXPORT FUNCTIONS
// ============================
exports.api = functions.https.onRequest(app);
