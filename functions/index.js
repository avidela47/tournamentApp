const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

const app = express();

// ============================
// CORS
// ============================
app.use(cors({ origin: true }));
app.use(express.json());

// ============================
// TOURNAMENTS
// ============================
app.get("/api/tournaments", async (req, res) => {
  try {
    const snapshot = await db.collection("tournaments").get();
    const tournaments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(tournaments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/tournaments", async (req, res) => {
  try {
    const ref = await db.collection("tournaments").add(req.body);
    res.json({ id: ref.id, ...req.body });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/tournaments/:id", async (req, res) => {
  try {
    await db.collection("tournaments").doc(req.params.id).set(req.body, { merge: true });
    res.json({ id: req.params.id, ...req.body });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/tournaments/:id", async (req, res) => {
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
app.get("/api/teams", async (req, res) => {
  try {
    const snapshot = await db.collection("teams").get();
    const teams = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(teams);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/teams", async (req, res) => {
  try {
    const ref = await db.collection("teams").add(req.body);
    res.json({ id: ref.id, ...req.body });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/teams/:id", async (req, res) => {
  try {
    await db.collection("teams").doc(req.params.id).set(req.body, { merge: true });
    res.json({ id: req.params.id, ...req.body });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/teams/:id", async (req, res) => {
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
app.get("/api/players", async (req, res) => {
  try {
    const snapshot = await db.collection("players").get();
    const players = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(players);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/players", async (req, res) => {
  try {
    const ref = await db.collection("players").add(req.body);
    res.json({ id: ref.id, ...req.body });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/players/:id", async (req, res) => {
  try {
    await db.collection("players").doc(req.params.id).set(req.body, { merge: true });
    res.json({ id: req.params.id, ...req.body });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/players/:id", async (req, res) => {
  try {
    await db.collection("players").doc(req.params.id).delete();
    res.json({ message: "Jugador eliminado" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH stats jugador
app.patch("/api/players/:id/stats", async (req, res) => {
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
app.get("/api/matches", async (req, res) => {
  try {
    const snapshot = await db.collection("matches").get();
    const matches = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(matches);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/matches", async (req, res) => {
  try {
    const ref = await db.collection("matches").add(req.body);
    res.json({ id: ref.id, ...req.body });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/matches/:id", async (req, res) => {
  try {
    await db.collection("matches").doc(req.params.id).set(req.body, { merge: true });
    res.json({ id: req.params.id, ...req.body });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/matches/:id", async (req, res) => {
  try {
    await db.collection("matches").doc(req.params.id).delete();
    res.json({ message: "Partido eliminado" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================
// STANDINGS
// ============================
app.get("/api/standings/:tournamentId", async (req, res) => {
  try {
    const snapshot = await db
      .collection("standings")
      .where("tournamentId", "==", req.params.tournamentId)
      .get();
    const standings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(standings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================
// CARDS (amarillas y rojas)
// ============================
app.get("/api/stats/cards/:tournamentId", async (req, res) => {
  try {
    const snapshot = await db
      .collection("players")
      .where("tournamentId", "==", req.params.tournamentId)
      .get();

    const players = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const yellow = players.filter(p => p.yellowCards && p.yellowCards > 0);
    const red = players.filter(p => p.redCards && p.redCards > 0);

    res.json({ yellow, red });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================
// EXPORT FUNCTION
// ============================
exports.api = functions.https.onRequest(app);
