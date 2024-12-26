import { submit } from "backend/controller/game.controller";
import { authenticateJWT } from "pages/api/auth/middleware";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  authenticateJWT(req, res, async () => {
    if (req.method === "POST") {
      try {
        const newGameWithId = await submit(req.body.data);
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
