import express from "express";
import { db } from "../firebase.js";
import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

const router = express.Router();
const matchesRef = collection(db, "matches");
const teamsRef = collection(db, "teams");

// ============================
// GET posiciones de un torneo
// ============================
router.get("/:tournamentId", async (req, res) => {
  try {
    const { tournamentId } = req.params;

    // Traer todos los equipos del torneo
    const qTeams = query(teamsRef, where("tournamentId", "==", tournamentId));
    const teamsSnapshot = await getDocs(qTeams);
    const teams = teamsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Inicializar tabla
    const table = teams.map((team) => ({
      team: team.name,
      logo: team.logo,
      played: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDiff: 0,
      points: 0,
    }));

    // Traer todos los partidos del torneo
    const qMatches = query(matchesRef, where("tournamentId", "==", tournamentId));
    const matchesSnapshot = await getDocs(qMatches);
    const matches = matchesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Calcular estadísticas
    matches.forEach((match) => {
      const home = table.find((t) => t.team === match.homeTeamName);
      const away = table.find((t) => t.team === match.awayTeamName);

      if (!home || !away) return;

      home.played++;
      away.played++;

      home.goalsFor += match.homeGoals;
      home.goalsAgainst += match.awayGoals;
      away.goalsFor += match.awayGoals;
      away.goalsAgainst += match.homeGoals;

      if (match.homeGoals > match.awayGoals) {
        home.wins++;
        home.points += 3;
        away.losses++;
      } else if (match.homeGoals < match.awayGoals) {
        away.wins++;
        away.points += 3;
        home.losses++;
      } else {
        home.draws++;
        away.draws++;
        home.points++;
        away.points++;
      }

      home.goalDiff = home.goalsFor - home.goalsAgainst;
      away.goalDiff = away.goalsFor - away.goalsAgainst;
    });

    // Ordenar tabla
    table.sort((a, b) => b.points - a.points || b.goalDiff - a.goalDiff);

    res.json(table);
  } catch (error) {
    res.status(500).json({ message: "Error al calcular posiciones", error });
  }
});

export default router;
