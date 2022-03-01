import * as trpc from "@trpc/server";
import { z } from "zod";
import { prisma } from "backend/utils/prisma";

export const ratingsRouter = trpc.router().query("get", {
  input: z.object({ n: z.number() }),
  async resolve({ input }) {
    console.log("ratingsRouter", input.n);
    const ratings = await prisma.ratings_history.findMany({
      include: {
        users: {
          select: {
            first_name: true,
            last_name: true,
          },
        },
      },
      take: input.n,
      orderBy: [
        {
          rating: "desc",
        },
      ],
    });
    
    const ratingsNormalized = ratings.map((item) => ({
      name: item.users.first_name + " " + item.users.last_name,
      rating: item.rating,
    }));

    return ratingsNormalized;
  },
});
