import { prisma } from "backend/utils/prisma";
import { Game } from "types/game.types";

const getGamesWithRatingDifference: (gamesWithRatingRelated: any) => Promise<Game[]> = async (
  gamesWithRatingRelated: any,
) => {
  return await Promise.all(
    gamesWithRatingRelated.map(async (game: any) => {
      const ratingsUSA = {
        rating: game.ratingHistoryUSA,
        ratingDifference: game.ratingHistoryUSA - game.usa_previous_rating,
      };

      const ratingsUSSR = {
        rating: game.ratingHistoryUSSR,
        ratingDifference: game.ratingHistoryUSSR - game.ussr_previous_rating,
      };

      return {
        id: game.id,
        created_at: game.created_at,
        endMode: game.end_mode,
        endTurn: game.end_turn,
        usaPlayerId: game.usa_player_id,
        ussrPlayerId: game.ussr_player_id,
        usaCountryCode: game?.users_game_results_usa_player_idTousers?.countries?.tld_code,
        ussrCountryCode: game?.users_game_results_ussr_player_idTousers?.countries?.tld_code,
        usaPlayer:
          game.users_game_results_usa_player_idTousers.first_name +
          " " +
          game.users_game_results_usa_player_idTousers.last_name,
        ussrPlayer:
          game.users_game_results_ussr_player_idTousers.first_name +
          " " +
          game.users_game_results_ussr_player_idTousers.last_name,
        gameType: game.game_type,
        game_code: game.game_code,
        videoURL: game.video1,
        gameWinner: game.game_winner,
        ratingsUSA,
        ratingsUSSR,
      };
    }),
  );
};

// Games with their ratings and return normalized data
export const getGameWithRatings = async (filter?: any) => {
  const games = await prisma.game_results.findMany({
    include: {
      users_game_results_usa_player_idTousers: {
        select: {
          first_name: true,
          last_name: true,
          countries: {
            select: {
              tld_code: true,
            },
          },
        },
      },
      users_game_results_ussr_player_idTousers: {
        select: {
          first_name: true,
          last_name: true,
          countries: {
            select: {
              tld_code: true,
            },
          },
        },
      },
      ratings_history: {
        select: {
          rating: true,
          player_id: true,
        },
      },
    },
    where: {
      ...filter,
    },
    take: 15,
    orderBy: [
      {
        created_at: "desc",
      },
    ],
  });
  console.log("games findMany", new Date());
  const normalizedGames = games.map((game) => {
    let ratingHistoryUSA = 0;
    let ratingHistoryUSSR = 0;
    game.ratings_history.forEach(async ({ rating, player_id }) => {
      if (player_id === game.usa_player_id) {
        ratingHistoryUSA = rating;
      } else if (player_id === game.ussr_player_id) {
        ratingHistoryUSSR = rating;
      }
    });
    return {
      ...game,
      ratingHistoryUSA,
      ratingHistoryUSSR,
    };
  });
  console.log("games normalizedGames", new Date());
  const getGamesWithRating = await getGamesWithRatingDifference(normalizedGames);
  console.log("games getGamesWithRating", new Date());
  console.log("ewqee", normalizedGames);
  return getGamesWithRating;
};

export const getGameByGameId = async (id: string) =>
  await prisma.game_results.findFirst({
    select: {
      created_at: true,
      updated_at: true,
      reported_at: true,
    },
    where: {
      id: Number(id),
    },
  });
