import { prisma } from "backend/utils/prisma";

export const getRatingByPlayer = async ({ playerId }: { playerId: bigint }) =>
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