import { submit } from "backend/controller/game.controller";
import { calculateRating } from "backend/controller/rating.controller";
import { authenticateJWT } from "pages/api/auth/middleware";
import { GameAPI } from "types/game.types";

export default async function handler(req, res) {
  authenticateJWT(req, res, async () => {
    if (req.method === "POST") {
      try {
        const newGameWithId = await submit(req.body.data);
        console.log("newGameWithId", newGameWithId);
        const newGameWithIdParsed = JSON.stringify(newGameWithId, (key, value) =>
          typeof value === "bigint" ? value.toString() : value,
        );
        // return JSON.parse(newGameWithIdParsed);

        console.log("adsf", req.body);
        res.status(200).json(newGameWithIdParsed);
      } catch {
        res.status(500).json();
      }
    }
  });
}
