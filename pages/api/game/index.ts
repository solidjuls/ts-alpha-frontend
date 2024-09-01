import { getGameWithRatings } from "backend/controller/game.controller";
import { authenticateJWT } from "pages/api/auth/middleware";

export default async function handler(req, res) {
  const { id, p = 1 } = req.query;
  let filter = undefined;
  if (id) {
    filter = {
      id,
    };
  }
  const gameNormalized = await getGameWithRatings(filter, p);

  const gameParsed = JSON.stringify(gameNormalized, (key, value) =>
    typeof value === "bigint" ? value.toString() : value,
  );

  res.status(200).json(JSON.parse(gameParsed));
}
