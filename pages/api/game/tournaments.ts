import {
  addTournament,
  getTournamentsByStatus,
  getTournamentsById,
  removeTournament,
  updateTournament,
  registerTournament,
  unregisterTournament,
} from "backend/controller/game.controller";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case "GET": {
        const { id, status } = req.query;

        if (typeof id === "string") {
          console.log("(userId, tournamentId) ", id)
          const tournament = await getTournamentsById(id.split(','));

          return res.status(200).json(tournament);
        }

        if (typeof status === "string") {
          const tournaments = await getTournamentsByStatus(status.split(','));
          return res.status(200).json(tournaments);
        }
      }

      case "POST": {
        const { id, status, uId, userEmail } = req.body;

        if (id && userEmail) {
          const registered = await registerTournament(Number(id), userEmail)
          return res.status(200).json(registered);
        }
        const updated = await updateTournament(id, status);
        return res.status(200).json(updated);
      }

      case "PATCH": {
        const { name, status, admins, startingDate, description } = req.body;
        
        if (!name || !status) {
          return res.status(400).json({ error: "Missing name or status in request body" });
        }
        const startingDateFormatted = startingDate ? new Date(startingDate) : startingDate
        const created = await addTournament({ tournamentName: name, status, admins, startingDate: startingDateFormatted, description });
        return res.status(200).json(created);
      }

      case "DELETE": {
        const { id } = req.query;

        if (typeof id !== "string") {
          return res.status(400).json({ error: "Invalid or missing ID" });
        }

        const removed = await removeTournament(id);
        return res.status(200).json({ id: removed.id });
      }

      default:
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
  } catch (error) {
    console.error("TOURNAMENT API Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
