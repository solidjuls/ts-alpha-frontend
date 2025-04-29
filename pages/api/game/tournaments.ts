import {
  addTournament,
  getTournamentNames,
  updateTournament,
} from "backend/controller/game.controller";
import { NextApiRequest, NextApiResponse } from "next/types";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { id, status } = req.body;
    const tournamentNames = await updateTournament(id, status);
    console.log(tournamentNames)

    const gameParsed = JSON.stringify(tournamentNames);
    res.status(200).json(JSON.parse(gameParsed));
  } else if (req.method === "GET") {
    const { status } = req.query;
    const tournamentNames = await getTournamentNames(status);

    const gameParsed = JSON.stringify(tournamentNames);
    res.status(200).json(JSON.parse(gameParsed));
  } else if (req.method === "PATCH") {
    const { name, status } = req.body;
    console.log(req.body);
    const tournamentNames = await addTournament(name, status);

    const gameParsed = JSON.stringify(tournamentNames);
    res.status(200).json(JSON.parse(gameParsed));
  }
}
