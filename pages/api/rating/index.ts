import { getAllPlayers, getRatingByPlayer } from "backend/controller/rating.controller";

export default async function handler(req, res) {
  const { n } = req.query
  const players = await getAllPlayers();
    const playersWithRating = await Promise.all(
      players.map(async (player) => {
        const rating = await getRatingByPlayer({ playerId: player.id });
        return {
          id: player.id.toString(),
          name: player.first_name + " " + player.last_name,
          rating: rating?.rating,
          countryCode: player.countries?.tld_code,
          lastActivity: player.last_login_at,
        };
      }),
    );

    let playersWithRatingSorted = playersWithRating
      .filter((item) => item.rating)
      .sort((a, b) => {
        if (!a?.rating || !b?.rating) return 0;

        return b.rating - a.rating;
      });

    if (n !== -1) {
      playersWithRatingSorted = playersWithRatingSorted.slice(0, n);
    }
    
  res.status(200).json(playersWithRatingSorted);
}
