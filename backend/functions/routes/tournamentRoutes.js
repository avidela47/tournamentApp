import express from "express";
import { db } from "../firebase.js"; // conexión a Firestore
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from "firebase/firestore";

const router = express.Router();
const tournamentsRef = collection(db, "tournaments");

// ============================
// GET todos los torneos
// ============================
router.get("/", async (req, res) => {
  try {
    const snapshot = await getDocs(tournamentsRef);
    const tournaments = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.json(tournaments);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener torneos", error });
  }
});

// ============================
// POST crear torneo
// ============================
router.post("/", async (req, res) => {
  try {
    const { name, logo, totalRounds, totalTeams } = req.body;
    const newTournament = {
      name,
      logo,
      totalRounds: Number(totalRounds),
      totalTeams: Number(totalTeams),
    };

    const docRef = await addDoc(tournamentsRef, newTournament);
    res.json({ id: docRef.id, ...newTournament });
  } catch (error) {
    res.status(500).json({ message: "Error al crear torneo", error });
  }
});

// ============================
// PUT actualizar torneo
// ============================
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const tournamentRef = doc(db, "tournaments", id);
    await updateDoc(tournamentRef, req.body);
    res.json({ id, ...req.body });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar torneo", error });
  }
});

// ============================
// DELETE eliminar torneo
// ============================
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const tournamentRef = doc(db, "tournaments", id);
    await deleteDoc(tournamentRef);
    res.json({ message: "Torneo eliminado" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar torneo", error });
  }
});

export default router;
