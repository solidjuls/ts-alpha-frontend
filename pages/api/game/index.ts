import { getGameWithRatings } from "backend/controller/game.controller";
import { Prisma } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

interface QueryParams {
  id?: string;
  p?: number;
  pageSize?: number | null;
  userFilter?: string | null;
  toFilter?: string | null;
  video?: string;
  fromDate?: string;
}

const createPrismaFilter = (params: QueryParams) => {
  const { id, userFilter, toFilter, video, fromDate } = params;

  const filter: Prisma.game_resultsWhereInput = {};

  if (id) {
    filter.id = Number(id);
  }

  if (userFilter) {
    const userFilterArray = userFilter.split(",").map(Number);
    filter.OR = [
      { usa_player_id: { in: userFilterArray } },
      { ussr_player_id: { in: userFilterArray } },
    ];
  }

  if (toFilter) {
    const toFilterArray = toFilter.split(",");
    filter.game_type = { in: toFilterArray};
  }

  if (video==='true') {
    filter.video1 = { not: null };
  }

  if (fromDate) {
    filter.game_date = { gte: new Date(fromDate) };
  }

  return filter;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { p = 1, pageSize = 20 } = req.query;
 
  let filter = createPrismaFilter(req.query)

  const { getGamesWithRating, totalRows } = await getGameWithRatings(filter, Number(p), Number(pageSize));

  const response = {
    results: getGamesWithRating,
    totalRows,
  };

  const gameParsed = JSON.stringify(response, (key, value) =>
    typeof value === "bigint" ? value.toString() : value,
  );

  res.status(200).json(JSON.parse(gameParsed));
}
