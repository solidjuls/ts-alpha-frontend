import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getHallOfFame(season?: number, league?: string) {
  const filter: any = {};

  if (season) filter.season = season;
  if (league) filter.league_type = league;

  const hallOfFame = await prisma.hallOfFame.findMany({
    where: filter,
    orderBy: { season: "asc" },
    include: {
      winner: true,
      second: true,
      third: true,
    },
  });

  // Convert BigInts to strings and concatenate first_name + last_name
  const result = hallOfFame.map((entry) => ({
    ...entry,
    id: entry.id.toString(),
    winner: entry.winner
      ? { id: entry.winner.id.toString(), name: `${entry.winner.first_name || ""} ${entry.winner.last_name || ""}`.trim() }
      : null,
    second: entry.second
      ? { id: entry.second.id.toString(), name: `${entry.second.first_name || ""} ${entry.second.last_name || ""}`.trim() }
      : null,
    third: entry.third
      ? { id: entry.third.id.toString(), name: `${entry.third.first_name || ""} ${entry.third.last_name || ""}`.trim() }
      : null,
    winnerId: entry.winnerId ? entry.winnerId.toString() : null,
    secondId: entry.secondId ? entry.secondId.toString() : null,
    thirdId: entry.thirdId ? entry.thirdId.toString() : null,
  }));

  return result;
}
