import * as trpc from "@trpc/server";
import { z } from "zod";
import { prisma } from "backend/utils/prisma";
import { dateAddDay } from "utils/dates";

type RatingByPlayerGame = {
  playerId: bigint;
  gameResultId: bigint;
};
const getRatingDifferenceByPlayerGame = async ({
  playerId,
  createdAt,
}: {
  playerId: bigint;
  createdAt: Date;
}) => {
  const ratingsPlayer = await prisma.ratings_history.findMany({
    select: {
      player_id: true,
      rating: true,
      created_at: true,
    },
    where: {
      player_id: playerId,
      created_at: {
        lte: createdAt,
      },
    },
    take: 2,
    orderBy: [
      {
        created_at: "desc",
      },
    ],
  });

  const differenceRating = ratingsPlayer[0].rating - ratingsPlayer[1].rating;
  // console.log("ratingsPlayer checking", playerId, createdAt, differenceRating);
  return differenceRating;
};
const getLatestRatingByPlayerGame = async ({
  playerId,
  gameResultId,
}: RatingByPlayerGame) => {
  const ratingPlayers = await prisma.ratings_history.findFirst({
    select: {
      rating: true,
    },
    where: {
      player_id: playerId,
      game_result_id: gameResultId,
    },
  });

  return ratingPlayers?.rating;
};

const getCountry = async (countryId: bigint) => {
  const country = await prisma.countries.findFirst({
    select: {
      icon: true,
      tld_code: true,
    },
    where: {
      id: countryId,
    },
  });

  return country;
};

export const gameRouter = trpc.router().query("getAll", {
  input: z.object({ d: z.string() }),
  async resolve({ input }) {
    const date = new Date(Date.parse(input.d));
    const datePlusOne = dateAddDay(date, 1);

    const games = await prisma.game_results.findMany({
      include: {
        users_game_results_usa_player_idTousers: {
          select: {
            first_name: true,
            last_name: true,
            country_id: true,
          },
        },
        users_game_results_ussr_player_idTousers: {
          select: {
            first_name: true,
            last_name: true,
            country_id: true,
          },
        },
      },
      where: {
        created_at: {
          lt: datePlusOne,
          gte: date,
        },
      },
      orderBy: [
        {
          created_at: "desc",
        },
      ],
    });

    const gamesNormalized = await Promise.all(
      games.map(async (game) => {
        const usaPlayerRatings = await getLatestRatingByPlayerGame({
          playerId: game.usa_player_id,
          gameResultId: game.id,
        });
        const ussrPlayerRatings = await getLatestRatingByPlayerGame({
          playerId: game.ussr_player_id,
          gameResultId: game.id,
        });
        const usaRatingDifference = await getRatingDifferenceByPlayerGame({
          playerId: game.usa_player_id,
          createdAt: game.created_at as Date,
        });
        const ussrRatingDifference = await getRatingDifferenceByPlayerGame({
          playerId: game.ussr_player_id,
          createdAt: game.created_at as Date,
        });

        getRatingDifferenceByPlayerGame({
          playerId: game.ussr_player_id,
          createdAt: game.created_at  as Date,
        });
        let countryUSA;
        let countryUSSR;
        if (game.users_game_results_usa_player_idTousers.country_id) {
          countryUSA = await getCountry(
            game.users_game_results_usa_player_idTousers.country_id
          );
        }
        if (game.users_game_results_ussr_player_idTousers.country_id) {
          countryUSSR = await getCountry(
            game.users_game_results_ussr_player_idTousers.country_id
          );
        }

        return {
          created_at: game.created_at,
          endMode: game.end_mode,
          endTurn: game.end_turn,
          usaPlayerId: game.usa_player_id,
          ussrPlayerId: game.ussr_player_id,
          usaCountryCode: countryUSA?.tld_code,
          ussrCountryCode: countryUSSR?.tld_code,
          usaCountryIcon: countryUSA?.icon,
          ussrCountryIcon: countryUSSR?.icon,
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
          ratingsUSA: {
            rating: usaPlayerRatings,
            ratingDifference: usaRatingDifference,
          },
          ratingsUSSR: {
            rating: ussrPlayerRatings,
            ratingDifference: ussrRatingDifference,
          },
        };
      })
    );
    const gameParsed = JSON.stringify(gamesNormalized, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    );
    return JSON.parse(gameParsed);
  },
});

export type GameRouter = typeof gameRouter;
