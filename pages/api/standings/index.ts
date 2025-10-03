import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { getStandings } from "backend/controller/game.controller";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { id, division } = req.query;

    if (!id) {
      return res.status(400).json({ error: "tournamentId is required" });
    }

    const userStats = await getStandings(id, division);
console.log("userStats", userStats);
    return res.status(200).json(Object.values(userStats));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
