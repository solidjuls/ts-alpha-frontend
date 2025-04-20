import { getTournamentNames } from "backend/controller/game.controller";
import { NextApiRequest, NextApiResponse } from "next/types";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { status } = req.query;
  const tournamentNames = await getTournamentNames(status);

  const gameParsed = JSON.stringify(tournamentNames);
  res.status(200).json(JSON.parse(gameParsed));
}
