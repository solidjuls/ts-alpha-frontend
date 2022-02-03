import * as trpc from "@trpc/server";
import { z } from "zod";
import { prisma } from "backend/utils/prisma";

export const gameRouter = trpc
  .router()
  .query("get", {
    input: z.object({ id: z.number() }),
    async resolve({ input }) {
      const game = await prisma.game_results.findFirst({
        where: {
          id: input.id,
        },
      });
      const gameParsed = JSON.stringify(game, (key, value) => (typeof value === 'bigint' ? value.toString() : value))
      return gameParsed;
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
