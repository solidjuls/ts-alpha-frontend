import { prisma } from "backend/utils/prisma";
import { Game, GameAPI } from "types/game.types";
import { calculateRating, getRatingByPlayer } from "./rating.controller";
import { Prisma } from "@prisma/client";
import { TournamentStatusType } from "utils/constants";

const getGamesWithRatingDifference: (gamesWithRatingRelated: any) => Promise<Game[]> = async (
  gamesWithRatingRelated: any,
) => {
  return await Promise.all(
    gamesWithRatingRelated.map(async (game: any) => {
      const ratingsUSA = {
        rating: game.ratingHistoryUSA,
        previousRating: game.usa_previous_rating,
      };

      const ratingsUSSR = {
        rating: game.ratingHistoryUSSR,
        previousRating: game.ussr_previous_rating,
      };

      return {
        id: game.id,
        created_at: game.created_at,
        endMode: game.end_mode,
        endTurn: game.end_turn,
        usaPlayerId: game.usa_player_id,
        ussrPlayerId: game.ussr_player_id,
        usaCountryCode: game?.users_game_results_usa_player_idTousers?.countries?.tld_code,
        ussrCountryCode: game?.users_game_results_ussr_player_idTousers?.countries?.tld_code,
        usaPlayer:
          game.users_game_results_usa_player_idTousers.first_name +
          " " +
          game.users_game_results_usa_player_idTousers.last_name,
        ussrPlayer:
          game.users_game_results_ussr_player_idTousers.first_name +
          " " +
          game.users_game_results_ussr_player_idTousers.last_name,
        gameType: game.tournaments?.tournament_name,
        tournamentId: game.tournaments?.id,
        game_code: game.game_code,
        gameDate: game.game_date,
        videoURL: game.video1,
        gameWinner: game.game_winner,
        ratingsUSA,
        ratingsUSSR,
      };
    }),
  );
};

// Games with their ratings and return normalized data
export const getGameWithRatings = async (
  filter: Prisma.game_resultsWhereInput,
  page: number,
  pageSize: number,
) => {
  pageSize = pageSize || 20;

  const skip = (page - 1) * pageSize;

  const totalRows = await prisma.game_results.count({
    where: {
      ...filter,
    },
  });
  const games = await prisma.game_results.findMany({
    select: {
      id: true,
      usa_player_id: true,
      ussr_player_id: true,
      created_at: true,
      end_mode: true,
      end_turn: true,
      game_code: true,
      game_date: true,
      video1: true,
      game_winner: true,
      usa_previous_rating: true,
      ussr_previous_rating: true,
      ratings_history: {
        select: {
          rating: true,
          player_id: true,
        },
      },
      tournaments: {
        select: {
          tournament_name: true,
          id: true,
        },
      },
      users_game_results_usa_player_idTousers: {
        select: {
          first_name: true,
          last_name: true,
          countries: {
            select: {
              tld_code: true,
            },
          },
        },
      },
      users_game_results_ussr_player_idTousers: {
        select: {
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
    where: {
      ...filter,
    },
    skip,
    take: pageSize,
    orderBy: [
      {
        created_at: "desc",
      },
    ],
  });
  const normalizedGames = games.map((game) => {
    let ratingHistoryUSA = 0;
    let ratingHistoryUSSR = 0;
    game.ratings_history.forEach(async ({ rating, player_id }) => {
      if (player_id === game.usa_player_id) {
        ratingHistoryUSA = rating;
      } else if (player_id === game.ussr_player_id) {
        ratingHistoryUSSR = rating;
      }
    });
    return {
      ...game,
      ratingHistoryUSA,
      ratingHistoryUSSR,
    };
  });
  const getGamesWithRating = await getGamesWithRatingDifference(normalizedGames);

  return { getGamesWithRating, totalRows };
};

export const getGameByGameId = async (id: string) =>
  await prisma.game_results.findFirst({
    select: {
      created_at: true,
      updated_at: true,
      reported_at: true,
      game_code: true,
      end_turn: true,
      end_mode: true,
      video1: true,
      usa_player_id: true,
      ussr_player_id: true,
      game_winner: true,
      game_type: true,
      id: true,
      tournaments: {
        select: {
          id: true,
        },
      },
    },
    where: {
      id: Number(id),
    },
  });

export const getTournamentsByStatus = async (status: TournamentStatusType[] | undefined) => {
  const filter = status
    ? {
        where: {
          status_id: {
            in: status.map(Number)
          }
        },
      }
    : undefined;

    
  const tournaments =  await prisma.tournaments.findMany({
    select: {
      id: true,
      tournament_name: true,
      status_id: true,
      starting_date: true,
      tournament_admins: {
        select: {
          users: {
            select: {
              id: true,
              first_name: true,
              last_name: true
            }
          }
        }
      }
    },
    ...filter,
    orderBy: {
      created_at: "desc",
    },
  });

  return tournaments.map(item => {
    return {
      id: item.id.toString(),
      tournament_name: item.tournament_name,
      status_id: item.status_id,
      starting_date: item.starting_date,
      adminId: item.tournament_admins?.map(admin => admin.users.id.toString()),
      adminName: item.tournament_admins?.map(admin => admin.users.first_name + " " + admin.users.last_name)
    }
  })
};

export const getAllTournaments = async () => {
  const tournaments = await prisma.tournaments.findMany({
    select: {
      id: true,
      tournament_name: true,
      status_id: true,
      description: true,
      starting_date: true,
      tournament_admins: {
        select: {
          users: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
            },
          },
        },
      },
      created_at: true,
    },
    orderBy: {
      created_at: "desc",
    },
  });

  return tournaments?.map(item => {
    return {
      id: item.id.toString(),
      tournament_name: item.tournament_name,
      description: item.description,
      status_id: item.status_id,
      starting_date: item.starting_date,
      adminId: item.tournament_admins?.map(admin => admin.users.id.toString()),
      adminName: item.tournament_admins?.map(admin => admin.users.first_name + " " + admin.users.last_name)
    }
  })
};

export const getTournamentsById = async (ids: string[], userId: string | undefined) => {
  let userEmail = '';
  let userRegistered: boolean = false;
  if (userId) {
    const user = await prisma.users.findFirst({
      select: {
        email: true,
      },
      where: {
        id: Number(userId),
      },
    });
    userEmail = user?.email || '';
    const registerCheck = await prisma.tournament_registration.findFirst({
      select: {
        player_email: true,
      },
      where: {
        player_email: userEmail,
        tournamentId: Number(ids[0]),
      },
    });
    userRegistered = registerCheck?.player_email ? true : false;
  }
  const tournaments = await prisma.tournaments.findMany({
    select: {
      id: true,
      tournament_name: true,
      status_id: true,
      description: true,
      starting_date: true,
      tournament_admins: {
        select: {
          users: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
            },
          },
        },
      },
      created_at: true,
    },
    where: {
      id: {
        in: ids.map(Number),
      },
    },
    orderBy: {
      created_at: "desc",
    },
  });

  return tournaments?.map(item => {
    return {
      id: item.id.toString(),
      tournament_name: item.tournament_name,
      description: item.description,
      status_id: item.status_id,
      starting_date: item.starting_date,
      registered: userRegistered,
      adminId: item.tournament_admins?.map(admin => admin.users.id.toString()),
      adminName: item.tournament_admins?.map(admin => admin.users.first_name + " " + admin.users.last_name)
    }
  })
};

export const removeTournament = async (id: string) => {
  return await prisma.tournaments.delete({
    where: {
      id: Number(id),
    },
  });
};

interface TournamentDBType {
  tournamentName: string;
  status: TournamentStatusType;
  admins: number;
  startingDate: Date;
  description: string;
}

export const addTournament = async ({
  tournamentName,
  status,
  admins,
  startingDate,
  description,
}: TournamentDBType) => {
  const newTournament = await prisma.tournaments.create({
    data: {
      tournament_name: tournamentName,
      status_id: Number(status),
      starting_date: startingDate,
      description: description,
    },
  });
  console.log("newTournament", newTournament);

  await prisma.tournament_admins.create({
    data: {
      tournamentId: newTournament.id,
      userId: admins,
    },
  });
};

export const updateTournament = async (id: number, status: TournamentStatusType) => {
  return await prisma.tournaments.update({
    where: {
      id: id,
    },
    data: {
      status_id: Number(status),
    },
  });
};

interface TournamentUpdateType {
  tournamentName?: string;
  status?: TournamentStatusType;
  startingDate?: Date;
  description?: string;
}

export const updateTournamentFull = async (id: number, updateData: TournamentUpdateType) => {
  return await prisma.tournaments.update({
    where: {
      id: id,
    },
    data: {
      ...(updateData.tournamentName && { tournament_name: updateData.tournamentName }),
      ...(updateData.status && { status_id: Number(updateData.status) }),
      ...(updateData.startingDate && { starting_date: updateData.startingDate }),
      ...(updateData.description !== undefined && { description: updateData.description }),
    },
  });
};

export const registerTournament = async (id: number, userEmail: string) => {
  return await prisma.tournament_registration.create({
    data: {
      tournamentId: id,
      player_email: userEmail,
      status: 'pending'
    }
  });
};

export const unregisterTournament = async (tournamentId: number, userEmail: string) => {
  return await prisma.tournament_registration.deleteMany({
    where: {
      tournamentId: tournamentId,
      player_email: userEmail,
    }
  });
};

export const getRegisteredPlayers = async (tournamentId: number) => {
  const registrations = await prisma.tournament_registration.findMany({
    where: {
      tournamentId: tournamentId,
    },
    select: {
      id: true,
      player_email: true,
      status: true,
      created_at: true,
    }
  });

  // Get user details for each registered email
  const userEmails = registrations.map(reg => reg.player_email).filter((email): email is string => email !== null);
  const users = await prisma.users.findMany({
    where: {
      email: {
        in: userEmails,
      },
    },
    select: {
      id: true,
      email: true,
      name: true,
      first_name: true,
      last_name: true,
      phone_number: true,
      countries: {
        select: {
          tld_code: true,
        },
      },
    },
  });
  const ratings = await Promise.all(
    users.map(async (user) => {
      const rating = await getRatingByPlayer({ playerId: user.id });

      return { 
        userId: user.id,
        ...rating 
      };
    })
  );

  return registrations.map(registration => {
    const user = users.find(u => u.email === registration.player_email);
    const rating = ratings.find(r => r.userId === user?.id);
    return {
      registrationId: registration.id,
      email: registration.player_email,
      rating: rating?.rating || 0,
      status: registration.status,
      registeredAt: registration.created_at,
      userId: user?.id?.toString(),
      playdeckName: user?.name,
      phoneNumber: user?.phone_number,
      name: user ? `${user.first_name} ${user.last_name}` : 'Unknown User',
      countryCode: user?.countries?.tld_code,
    };
  });
};

const submitGame = async (data: GameAPI) => {
  const { newUsaRating, newUssrRating, usaRating, ussrRating } = await calculateRating({
    usaPlayerId: BigInt(data.usaPlayerId),
    ussrPlayerId: BigInt(data.ussrPlayerId),
    gameWinner: data.gameWinner,
    gameType: data.gameType,
  });

  const dateNow = new Date(Date.now());
  const newGame = {
    created_at: dateNow,
    updated_at: dateNow,
    usa_player_id: BigInt(data.usaPlayerId),
    ussr_player_id: BigInt(data.ussrPlayerId),
    usa_previous_rating: usaRating,
    ussr_previous_rating: ussrRating,
    game_type: Number(data.gameType),
    game_code: data.gameCode,
    reported_at: dateNow,
    game_winner: data.gameWinner,
    end_turn: Number(data.endTurn),
    end_mode: data.endMode,
    game_date: dateNow,
    video1: data.video1 || null,
    reporter_id: BigInt(data.usaPlayerId),
  };

  return await prisma.game_results.create({
    data: {
      ...newGame,
      ratings_history: {
        create: [
          {
            player_id: BigInt(data.usaPlayerId),
            rating: newUsaRating,
            game_code: data.gameCode,
            created_at: dateNow,
            updated_at: dateNow,
            total_games: 0,
            friendly_games: 0,
            usa_victories: 0,
            usa_losses: 0,
            usa_ties: 0,
            ussr_victories: 0,
            ussr_losses: 0,
            ussr_ties: 0,
          },
          {
            player_id: BigInt(data.ussrPlayerId),
            rating: newUssrRating,
            game_code: data.gameCode,
            created_at: dateNow,
            updated_at: dateNow,
            total_games: 0,
            friendly_games: 0,
            usa_victories: 0,
            usa_losses: 0,
            usa_ties: 0,
            ussr_victories: 0,
            ussr_losses: 0,
            ussr_ties: 0,
          },
        ],
      },
    },
  });
};

export const submit = async (data: GameAPI) => {
  try {
    const newGameWithId = await submitGame(data);
    const newGameWithIdParsed = JSON.stringify(newGameWithId, (key, value) =>
      typeof value === "bigint" ? value.toString() : value,
    );
    return JSON.parse(newGameWithIdParsed);
  } catch (e) {
    throw e;
  }
};
 export const getForfeits = async (tournamentId: string) => {
  const forfeits = await prisma.tournament_registration.findMany({
    where: {
      tournamentId: Number(tournamentId),
      status: "forfeited",
    },
    select: {
      player_email: true,
    },
  });

    // Get user details for each registered email
  const userEmails = forfeits.map(reg => reg.player_email).filter((email): email is string => email !== null);
  const users = await prisma.users.findMany({
    where: {
      email: {
        in: userEmails,
      },
    },
    select: {
      id: true,
      email: true,
      first_name: true,
      last_name: true,
      countries: {
        select: {
          tld_code: true,
        },
      },
    },
  });

  return users.map(user => ({
    id: user.id.toString(),
    name: `${user.first_name} ${user.last_name}`,
    countryCode: user.countries?.tld_code,
  }));
 }

export const getStandings = async (tournamentId: string, secondaryName: string) => {
  const standingPlayers = await prisma.standings.findMany({
    where: {
      tournaments_id: Number(tournamentId),
    },
    select: {
      standing_players: {
        select: {
          user_id: true,
        },
      },
      standing_name: true,
      secondary_name: true,
    },
  });

  const players: Record<
    string,
    {
      userId: string;
      tldCode: string | undefined;
      opponents: string[];
      name: string;
      gamesWon: number;
      gamesLost: number;
      gamesTied: number;
      winRate: number;
      sos: number;
      standingName: string;
      secondaryName: string | null;
    }
  > = {};
  let counter = 0;
  standingPlayers?.forEach((userByStanding) => {
    userByStanding.standing_players.forEach((user) => {
      const id = user.user_id.toString();
      counter++;
      players[id] = {
        userId: id,
        standingName: userByStanding.standing_name,
        secondaryName: userByStanding.secondary_name,
        gamesWon: 0,
        gamesLost: 0,
        gamesTied: 0,
        winRate: 0,
        sos: 0,
        tldCode: undefined,
        name: "",
        opponents: [],
      };
    });
  });

  if (!standingPlayers || standingPlayers.length === 0) {
    return; // res.status(404).json({ error: "No standings found" });
  }

  const standingPlayersNames = await prisma.users.findMany({
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
    where: {
      id: {
        in: Object.keys(players).map(Number),
      },
    },
  });

  Object.keys(players).forEach((id) => {
    const name = standingPlayersNames.find((user) => user.id.toString() === id);

    if (name) {
      players[id].name = `${name.first_name} ${name.last_name}`;
      players[id].tldCode = name.countries?.tld_code;
    }
  });

  // Retrieve all game results for the given tournament
  const games = await prisma.game_results.findMany({
    where: { game_type: Number(tournamentId) },
  });

  for (const game of games) {
    const usaId = game.usa_player_id.toString();
    const ussrId = game.ussr_player_id.toString();

    if (!players[usaId]) {
      const forfeitUser = await prisma.users.findFirst({
        select: {
          first_name: true,
          last_name: true,
          countries: {
            select: {
              tld_code: true,
            },
          },
        },
        where: {
          id: Number(usaId),
        },
      });
      players[usaId] = {
        userId: usaId,
        standingName: "Forfeit",
        secondaryName: "Forfeit",
        gamesWon: 0,
        gamesLost: 0,
        gamesTied: 0,
        winRate: 0,
        sos: 0,
        tldCode: forfeitUser?.countries?.tld_code,
        name: `${forfeitUser?.first_name} ${forfeitUser?.last_name}`,
        opponents: [],
      };
    }
    if (!players[ussrId]) {
      const forfeitUser = await prisma.users.findFirst({
        select: {
          first_name: true,
          last_name: true,
          countries: {
            select: {
              tld_code: true,
            },
          },
        },
        where: {
          id: Number(usaId),
        },
      });
      players[ussrId] = {
        userId: ussrId,
        standingName: "Forfeit",
        secondaryName: "Forfeit",
        gamesWon: 0,
        gamesLost: 0,
        gamesTied: 0,
        winRate: 0,
        sos: 0,
        tldCode: forfeitUser?.countries?.tld_code,
        name: `${forfeitUser?.first_name} ${forfeitUser?.last_name}`,
        opponents: [],
      };
    }

    // We keep track of all player's opponents for a later use
    players[usaId].opponents.push(ussrId);
    players[ussrId].opponents.push(usaId);

    switch (game.game_winner) {
      case "1":
        players[usaId].gamesWon++;
        players[ussrId].gamesLost++;
        break;
      case "2":
        players[ussrId].gamesWon++;
        players[usaId].gamesLost++;
        break;
      case "3":
        players[usaId].gamesTied++;
        players[ussrId].gamesTied++;
        break;
    }
  }

  // Win%
  Object.keys(players).forEach((id) => {
    const gamesWon = players[id].gamesWon;
    const gamesLost = players[id].gamesLost;
    const gamesTied = players[id].gamesTied;
    if (gamesWon + gamesLost + gamesTied === 0) {
      return;
    }
    players[id].winRate = (gamesWon + 0.5 * gamesTied) / (gamesWon + gamesLost + gamesTied);
    // console.log("players[id].opponents", players[id].opponents)
  });

  // SoS
  Object.keys(players).forEach((id) => {
    const opponents = players[id].opponents;
    if (opponents.length === 0) {
      return;
    }
    players[id].sos =
      opponents.reduce((acc, opponent) => acc + players[opponent].winRate, 0) / opponents.length;
    // console.log("Win sos", players[id].name, players[id].winRate, players[id].sos);
  });

  // Return only players on the current standing
  const filteredPlayers = Object.values(players).filter(
    (player) => player.secondaryName === secondaryName || player.secondaryName === "Forfeit",
  );

  return filteredPlayers;
};
