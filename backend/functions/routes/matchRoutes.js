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
const matchesRef = collection(db, "matches");

// ============================
// GET todos los partidos
// ============================
router.get("/", async (_req, res) => {
  try {
    const snapshot = await getDocs(matchesRef);
    const matches = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.json(matches);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener partidos", error });
  }
});

// ============================
// GET partidos por torneo
// ============================
router.get("/tournament/:tournamentId", async (req, res) => {
  try {
    const q = query(matchesRef, where("tournamentId", "==", req.params.tournamentId));
    const snapshot = await getDocs(q);
    const matches = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.json(matches);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener partidos por torneo", error });
  }
});

// ============================
// POST crear partido
// ============================
router.post("/", async (req, res) => {
  try {
    const {
      tournamentId,
      date,
      jornada,
      homeTeamId,
      awayTeamId,
      homeGoals,
      awayGoals,
      referee,
    } = req.body;

    const newMatch = {
      tournamentId,
      date,
      jornada: Number(jornada) || 1,
      homeTeamId,
      awayTeamId,
      homeGoals: Number(homeGoals) || 0,
      awayGoals: Number(awayGoals) || 0,
      referee: referee || "",
    };

    const docRef = await addDoc(matchesRef, newMatch);
    res.json({ id: docRef.id, ...newMatch });
  } catch (error) {
    res.status(500).json({ message: "Error al crear partido", error });
  }
});

// ============================
// PUT actualizar partido
// ============================
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const matchRef = doc(db, "matches", id);
    await updateDoc(matchRef, req.body);
    res.json({ id, ...req.body });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar partido", error });
  }
});

// ============================
// DELETE eliminar partido
// ============================
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const matchRef = doc(db, "matches", id);
    await deleteDoc(matchRef);
    res.json({ message: "Partido eliminado" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar partido", error });
  }
});

// ============================
// GET partido por ID
// ============================
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const matchRef = doc(db, "matches", id);
    const snapshot = await getDoc(matchRef);

    if (!snapshot.exists()) {
      return res.status(404).json({ message: "Partido no encontrado" });
    }

    res.json({ id: snapshot.id, ...snapshot.data() });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener partido", error });
  }
});

export default router;
