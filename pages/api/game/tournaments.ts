import {
  addTournament,
  getTournamentNames,
  removeTournament,
  updateTournament,
} from "backend/controller/game.controller";
import { checkAuth } from "backend/utils/adminCheck";
import { NextApiRequest, NextApiResponse } from "next/types";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    await checkAuth(req, res)
    const { id, status } = req.body;
    const tournamentNames = await updateTournament(id, status);

    const gameParsed = JSON.stringify(tournamentNames);
    res.status(200).json(JSON.parse(gameParsed));
  } else if (req.method === "GET") {
    const { status } = req.query;
    const tournamentNames = await getTournamentNames(status);

    const gameParsed = JSON.stringify(tournamentNames);
    res.status(200).json(JSON.parse(gameParsed));
  } else if (req.method === "PATCH") {
    await checkAuth(req, res)
    const { name, status } = req.body;

    const tournamentNames = await addTournament(name, status);

    const gameParsed = JSON.stringify(tournamentNames);
    res.status(200).json(JSON.parse(gameParsed));
  } else if (req.method === "DELETE") {
    await checkAuth(req, res)
    const { id } = req.query;
    const tournament = await removeTournament(id);
    console.log("tournament", tournament);
    res.status(200).json(JSON.parse(tournament.id));
  }
}
