import { deleteGameRatings, startRecreatingRatings } from "backend/controller/rating.controller";
import { authenticateJWT } from "pages/api/auth/middleware";

export default async function handler(req, res) {
  authenticateJWT(req, res, async () => {
    if (req.method === "POST") {
      try {
        let newGameWithId = {};
        console.log("req.user.role_id", req.user);

        if (req.body.data.op === "delete") {
          newGameWithId = await deleteGameRatings(req.body.data);
        } else {
          newGameWithId = await startRecreatingRatings(req.body.data, 2);
        }
        console.log("newGameWithId", newGameWithId);
        const newGameWithIdParsed = JSON.stringify(newGameWithId, (key, value) =>
          typeof value === "bigint" ? value.toString() : value,
        );
        res.status(200).json(newGameWithIdParsed);
      } catch (e) {
        console.log("e", e.message);
        res.status(500).json(e.message);
      }
    }
  });
}
