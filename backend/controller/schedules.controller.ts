import { prisma } from "backend/utils/prisma";
import { ScheduleDBType, ScheduleType } from "types/types";

export const getSchedules = async () => {
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
    orderBy: {
      due_date: 'asc'
    }
  })
  return scheduleResults.map(result => ({
    gameWinner: result.game_results?.game_winner || null,
    gameDate: result.game_results?.game_date || null,
    dueDate: result.due_date,
    gameCode: result.game_code,
    id: result.id.toString(),
    nameUsa: `${result.users_schedule_usa_player_idTousers.first_name} ${result.users_schedule_usa_player_idTousers.last_name}`,
    nameUssr: `${result.users_schedule_ussr_player_idTousers.first_name} ${result.users_schedule_ussr_player_idTousers.last_name}`,
    idUsa: result.users_schedule_usa_player_idTousers.id.toString(),
    countryUsa: result.users_schedule_usa_player_idTousers.countries?.tld_code,
    countryUssr: result.users_schedule_ussr_player_idTousers.countries?.tld_code,
    idUssr: result.users_schedule_ussr_player_idTousers.id.toString(),
    tournamentName: result.tournaments.tournament_name,
    tournamentId: result.tournaments.id.toString()
  }))
};

export const updateSchedule = async (gameResultId: number, scheduleId: number) => {
  const updated = await prisma.schedule.update({
    data: {
      game_results_id: gameResultId
    },
    where: {
      id: scheduleId
    }
  })
  return updated
}

export const insertSchedule = async (schedules: ScheduleDBType[]) => {
     await prisma.schedule.createMany({
      data: schedules.map((s) => ({
        tournaments_id: s.tournaments_id,
        game_code: s.game_code,
        usa_player_id: BigInt(s.usa_player_id),
        ussr_player_id: BigInt(s.ussr_player_id),
        due_date: new Date(s.due_date),
      })),
      skipDuplicates: true,
    });
}
