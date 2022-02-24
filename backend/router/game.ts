import * as trpc from "@trpc/server";
import { z } from "zod";
import { prisma } from "backend/utils/prisma";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";

const getLatestRatingByPlayer = async (playerId: bigint) => {
  const ratingPlayers = await prisma.ratings_history.findMany({
    select: {
      player_id: true,
      rating: true,
      game_result_id: true,
      created_at: true
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
  console.log("ratingPlayers666", ratingPlayers, playerId)
  return ratingPlayers;
};
export const gameRouter = trpc
  .router()
  .query("getAll", {
    async resolve({ input }) {
      const games = await prisma.game_results.findMany({
        include: {
          users_game_results_usa_player_idTousers: {
            select: {
              first_name: true,
              last_name: true,
              country_id: true
            },
          },
          users_game_results_ussr_player_idTousers: {
            select: {
              first_name: true,
              last_name: true,
              country_id: true
            },
          },
        },
        take: 30,
        orderBy: [
          {
            created_at: "desc",
          },
        ],
      });

      const gamesNormalized = await Promise.all(games.map(async (game) => {
        const usaPlayerRatings = await getLatestRatingByPlayer(game.usa_player_id);
        const ussrPlayerRatings = await getLatestRatingByPlayer(game.ussr_player_id);
        return {
          // ...game,
          created_at: game.created_at,
          endMode: game.end_mode,
          endTurn: game.end_turn,
          usaPlayerId: game.usa_player_id,
          ussrPlayerId: game.ussr_player_id,
          usaCountryId: game.users_game_results_usa_player_idTousers.country_id,
          ussrCountryId: game.users_game_results_ussr_player_idTousers.country_id,
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
      }));
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
