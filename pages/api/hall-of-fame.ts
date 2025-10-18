import type { NextApiRequest, NextApiResponse } from "next";
import { getHallOfFame } from "backend/controller/hall-of-fame.controller";

// Recursive function to convert BigInts to strings
function convertBigIntToString(obj: any): any {
  if (typeof obj === "bigint") return obj.toString();
  if (Array.isArray(obj)) return obj.map(convertBigIntToString);
  if (obj !== null && typeof obj === "object") {
    const newObj: any = {};
    for (const key in obj) {
      newObj[key] = convertBigIntToString(obj[key]);
    }
    return newObj;
  }
  return obj;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { season, league } = req.query;
    const seasonNum = season ? Number(season) : undefined;
    const leagueStr = league ? String(league) : undefined;

    const data = await getHallOfFame(seasonNum, leagueStr);

    // Convert all BigInts to strings
    const safeData = convertBigIntToString(data);

    res.status(200).json(safeData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch Hall of Fame data." });
  }
}
