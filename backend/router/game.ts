import * as trpc from "@trpc/server";
import { z } from "zod";
import { prisma } from "backend/utils/prisma";
import { dateAddDay } from "utils/dates";

const getPreviousRating = async ({
  playerId,
  createdAt,
}: {
  playerId: bigint;
  createdAt: Date;
}) => {
  const ratingsPlayer = await prisma.ratings_history.findFirst({
    select: {
      rating: true,
    },
    where: {
      player_id: playerId,
      created_at: {
        lt: createdAt,
      },
    },
    orderBy: [
      {
        created_at: "desc",
      },
    ],
  });

  return ratingsPlayer?.rating as number;
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
        ratings_history: {
          select: {
            rating: true,
            player_id: true,
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

    const gamesWithRatingRelated = games.map((game) => {
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
    const gamesNormalized = await Promise.all(
      gamesWithRatingRelated.map(async (game) => {
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
    const gameParsed = JSON.stringify(gamesNormalized, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    );
    return JSON.parse(gameParsed);
  },
});

export type GameRouter = typeof gameRouter;
