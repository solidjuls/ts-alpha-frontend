import { getTournamentNames } from "backend/controller/game.controller";

export default async function handler(req, res) {
  const tournamentNames = await getTournamentNames();

  const gameParsed = JSON.stringify(tournamentNames);
  res.status(200).json(JSON.parse(gameParsed));
}
