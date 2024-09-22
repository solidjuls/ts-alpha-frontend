import { getGameWithRatings } from "backend/controller/game.controller";

export default async function handler(req, res) {
  const { id, p = 1, pageSize = null, userFilter = null, toFilter = null } = req.query;
  let filter = {};
  if (id) {
    filter["id"] = id;
  }
  if (userFilter) {
    const userFilterArray = userFilter.split(",");
    filter["OR"] = [
      { usa_player_id: { in: userFilterArray } },
      { ussr_player_id: { in: userFilterArray } },
    ];
  }

  if (toFilter) {
    const toFilterArray = toFilter.split(",");
    filter["OR"] = [{ game_type: { in: toFilterArray } }];
  }
  const { getGamesWithRating, totalRows } = await getGameWithRatings(filter, p, parseInt(pageSize));

  const response = {
    results: getGamesWithRating,
    totalRows,
  };

  const gameParsed = JSON.stringify(response, (key, value) =>
    typeof value === "bigint" ? value.toString() : value,
  );

  res.status(200).json(JSON.parse(gameParsed));
}
