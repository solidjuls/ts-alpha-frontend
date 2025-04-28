import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../backend/utils/prisma";

interface RankingResult {
  id: number;
  first_name: string;
  name: string;
  last_name: string;
  last_login_at: Date;
  tld_code: string;
  rating: bigint;
  ranking: bigint;
  federation_ranking: bigint;
  federation_total_players: bigint;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { userId } = req.query;

    if (!userId || Array.isArray(userId)) {
      return res.status(400).json({ error: "userId is required and must be a string" });
    }

    // Get the user's ranking using the existing SQL query
    const userRanking = await prisma.$queryRaw<RankingResult[]>`
      WITH ordered_player_ratings AS
      (
        SELECT 
          ROW_NUMBER() OVER(PARTITION BY player_id ORDER BY created_at DESC) desc_player_rating_count,
          rating,
          player_id
        FROM ratings_history
      ),
      all_player_rankings AS (
        SELECT
          users.id,
          first_name,
          name,
          last_name,
          last_login_at,
          tld_code,
          rating,
          ROW_NUMBER() OVER (ORDER BY rating DESC) AS ranking,
          COUNT(*) OVER() as total_players,
          ROW_NUMBER() OVER (PARTITION BY tld_code ORDER BY rating DESC) as federation_ranking,
          COUNT(*) OVER (PARTITION BY tld_code) as federation_total_players
        FROM ordered_player_ratings
        INNER JOIN users
          ON users.id = ordered_player_ratings.player_id
        LEFT JOIN countries
          ON users.country_id = countries.id
        WHERE desc_player_rating_count = 1
      )
      SELECT *
      FROM all_player_rankings
      WHERE id = ${parseInt(userId)}
    `;

    if (!userRanking || userRanking.length === 0) {
      return res.status(404).json({ error: "User ranking not found" });
    }

    const ranking = userRanking[0];

    // Convert all BigInt values to strings before sending response
    const response = {
      ranking: ranking.ranking?.toString() || "0",
      rating: ranking.rating?.toString() || "0",
      federationRanking: ranking.federation_ranking?.toString() || "0",
      federationTotalPlayers: ranking.federation_total_players?.toString() || "0"
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching user ranking:", error);
    res.status(500).json({ error: "Failed to fetch user ranking" });
  }
} 