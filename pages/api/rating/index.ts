import { getAllPlayers } from "backend/controller/rating.controller";

export default async function handler(req, res) {
  const { p, pso, playerFilter } = req.query;
  const players = await getAllPlayers(p, pso, playerFilter);
  const playersWithRating = players.map((player) => {
    return {
      id: player.id.toString(),
      name: player.first_name + " " + player.last_name,
      rating: player.rating,
      countryCode: player.tld_code,
      lastActivity: player.last_login_at,
      rank: parseInt(player.ranking),
      isTruncated: Boolean(player.is_truncated),
    };
  });
  const totalRows = players.length > 0 ? players[0].total_players.toString() : "1301";
  res.status(200).json({
    results: playersWithRating,
    totalRows,
  });
}
