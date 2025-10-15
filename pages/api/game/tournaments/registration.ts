import { unregisterTournament } from "backend/controller/game.controller";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case "DELETE": {
        const { tournamentId, userEmail } = req.body;

        if (!tournamentId || !userEmail) {
          return res.status(400).json({ error: "Missing tournamentId or userEmail" });
        }

        const unregistered = await unregisterTournament(Number(tournamentId), userEmail);
        return res.status(200).json(unregistered);
      }

      default:
        res.setHeader("Allow", ["DELETE"]);
        return res.status(405).json({ error: `Method ${req.method} not allowed` });
    }
  } catch (error) {
    console.error("Tournament registration API error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
