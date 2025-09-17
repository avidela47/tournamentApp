import express from "express";
import { db } from "../firebase.js"; 
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, getDoc } from "firebase/firestore";

const router = express.Router();
const teamsRef = collection(db, "teams");

// ============================
// GET todos los equipos
// ============================
router.get("/", async (req, res) => {
  try {
    const snapshot = await getDocs(teamsRef);
    const teams = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.json(teams);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener equipos", error });
  }
});

// ============================
// POST crear equipo
// ============================
router.post("/", async (req, res) => {
  try {
    const { name, logo, tournamentId } = req.body;
    const newTeam = {
      name,
      logo,
      tournamentId, // 🔥 relación con torneo
    };

    const docRef = await addDoc(teamsRef, newTeam);
    res.json({ id: docRef.id, ...newTeam });
  } catch (error) {
    res.status(500).json({ message: "Error al crear equipo", error });
  }
});

// ============================
// PUT actualizar equipo
// ============================
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const teamRef = doc(db, "teams", id);
    await updateDoc(teamRef, req.body);
    res.json({ id, ...req.body });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar equipo", error });
  }
});

// ============================
// DELETE eliminar equipo
// ============================
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const teamRef = doc(db, "teams", id);
    await deleteDoc(teamRef);
    res.json({ message: "Equipo eliminado" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar equipo", error });
  }
});

// ============================
// GET un equipo por ID
// ============================
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const teamRef = doc(db, "teams", id);
    const snapshot = await getDoc(teamRef);

    if (!snapshot.exists()) {
      return res.status(404).json({ message: "Equipo no encontrado" });
    }

    res.json({ id: snapshot.id, ...snapshot.data() });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener equipo", error });
  }
});

export default router;
