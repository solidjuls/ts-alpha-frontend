import { prisma } from "backend/utils/prisma";

export const getSchedules = async () => {
  const scheduleResults = await prisma.schedule.findMany({
    include: {
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
    }
  })
  return scheduleResults.map(result => ({
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
