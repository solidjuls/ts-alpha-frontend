import {
  addTournament,
  getTournamentsByStatus,
  getTournamentsById,
  removeTournament,
  updateTournament,
} from "backend/controller/game.controller";
import { NextApiRequest, NextApiResponse } from "next/types";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { id, status } = req.body;
    const tournamentNames = await updateTournament(id, status);

    const gameParsed = JSON.stringify(tournamentNames);
    res.status(200).json(JSON.parse(gameParsed));
  } else if (req.method === "GET") {
    const { status, id } = req.query;

    let tournament;
    if (id && typeof id === "string") {
      tournament = await getTournamentsById(id);
    }
    if (status) {
      tournament = await getTournamentsByStatus(status);
    }

    const tournamentParsed = JSON.stringify(tournament);
    res.status(200).json(JSON.parse(tournamentParsed));
  } else if (req.method === "PATCH") {
    const { name, status } = req.body;

    const tournamentNames = await addTournament(name, status);

    const gameParsed = JSON.stringify(tournamentNames);
    res.status(200).json(JSON.parse(gameParsed));
  } else if (req.method === "DELETE") {
    const { id } = req.query;
    let tournament;
    if (id && typeof id === "string") {
      tournament = await removeTournament(id);
    }

    res.status(200).json(JSON.parse(tournament?.id.toString() || ""));
  }
}
