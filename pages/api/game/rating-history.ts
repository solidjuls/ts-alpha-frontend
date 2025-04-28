import { NextApiRequest, NextApiResponse } from "next";
import { Prisma } from "@prisma/client";
import { prisma } from "../../../backend/utils/prisma";

interface QueryParams {
  userFilter?: string | null;
  fromDate?: string;
}

interface RatingHistoryEntry {
  gameId: string;
  date: string;
  currentRating: number;
  previousRating: number;
  ratingChange: number;
  opponent: string;
  isUsaGame: boolean;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { userFilter, fromDate } = req.query as QueryParams;

    if (!userFilter) {
      return res.status(400).json({ error: "userFilter is required" });
    }

    const userId = parseInt(userFilter as string);

    // Build the date filter condition
    let dateFilter = "";
    if (fromDate) {
      dateFilter = `AND gr.game_date >= '${fromDate}'`;
    }

    // SQL query to get rating history
    const ratingHistory = await prisma.$queryRaw<RatingHistoryEntry[]>`
      WITH latest_ratings AS (
        SELECT 
          game_result_id,
          player_id,
          rating,
          ROW_NUMBER() OVER (PARTITION BY game_result_id, player_id ORDER BY created_at DESC) as rn
        FROM ratings_history
      )
      SELECT 
        CAST(gr.id AS CHAR) as "gameId",
        gr.game_date as "date",
        CASE 
          WHEN gr.usa_player_id = ${userId} THEN rh_usa.rating
          ELSE rh_ussr.rating
        END as "currentRating",
        CASE 
          WHEN gr.usa_player_id = ${userId} THEN gr.usa_previous_rating
          ELSE gr.ussr_previous_rating
        END as "previousRating",
        CASE 
          WHEN gr.usa_player_id = ${userId} THEN rh_usa.rating - gr.usa_previous_rating
          ELSE rh_ussr.rating - gr.ussr_previous_rating
        END as "ratingChange",
        CASE 
          WHEN gr.usa_player_id = ${userId} THEN CONCAT(u_ussr.first_name, ' ', u_ussr.last_name)
          ELSE CONCAT(u_usa.first_name, ' ', u_usa.last_name)
        END as "opponent",
        CASE 
          WHEN gr.usa_player_id = ${userId} THEN true
          ELSE false
        END as "isUsaGame"
      FROM game_results gr
      LEFT JOIN latest_ratings rh_usa ON rh_usa.player_id = gr.usa_player_id 
        AND rh_usa.game_result_id = gr.id 
        AND rh_usa.rn = 1
      LEFT JOIN latest_ratings rh_ussr ON rh_ussr.player_id = gr.ussr_player_id 
        AND rh_ussr.game_result_id = gr.id 
        AND rh_ussr.rn = 1
      LEFT JOIN users u_usa ON u_usa.id = gr.usa_player_id
      LEFT JOIN users u_ussr ON u_ussr.id = gr.ussr_player_id
      WHERE (gr.usa_player_id = ${userId} OR gr.ussr_player_id = ${userId}) ${Prisma.raw(dateFilter)}
      ORDER BY gr.game_date DESC
    `;

    // Custom JSON serialization to handle BigInt values
    const serializedData = JSON.stringify(ratingHistory, (_, value) => {
      if (typeof value === 'bigint') {
        return value.toString();
      }
      return value;
    });

    res.status(200).json(JSON.parse(serializedData));
  } catch (error) {
    console.error("Error fetching rating history:", error);
    res.status(500).json({ error: "Failed to fetch rating history" });
  }
} 