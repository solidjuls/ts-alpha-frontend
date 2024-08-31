import { prisma } from "backend/utils/prisma";
import { Game, GameAPI } from "types/game.types";
import { calculateRating } from "./rating.controller";

const getGamesWithRatingDifference: (gamesWithRatingRelated: any) => Promise<Game[]> = async (
  gamesWithRatingRelated: any,
) => {
  return await Promise.all(
    gamesWithRatingRelated.map(async (game: any) => {
      const ratingsUSA = {
        rating: game.ratingHistoryUSA,
        previousRating: game.usa_previous_rating,
      };

      const ratingsUSSR = {
        rating: game.ratingHistoryUSSR,
        previousRating: game.ussr_previous_rating,
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
        gameDate: game.game_date,
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
    take: 30,
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

const submitGame = async (data: GameAPI) => {
  const { newUsaRating, newUssrRating, usaRating, ussrRating } = await calculateRating({
    usaPlayerId: data.usaPlayerId,
    ussrPlayerId: data.ussrPlayerId,
    gameWinner: data.gameWinner,
    gameType: data.gameType,
  });

  console.log("newUsaRating, newUssrRating", newUsaRating, newUssrRating);
  const dateNow = new Date(Date.now());
  const newGame = {
    created_at: dateNow,
    updated_at: dateNow,
    usa_player_id: BigInt(data.usaPlayerId),
    ussr_player_id: BigInt(data.ussrPlayerId),
    usa_previous_rating: usaRating,
    ussr_previous_rating: ussrRating,
    game_type: data.gameType,
    game_code: data.gameCode,
    reported_at: dateNow,
    game_winner: data.gameWinner,
    end_turn: Number(data.endTurn),
    end_mode: data.endMode,
    game_date: new Date(Date.parse(data.gameDate)),
    video1: data.video1 || null,
    reporter_id: BigInt(data.usaPlayerId),
  };

  return await prisma.game_results.create({
    data: {
      ...newGame,
      ratings_history: {
        create: [
          {
            player_id: BigInt(data.usaPlayerId),
            rating: newUsaRating,
            game_code: data.gameCode,
            created_at: dateNow,
            updated_at: dateNow,
            total_games: 0,
            friendly_games: 0,
            usa_victories: 0,
            usa_losses: 0,
            usa_ties: 0,
            ussr_victories: 0,
            ussr_losses: 0,
            ussr_ties: 0,
          },
          {
            player_id: BigInt(data.ussrPlayerId),
            rating: newUssrRating,
            game_code: data.gameCode,
            created_at: dateNow,
            updated_at: dateNow,
            total_games: 0,
            friendly_games: 0,
            usa_victories: 0,
            usa_losses: 0,
            usa_ties: 0,
            ussr_victories: 0,
            ussr_losses: 0,
            ussr_ties: 0,
          },
        ],
      },
    },
  });
};

export const submit = async (data) => {
  const newGameWithId = await submitGame(data);
  console.log("newGameWithId", newGameWithId);
  const newGameWithIdParsed = JSON.stringify(newGameWithId, (key, value) =>
    typeof value === "bigint" ? value.toString() : value,
  );
  return JSON.parse(newGameWithIdParsed);
};
