import { getAllPlayers } from "backend/controller/rating.controller";

export default async function handler(req, res) {
  const { p, pso } = req.query;
  const players = await getAllPlayers(p, pso);
  const playersWithRating = players.map((player) => {
    return {
      id: player.id.toString(),
      name: player.first_name + " " + player.last_name,
      rating: player.rating,
      countryCode: player.tld_code,
      lastActivity: player.last_login_at,
      rank: parseInt(player.ranking),
      totalPlayers: parseInt(player.total_players),
    };
  });

  res.status(200).json(playersWithRating);
}
