import { startRecreatingRatings } from "backend/controller/rating.controller";
import { authenticateJWT } from "pages/api/auth/middleware";

export default async function handler(req, res) {
  authenticateJWT(req, res, async () => {
    if (req.method === "POST") {
      try {
        const newGameWithId = await startRecreatingRatings(req.body.data);
        console.log("newGameWithId", newGameWithId);
        const newGameWithIdParsed = JSON.stringify(newGameWithId, (key, value) =>
          typeof value === "bigint" ? value.toString() : value,
        );

        res.status(200).json(newGameWithIdParsed);
      } catch {
        res.status(500).json("Error submitting result");
      }
    }
  });
}
