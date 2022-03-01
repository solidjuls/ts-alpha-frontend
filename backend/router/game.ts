import * as trpc from "@trpc/server";
import { z } from "zod";
import { prisma } from "backend/utils/prisma";
import { dateAddDay } from "utils/dates";

const getLatestRatingByPlayer = async (playerId: bigint) => {
  const ratingPlayers = await prisma.ratings_history.findMany({
    select: {
      player_id: true,
      rating: true,
      game_result_id: true,
      created_at: true,
    },
    take: 2,
    where: {
      player_id: playerId,
    },
    orderBy: [
      {
        created_at: "desc",
      },
    ],
  });

  return ratingPlayers;
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

export const gameRouter = trpc
  .router()
  .query("getAll", {
    input: z.object({ d: z.string() }),
    async resolve({ input }) {
      const date = new Date(Date.parse(input.d));
      const datePlusOne = dateAddDay(date, 1);
      // console.log("date entering", input.d);
      // console.log("date plus 1 day", dateAddDay(date, 1))
      // console.log("date parsed", date);
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
        // take: 1,
        orderBy: [
          {
            created_at: "desc",
          },
        ],
      });
      console.log("games returned ", games);
      const gamesNormalized = await Promise.all(
        games.map(async (game) => {
          const usaPlayerRatings = await getLatestRatingByPlayer(
            game.usa_player_id
          );
          const ussrPlayerRatings = await getLatestRatingByPlayer(
            game.ussr_player_id
          );
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
            // ...game,
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
            ratingsUSA: usaPlayerRatings,
            ratingsUSSR: ussrPlayerRatings,
          };
        })
      );
      const gameParsed = JSON.stringify(gamesNormalized, (key, value) =>
        typeof value === "bigint" ? value.toString() : value
      );
      return JSON.parse(gameParsed);
    },
  })
  .mutation("update", {
    input: z.object({
      votedFor: z.number(),
      votedAgainst: z.number(),
    }),
    async resolve({ input }) {
      // const voteInDb = await prisma.user_game_stats.findMany({
      //     where: {
      //       player_id: 2
      //     }
      //   });
      //const parsing = JSON.stringify(voteInDb, (key, value) => (typeof value === 'bigint' ? value.toString() : value))
      console.log("really", input);
      return true;
      // const voteInDb = await prisma.vote.create({
      //   data: {
      //     ...input,
      //   },
      // });
      // return { success: true, vote: voteInDb };
    },
  });

export type GameRouter = typeof gameRouter;
