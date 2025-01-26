import { getAllPlayers } from "backend/controller/rating.controller";
import { getCountryCodeById } from "backend/controller/user.controller";

export default async function handler(req, res) {
  const { p, pso, playerFilter, countrySelected, playdeck } = req.query;

  let playersWithRating;
  let players;

  if (countrySelected || playdeck) {
    players = await getAllPlayers(1, 10000, null);
    const tldCode = await getCountryCodeById(countrySelected);

    playersWithRating = players
      .filter(
        (player) => player.tld_code === tldCode?.tld_code || (playdeck && player.name === playdeck),
      )
      .map((player) => {
        return {
          id: player.id.toString(),
          name: player.first_name + " " + player.last_name,
          rating: player.rating,
          countryCode: player.tld_code,
          rank: parseInt(player.ranking),
        };
      });
  } else {
    players = await getAllPlayers(p, pso, playerFilter);
    playersWithRating = players.map((player) => {
      return {
        id: player.id.toString(),
        name: player.first_name + " " + player.last_name,
        rating: player.rating,
        countryCode: player.tld_code,
        rank: parseInt(player.ranking),
      };
    });
  }

  const totalRows = players.length > 0 ? players[0].total_players.toString() : "1301";
  res.status(200).json({
    results: playersWithRating,
    totalRows,
  });
}
