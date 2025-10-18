import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Hardcoded name overrides for missing users in RTSL
const overrides: Record<string, Partial<{ second: string; third: string }>> = {
  "RTSL-2018": { second: "Ackbleh" },
  "RTSL-2019-A": { third: "Siddhartha" },
};

export async function getHallOfFame(season?: string | number, league?: string) {
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

  const result = hallOfFame.map((entry) => {
    const key = `${entry.league_type}-${entry.season}`;
    const override = overrides[key] || {};

    // Build player objects
    const winner =
      entry.winner && entry.winner.id
        ? {
            id: entry.winner.id.toString(),
            name: `${entry.winner.first_name || ""} ${entry.winner.last_name || ""}`.trim(),
          }
        : null;

    const second = override.second
      ? { id: null, name: override.second } // hardcoded fallback (no link)
      : entry.second && entry.second.id
      ? {
          id: entry.second.id.toString(),
          name: `${entry.second.first_name || ""} ${entry.second.last_name || ""}`.trim(),
        }
      : null;

    const third = override.third
      ? { id: null, name: override.third } // hardcoded fallback (no link)
      : entry.third && entry.third.id
      ? {
          id: entry.third.id.toString(),
          name: `${entry.third.first_name || ""} ${entry.third.last_name || ""}`.trim(),
        }
      : null;

    return {
      ...entry,
      id: entry.id.toString(),
      winner,
      second,
      third,
      winnerId: entry.winnerId ? entry.winnerId.toString() : null,
      secondId: entry.secondId ? entry.secondId.toString() : null,
      thirdId: entry.thirdId ? entry.thirdId.toString() : null,
    };
  });

  return result;
}
