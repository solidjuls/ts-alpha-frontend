import * as trpc from "@trpc/server";
import { z } from "zod";
import { prisma } from "backend/utils/prisma";
import { UserType } from "types/user.types";
import { getRatingByPlayer } from "backend/controller/rating.controller";

const getAllPlayers = async () =>
  await prisma.users.findMany({
    select: {
      id: true,
      first_name: true,
      last_name: true,
      countries: {
        select: {
          tld_code: true,
        },
      },
    },
  });

export const ratingsRouter = trpc.router().query("get", {
  input: z.object({ n: z.number() }),
  async resolve({ input }) {
    const players = await getAllPlayers();
    const playersWithRating = await Promise.all(
      players.map(async (player) => {
        const rating = await getRatingByPlayer({ playerId: player.id });
        return {
          name: player.first_name + " " + player.last_name,
          rating: rating?.rating,
          countryCode: player.countries?.tld_code,
        };
      }),
    );

    let playersWithRatingSorted = playersWithRating
      .filter((item) => item.rating)
      .sort((a, b) => {
        if (!a?.rating || !b?.rating) return 0;

        return b.rating - a.rating;
      });

    if (input.n !== -1) {
      playersWithRatingSorted = playersWithRatingSorted.slice(0, input.n);
    }

    return playersWithRatingSorted as UserType[];
  },
});
