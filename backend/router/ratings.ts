import * as trpc from "@trpc/server";
import { z } from "zod";
import { prisma } from "backend/utils/prisma";
import { Ratings } from "types/ratings.types";

const getAllPlayers = async () =>
  await prisma.users.findMany({
    select: {
      id: true,
      first_name: true,
      last_name: true,
      country_id: true,
    },
  });

const getRatingByPlayer = async ({ playerId }: { playerId: bigint }) =>
  await prisma.ratings_history.findFirst({
    select: {
      rating: true,
    },
    where: {
      player_id: playerId,
    },
    orderBy: {
      created_at: "desc",
    },
  });

export const ratingsRouter = trpc.router().query("get", {
  input: z.object({ n: z.number() }),
  async resolve({ input }) {
    console.log("ratingsRouter", input.n);

    const players = await getAllPlayers();
    const playersWithRating = await Promise.all(
      players.map(async (player) => {
        const rating = await getRatingByPlayer({ playerId: player.id });
        return {
          name: player.first_name + " " + player.last_name,
          rating: rating?.rating,
        };
      })
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

    const playersWithRatingParsed = JSON.stringify(
      playersWithRatingSorted,
      (key, value) => (typeof value === "bigint" ? value.toString() : value)
    );

    return JSON.parse(playersWithRatingParsed);
  },
});
