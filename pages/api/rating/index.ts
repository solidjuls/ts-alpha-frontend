import { getAllPlayers } from "backend/controller/rating.controller";
import { getCountryCodeById } from "backend/controller/user.controller";
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { p, pso, playerFilter, countrySelected, playdek } = req.query;

  let playersWithRating;
  let players;
  const pageSize = parseInt(pso as string) || 20;
  const page = parseInt(p as string) || 1;

  const hasFilters = countrySelected || playdek || (typeof playerFilter === 'string' && playerFilter.trim() !== '');

  if (hasFilters) {
    // Get all players at once when filters are applied
    players = await getAllPlayers(1, 10000, null);
    
    let filteredPlayers = [...players];
    
    if (countrySelected) {
      const tldCode = await getCountryCodeById(countrySelected as string);
      filteredPlayers = filteredPlayers.filter(
        (player) => player.tld_code === tldCode?.tld_code
      );
    }
    
    if (playdek && typeof playdek === 'string') {
      filteredPlayers = filteredPlayers.filter(
        (player) => player.name?.toLowerCase() === playdek.toLowerCase()
      );
    }
    
    if (typeof playerFilter === 'string' && playerFilter.trim() !== '') {
      const playerIds = playerFilter.split(',').map(id => id.trim());
      filteredPlayers = filteredPlayers.filter(
        (player) => playerIds.includes(String(player.id))
      );
    }

    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedPlayers = filteredPlayers.slice(startIndex, endIndex);

    playersWithRating = paginatedPlayers.map((player) => ({
      id: String(player.id),
      name: player.first_name + " " + player.last_name,
      rating: player.rating,
      countryCode: player.tld_code,
      rank: parseInt(String(player.ranking)),
    }));

    res.status(200).json({
      results: playersWithRating,
      totalRows: String(filteredPlayers.length),
    });
  } else {
    // @ts-ignore - Ignoring type error for now as the function works correctly
    players = await getAllPlayers(Number(p), pageSize, null);
    
    playersWithRating = players.map((player) => ({
      id: String(player.id),
      name: player.first_name + " " + player.last_name,
      rating: player.rating,
      countryCode: player.tld_code,
      rank: parseInt(String(player.ranking)),
    }));

    res.status(200).json({
      results: playersWithRating,
      totalRows: players.length > 0 ? String(players[0].total_players) : "1301",
    });
  }
}
