import { prisma } from "backend/utils/prisma";
import { Game, SubmitGameType } from "types/game.types";
import { getPreviousRating } from "backend/controller/rating.controller";

const getGamesWithRatingDifference: (
  gamesWithRatingRelated: any
) => Promise<Game[]> = async (gamesWithRatingRelated: any) => {
  return await Promise.all(
    gamesWithRatingRelated.map(async (game: any) => {
      const usaPreviousRating = await getPreviousRating({
        playerId: game.usa_player_id,
        createdAt: game.created_at as Date,
      });
      const ratingsUSA = {
        rating: game.ratingHistoryUSA,
        ratingDifference: game.ratingHistoryUSA - usaPreviousRating,
      };
      const ussrPreviousRating = await getPreviousRating({
        playerId: game.ussr_player_id,
        createdAt: game.created_at as Date,
      });
      const ratingsUSSR = {
        rating: game.ratingHistoryUSSR,
        ratingDifference: game.ratingHistoryUSSR - ussrPreviousRating,
      };

      return {
        created_at: game.created_at,
        endMode: game.end_mode,
        endTurn: game.end_turn,
        usaPlayerId: game.usa_player_id,
        ussrPlayerId: game.ussr_player_id,
        usaCountryCode:
          game?.users_game_results_usa_player_idTousers?.countries?.tld_code,
        ussrCountryCode:
          game?.users_game_results_ussr_player_idTousers?.countries?.tld_code,
        usaPlayer:
          game.users_game_results_usa_player_idTousers.first_name +
          " " +
          game.users_game_results_usa_player_idTousers.last_name,
        ussrPlayer:
          game.users_game_results_ussr_player_idTousers.first_name +
          " " +
          game.users_game_results_ussr_player_idTousers.last_name,
        gameType: game.game_type,
        videoURL: game.video1,
        gameWinner: game.game_winner,
        ratingsUSA,
        ratingsUSSR,
      };
    })
  );
};

// Games with their ratings and return normalized data
export const getGameWithRatings = async (filter: any) => {
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
    orderBy: [
      {
        created_at: "desc",
      },
    ],
  });

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
  const getGamesWithRating = await getGamesWithRatingDifference(
    normalizedGames
  );

  return getGamesWithRating
};

export const getGameById = async (id: string) =>
  await prisma.game_results.findFirst({
    select: {
      created_at: true,
      updated_at: true,
      reported_at: true,
    },
    where: {
      id: BigInt(id),
    },
  });
