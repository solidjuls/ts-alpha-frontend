import { prisma } from "backend/utils/prisma";
import { ScheduleDBType } from "types/types";

export const getSchedules = async ({ userId, tournament, user, page, pageSize, adminView } : { userId: number, tournament: string[] | undefined, user: string | undefined, page: number, pageSize: number, adminView: boolean }) => {
    pageSize = pageSize || 20;

  const skip = (page - 1) * pageSize;
  const where: any = {
    OR: [
        { usa_player_id: userId },
        { ussr_player_id: userId },
      ]
  };
  const orderBy: any = [];
  if (!adminView) {
    orderBy.push({
      game_results_id: 'asc',
    });
  }
  orderBy.push({
    due_date: 'asc',
  });

  // if (!adminView) {
  //   where.AND.push({
  //     OR: [
  //       { usa_player_id: userId },
  //       { ussr_player_id: userId },
  //     ],
  //   });
  // }

 const totalRows = await prisma.schedule.count({
    where,
  });
  const scheduleResults = await prisma.schedule.findMany({
    select: {
      game_results: {
        select: {
          game_winner: true,
          game_date: true,
        }
      },
      game_code: true,
      id: true,
      game_results_id: true,
      due_date: true,
      tournaments: {
        select: {
          tournament_name: true,
          id: true,
        },
      },
      users_schedule_usa_player_idTousers: {
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
      },
      users_schedule_ussr_player_idTousers: {
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
      },
    },
    orderBy,
    where,
    skip,
    take: pageSize,
  })
console.log("scheduleResults", scheduleResults.length);
  const results = scheduleResults.map(result => ({
    gameWinner: result.game_results?.game_winner || null,
    gameDate: result.game_results?.game_date || null,
    dueDate: result.due_date,
    gameCode: result.game_code,
    id: result.id.toString(),
    gameResultsId: result.game_results_id?.toString(),
    nameUsa: `${result.users_schedule_usa_player_idTousers.first_name} ${result.users_schedule_usa_player_idTousers.last_name}`,
    nameUssr: `${result.users_schedule_ussr_player_idTousers.first_name} ${result.users_schedule_ussr_player_idTousers.last_name}`,
    idUsa: result.users_schedule_usa_player_idTousers.id.toString(),
    countryUsa: result.users_schedule_usa_player_idTousers.countries?.tld_code,
    countryUssr: result.users_schedule_ussr_player_idTousers.countries?.tld_code,
    idUssr: result.users_schedule_ussr_player_idTousers.id.toString(),
    tournamentName: result.tournaments.tournament_name,
    tournamentId: result.tournaments.id.toString()
  }))
  return {
    results, totalRows
  }
};

export const validateScheduleIntegrity = async ({ usaPlayerId, id, ussrPlayerId, gameCode, gameType } : { usaPlayerId: number, id: number, ussrPlayerId: number, gameCode: string, gameType: number }) => {
  const schedule = await prisma.schedule.findFirst({
    select: {
      game_results_id: true,
      id: true,
    },
    where: {
      id: id,
      usa_player_id: BigInt(usaPlayerId),
      ussr_player_id: BigInt(ussrPlayerId),
      game_code: gameCode,
      tournaments_id: gameType,
    }
  })
  return schedule
}

export const updateScheduleByResultId = async ({ gameResultId } : { gameResultId: number }) => {
  const updated = await prisma.schedule.update({
    data: {
      game_results_id: null,
    },
    where: {
      game_results_id: gameResultId
    }
  })
  return updated
}

export const updateSchedule = async ({ gameResultId, scheduleId, dueDate } : { gameResultId?: number, scheduleId: number, dueDate?: Date}) => {
  const updated = await prisma.schedule.update({
    data: {
      game_results_id: gameResultId,
      due_date: dueDate
    },
    where: {
      id: scheduleId
    }
  })
  return updated
}

export const replaceSchedulePlayers = async (oldPlayer: string, newPlayer: string, tournamentId: number) => {
  const updated = await prisma.schedule.updateMany({
    data: {
      usa_player_id: newPlayer,
      ussr_player_id: newPlayer,
    },
    where: {
      OR: [
        { usa_player_id: oldPlayer },
        { ussr_player_id: oldPlayer }
      ],
      tournaments_id: tournamentId,
      game_results_id: null
    }
  })
  return updated
}

export const deleteSchedulePlayer = async (playerId: number, tournamentId: number) => {
  const updated = await prisma.schedule.updateMany({
    where: {
      tournaments_id: tournamentId,
      usa_player_id: playerId,
    },
    data: {
      usa_player_id: null,
    },
  });

  await prisma.schedule.updateMany({
    where: {
      tournaments_id: tournamentId,
      ussr_player_id: playerId,
    },
    data: {
      ussr_player_id: null,
    },
  });
  return updated
}

export const addSchedulePlayers = async (usa: string, ussr: string, t: number, d: Date, gc: string) => {
  return await prisma.schedule.create({
    data: {
      tournaments_id: t,
      game_code: gc,
      usa_player_id: BigInt(usa),
      ussr_player_id: BigInt(ussr),
      due_date: d,
    }
  })
}

export const insertSchedule = async (schedules: ScheduleDBType[]) => {
  await prisma.schedule.createMany({
    data: schedules.map((s) => ({
      tournaments_id: Number(s.tournaments_id),
      game_code: s.game_code,
      usa_player_id: BigInt(s.usa_player_id),
      ussr_player_id: BigInt(s.ussr_player_id),
      due_date: new Date(s.due_date),
    })),
    skipDuplicates: true,
  });
}
