import express from "express";
import { db } from "../firebase.js";
import {
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
  query,
  where,
} from "firebase/firestore";

const router = express.Router();
const playersRef = collection(db, "players");

// ============================
// GET todos los jugadores
// ============================
router.get("/", async (_req, res) => {
  try {
    const snapshot = await getDocs(playersRef);
    const players = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.json(players);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener jugadores", error });
  }
});

// ============================
// GET jugadores por torneo
// ============================
router.get("/tournament/:tournamentId", async (req, res) => {
  try {
    const q = query(playersRef, where("tournamentId", "==", req.params.tournamentId));
    const snapshot = await getDocs(q);
    const players = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.json(players);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener jugadores por torneo", error });
  }
});

// ============================
// POST crear jugador
// ============================
router.post("/", async (req, res) => {
  try {
    const { name, position, photo, goals, yellowCards, redCards, teamId, tournamentId } = req.body;

    const newPlayer = {
      name,
      position,
      photo: photo || null,
      goals: goals || 0,
      yellowCards: yellowCards || 0,
      redCards: redCards || 0,
      teamId,
      tournamentId,
    };

    const docRef = await addDoc(playersRef, newPlayer);
    res.json({ id: docRef.id, ...newPlayer });
  } catch (error) {
    res.status(500).json({ message: "Error al crear jugador", error });
  }
});

// ============================
// PUT actualizar jugador
// ============================
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const playerRef = doc(db, "players", id);
    await updateDoc(playerRef, req.body);
    res.json({ id, ...req.body });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar jugador", error });
  }
});

// ============================
// PATCH actualizar solo estadísticas
// ============================
router.patch("/:id/stats", async (req, res) => {
  try {
    const { id } = req.params;
    const playerRef = doc(db, "players", id);
    await updateDoc(playerRef, {
      goals: req.body.goals,
      yellowCards: req.body.yellowCards,
      redCards: req.body.redCards,
    });
    res.json({ id, ...req.body });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar estadísticas", error });
  }
});

// ============================
// DELETE eliminar jugador
// ============================
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const playerRef = doc(db, "players", id);
    await deleteDoc(playerRef);
    res.json({ message: "Jugador eliminado" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar jugador", error });
  }
});

// ============================
// GET jugador por ID
// ============================
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const playerRef = doc(db, "players", id);
    const snapshot = await getDoc(playerRef);

    if (!snapshot.exists()) {
      return res.status(404).json({ message: "Jugador no encontrado" });
    }

    res.json({ id: snapshot.id, ...snapshot.data() });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener jugador", error });
  }
});

export default router;
