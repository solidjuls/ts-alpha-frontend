import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
        case "GET": {
            const { uId, tId } = req.query;
            // check if user already registered or not
            // return all users registered for the tournament
            return res.status(200).json(tournaments);
        }
      case "POST": {
        const { uId, tId } = req.body;
        // save a schedule
        return res.status(200).json(tournaments);
      }
    }
} catch (error) {
    console.error("SCHEDULE API Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
