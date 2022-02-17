import * as trpc from "@trpc/server";
import { string, z } from "zod";
import { prisma } from "backend/utils/prisma";

export const userRouter = trpc
  .router()
  .query("get", {
    input: z.object({ mail: z.string(), pwd: z.string() }),
    async resolve({ input }) {
      const user = await prisma.users.findFirst({
        where: {
          email: input.mail,
        },
      });
      const userParsed = JSON.stringify(user, (key, value) =>
        typeof value === "bigint" ? value.toString() : value
      );
      return JSON.parse(userParsed);
    },
  })
  .query("get-all", {
    async resolve() {
      const user = await prisma.users.findMany({
        select: {
          id: true,
          first_name: true,
          last_name: true,
        },
      });
      const userParsed = JSON.stringify(user, (key, value) =>
        typeof value === "bigint" ? value.toString() : value
      );
      return JSON.parse(userParsed).map((user: any) => ({
        id: user.id,
        name: `${user.first_name} ${user.last_name}`,
      }));
    },
  })
  .mutation("update", {
    input: z.object({
      mail: z.string(),
      password: z.string(),
    }),
    async resolve({ input }) {
      const updateUser = await prisma.users.update({
        where: {
          email: input.mail,
        },
        data: {
          password: input.password,
        },
      });
      console.log("really", updateUser);
      return { success: true };
    },
  });

export type UserRouter = typeof userRouter;
