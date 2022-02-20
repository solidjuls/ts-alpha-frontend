import * as trpc from "@trpc/server";
import { z } from "zod";
import { prisma } from "backend/utils/prisma";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";

export const gameRouter = trpc
  .router()
  .query("getAll", {
    async resolve({ input }) {
      const games = await prisma.game_results.findMany({
        include: {
          ratings_history: true,
          users_game_results_usa_player_idTousers: {
            select: {
              first_name: true,
              last_name: true,
            },
          },
          users_game_results_ussr_player_idTousers: {
            select: {
              first_name: true,
              last_name: true,
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
      const gamesNormalized = games.map((game) => ({
        ...game,
        reportedAt: game.reported_at,
        endMode: game.end_mode,
        endTurn: game.end_turn,
        usaPlayer:
          game.users_game_results_usa_player_idTousers.first_name +
          " " +
          game.users_game_results_usa_player_idTousers.last_name,
        urssPlayer:
          game.users_game_results_ussr_player_idTousers.first_name +
          " " +
          game.users_game_results_ussr_player_idTousers.last_name,
        gameType: game.game_type,
        gameWinner: game.game_winner,
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
