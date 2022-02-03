import * as trpc from "@trpc/server";
import { z } from "zod";
import { prisma } from "backend/utils/prisma";

export const userRouter = trpc
  .router()
  .query("get", {
    input: z.object({ id: z.number() }),
    async resolve({ input }) {
      console.log("getting here")
      const user = await prisma.users.findFirst({
        where: {
          id: input.id,
        },
      });
      const userParsed = JSON.stringify(user, (key, value) => (typeof value === 'bigint' ? value.toString() : value))
      return userParsed;
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

export type UserRouter = typeof userRouter;
