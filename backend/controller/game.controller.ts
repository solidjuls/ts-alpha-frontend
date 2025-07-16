import { prisma } from "backend/utils/prisma";
import { Game, GameAPI } from "types/game.types";
import { calculateRating } from "./rating.controller";
import { Prisma } from "@prisma/client";
import { TournamentStatusType } from "utils/constants";

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
        gameType: game.tournaments?.tournament_name,
        tournamentId: game.tournaments?.id,
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
export const getGameWithRatings = async (
  filter: Prisma.game_resultsWhereInput,
  page: number,
  pageSize: number,
) => {
  pageSize = pageSize || 20;

  const skip = (page - 1) * pageSize;

  const totalRows = await prisma.game_results.count({
    where: {
      ...filter,
    },
  });
  const games = await prisma.game_results.findMany({
    select: {
      id: true,
      usa_player_id: true,
      ussr_player_id: true,
      created_at: true,
      end_mode: true,
      end_turn: true,
      game_code: true,
      game_date: true,
      video1: true,
      game_winner: true,
      usa_previous_rating: true,
      ussr_previous_rating: true,
      ratings_history: {
        select: {
          rating: true,
          player_id: true,
        },
      },
      tournaments: {
        select: {
          tournament_name: true,
          id: true,
        },
      },
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
    },
    where: {
      ...filter,
    },
    skip,
    take: pageSize,
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
  const getGamesWithRating = await getGamesWithRatingDifference(normalizedGames);
  console.log("getGamesWithRating", getGamesWithRating);
  return { getGamesWithRating, totalRows };
};

export const getGameByGameId = async (id: string) =>
  await prisma.game_results.findFirst({
    select: {
      created_at: true,
      updated_at: true,
      reported_at: true,
      usa_player_id: true,
      ussr_player_id: true,
      game_winner: true,
      game_type: true,
    },
    where: {
      id: Number(id),
    },
  });

export const getTournamentNames = async (status: TournamentStatusType | undefined) => {
  const filter = status
    ? {
        where: {
          status_id: Number(status),
        },
      }
    : undefined;

  return await prisma.tournaments.findMany({
    select: {
      id: true,
      tournament_name: true,
      status_id: true,
      created_at: true,
    },
    ...filter,
    orderBy: {
      created_at: "desc",
    },
  });
};

export const removeTournament = async (id: string) => {
  console.log("id", id);
  return await prisma.tournaments.delete({
    where: {
      id: Number(id),
    },
  });
};

export const addTournament = async (tournamentName: string, status: TournamentStatusType) => {
  return await prisma.tournaments.create({
    data: {
      tournament_name: tournamentName,
      status_id: Number(status),
    },
  });
};

export const updateTournament = async (id: number, status: TournamentStatusType) => {
  return await prisma.tournaments.update({
    where: {
      id: id,
    },
    data: {
      status_id: Number(status),
    },
  });
};

const submitGame = async (data: GameAPI) => {
  const { newUsaRating, newUssrRating, usaRating, ussrRating } = await calculateRating({
    usaPlayerId: BigInt(data.usaPlayerId),
    ussrPlayerId: BigInt(data.ussrPlayerId),
    gameWinner: data.gameWinner,
    gameType: data.gameType,
  });

  const dateNow = new Date(Date.now());
  const newGame = {
    created_at: dateNow,
    updated_at: dateNow,
    usa_player_id: BigInt(data.usaPlayerId),
    ussr_player_id: BigInt(data.ussrPlayerId),
    usa_previous_rating: usaRating,
    ussr_previous_rating: ussrRating,
    game_type: Number(data.gameType),
    game_code: data.gameCode,
    reported_at: dateNow,
    game_winner: data.gameWinner,
    end_turn: Number(data.endTurn),
    end_mode: data.endMode,
    game_date: dateNow,
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

export const submit = async (data: GameAPI) => {
  try {
    const newGameWithId = await submitGame(data);
    const newGameWithIdParsed = JSON.stringify(newGameWithId, (key, value) =>
      typeof value === "bigint" ? value.toString() : value,
    );
    return JSON.parse(newGameWithIdParsed);
  } catch (e) {
    throw e;
  }
};
