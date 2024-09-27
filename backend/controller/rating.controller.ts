import { prisma } from "backend/utils/prisma";
import { BiggerLowerValue, GameRecreate, GameWinner } from "types/game.types";
import { getGameByGameId, submit } from "./game.controller";
import { getTopNRatedPlayers, getTopNRatedPlayersWithFilter } from "@prisma/client/sql";

const DEFAULT_RATING = 5000;

export const getAllPlayers = async (p, pageSizeOverride = null, playerFilter = null) => {
  const pageSize = pageSizeOverride || 20;
  const page = Number(p);
  let skip = (page - 1) * pageSize;
  if (playerFilter) {
    return await prisma.$queryRawTyped(getTopNRatedPlayersWithFilter(playerFilter, pageSize, skip));
  }
  return await prisma.$queryRawTyped(getTopNRatedPlayers(pageSize, skip));
};

const getRatingDifference = (
  defeated: number,
  winner: number,
  addValue: number = 100,
  gameType: string,
) => {
  console.log("defeated", defeated);
  console.log("winner", winner);
  console.log("(defeated - winner) * 0.05", (defeated - winner) * 0.05);
  console.log("Math.round((defeated - winner) * 0.05)", Math.round((defeated - winner) * 0.05));
  console.log("addValue", addValue, gameType);

  let basicCalculus = (defeated - winner) * 0.05;

  if (gameType === "FG") basicCalculus = basicCalculus / 2;

  const newValue = Math.round(basicCalculus) + addValue;

  console.log("friendly", newValue);
  console.log("non friendly", Math.round((defeated - winner) * 0.05) + 100);

  if (addValue !== 0 && newValue <= 0) {
    console.log("Difference minimum", 1);
    return 1;
  }
  if (newValue > 200) {
    console.log("Difference maximum", 200);
    return 200;
  }
  console.log("Difference normal", newValue);
  console.log("--------------------");
  return newValue;
};

const getSmallerValue: (value1: number, value2: number) => BiggerLowerValue = (value1, value2) => {
  if (value1 > value2) return { bigger: value1, smaller: value2 };
  if (value1 < value2) return { bigger: value1, smaller: value2 };
  return { bigger: value1, smaller: value2 };
};

const getNewRatings = (
  usaRating: number,
  ussrRating: number,
  gameWinner: string,
  gameType: string,
) => {
  let newUsaRating: number = 0;
  let newUssrRating: number = 0;
  if (gameWinner === "1") {
    const ratingDifference: number = getRatingDifference(
      ussrRating,
      usaRating,
      gameType === "FG" ? 50 : 100,
      gameType,
    );
    newUsaRating = usaRating + ratingDifference;
    newUssrRating = ussrRating - ratingDifference;
  } else if (gameWinner === "2") {
    const ratingDifference: number = getRatingDifference(
      usaRating,
      ussrRating,
      gameType === "FG" ? 50 : 100,
      gameType,
    );
    newUsaRating = usaRating - ratingDifference;
    newUssrRating = ussrRating + ratingDifference;
  } else if (gameWinner === "3") {
    const { bigger, smaller } = getSmallerValue(usaRating, ussrRating);
    const ratingDifference: number = getRatingDifference(smaller, bigger, 0, gameType);
    console.log("ratingDifference", ratingDifference, usaRating, ussrRating, bigger, smaller);

    if (usaRating <= ussrRating) {
      newUsaRating = usaRating + Math.abs(ratingDifference);
      newUssrRating = ussrRating - Math.abs(ratingDifference);
      console.log("usaRating <= ussrRating", newUsaRating, newUssrRating);
    } else if (usaRating > ussrRating) {
      newUsaRating = usaRating - Math.abs(ratingDifference);
      newUssrRating = ussrRating + Math.abs(ratingDifference);
      console.log("usaRating > ussrRating", newUsaRating, newUssrRating);
    }
  }
  return { newUsaRating, newUssrRating, usaRating, ussrRating };
};

export const calculateRating = async ({
  usaPlayerId,
  ussrPlayerId,
  gameWinner,
  gameType,
  prismaTransaction,
}: {
  usaPlayerId: any;
  ussrPlayerId: any;
  gameWinner: any;
  gameType: any;
}) => {
  const usaRating = await getRatingByPlayer({
    playerId: BigInt(usaPlayerId),
    prismaTransaction,
  });
  const ussrRating = await getRatingByPlayer({
    playerId: BigInt(ussrPlayerId),
    prismaTransaction,
  });
  // const newValue = Math.round((defeated - winner) * 0.05) + addValue;
  console.log("usaRating, ussrRating", usaRating, ussrRating);
  return getNewRatings(
    usaRating?.rating || DEFAULT_RATING,
    ussrRating?.rating || DEFAULT_RATING,
    gameWinner,
    gameType,
  );
};

export const getRatingByPlayer = async ({ playerId, prismaTransaction }: { playerId: bigint }) => {
  const client = !prismaTransaction ? prisma : prismaTransaction;
  return await client.ratings_history.findFirst({
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
};
export const startRecreatingRatings = async (input: GameRecreate, role: number) => {
  try {
    await prisma.$transaction(
      async (prismaTransaction) => {
        const dateNow = new Date(Date.now());
        // we select the oldId game created_at
        const oldGameDate = await getGameByGameId(input.oldId);

        console.log("oldGameDate", oldGameDate, input);

        if (
          oldGameDate.usa_player_id.toString() === input.usaPlayerId &&
          oldGameDate.ussr_player_id.toString() === input.ussrPlayerId &&
          oldGameDate.game_winner === input.gameWinner &&
          oldGameDate.game_type === input.gameType
        ) {
          await prismaTransaction.game_results.update({
            data: {
              updated_at: dateNow,
              game_code: input.gameCode,
              end_turn: Number(input.endTurn),
              end_mode: input.endMode,
              video1: input.video1 || null,
              reporter_id: BigInt(input.usaPlayerId),
            },
            where: {
              id: Number(input.oldId),
            },
          });
          console.log("updated instead of recreated");
          return { success: true };
        }

        if (role !== 3) {
          throw new Error(
            "The player's names, the game winner and the tournament can only be updated by superadmins. Please, contact junta",
          );
        }

        console.log("start recreating.....");
        // we select all games with date created_at >= oldId game
        const allGamesAffected = await prismaTransaction.game_results.findMany({
          select: {
            id: true,
            created_at: true,
            usa_player_id: true,
            ussr_player_id: true,
            game_winner: true,
            game_code: true,
            game_type: true,
          },
          where: {
            created_at: {
              gte: new Date(oldGameDate?.created_at as Date),
            },
          },
          orderBy: [
            {
              created_at: "asc",
            },
          ],
        });

        // we delete all rating info related to those games
        const ids = allGamesAffected.map((game) => game.id);
        console.log("allGamesAffected", allGamesAffected);
        await prismaTransaction.ratings_history.deleteMany({
          where: {
            game_result_id: {
              in: ids,
            },
          },
        });

        for (const game of allGamesAffected) {
          if (game.id.toString() === input.oldId) {
            // const oldId = BigInt(input.oldId);
            console.log("game.id.toString() === input.oldId");
            const { usaRating, ussrRating } = await createNewRating({
              usaPlayerId: BigInt(input.usaPlayerId),
              ussrPlayerId: BigInt(input.ussrPlayerId),
              gameWinner: input.gameWinner as GameWinner,
              createdAt: game.created_at,
              updatedAt: dateNow,
              gameId: game.id,
              gameType: game.game_type,
              prismaTransaction,
            });
            const newGame = {
              updated_at: dateNow,
              usa_player_id: BigInt(input.usaPlayerId),
              ussr_player_id: BigInt(input.ussrPlayerId),
              usa_previous_rating: usaRating,
              ussr_previous_rating: ussrRating,
              game_type: input.gameType,
              game_code: input.gameCode,
              game_winner: input.gameWinner,
              end_turn: Number(input.endTurn),
              end_mode: input.endMode,
              game_date: new Date(Date.parse(input.gameDate)),
              video1: input.video1 || null,
              reporter_id: BigInt(input.usaPlayerId),
            };

            await prismaTransaction.game_results.update({
              data: {
                ...newGame,
              },
              where: {
                id: game.id,
              },
            });
          } else {
            const { usaRating, ussrRating } = await createNewRating({
              usaPlayerId: BigInt(game.usa_player_id),
              ussrPlayerId: BigInt(game.ussr_player_id),
              gameWinner: game.game_winner as GameWinner,
              createdAt: game.created_at,
              updatedAt: dateNow,
              gameId: game.id,
              gameType: game.game_type,
              prismaTransaction,
            });
            console.log("new rating created", usaRating, ussrRating);
            const dd = await prismaTransaction.game_results.update({
              data: {
                usa_previous_rating: usaRating,
                ussr_previous_rating: ussrRating,
              },
              where: {
                id: game.id,
              },
            });
            console.log("result updated", dd);
          }
        }
      },
      {
        maxWait: 5000, // default: 2000
        timeout: 20000, // default: 5000
      },
    );
  } catch (error) {
    throw error;
  } finally {
    console.error("disconnecting");
    prisma.$disconnect();
    console.error("disconnected");
  }

  return { success: true };
};

export const deleteGameRatings = async (input: GameRecreate) => {
  try {
    await prisma.$transaction(
      async (prismaTransaction) => {
        const dateNow = new Date(Date.now());
        // we select the oldId game created_at
        const oldGameDate = await getGameByGameId(input.oldId);
        console.log("oldGameDate", oldGameDate);
        // we select all games with date created_at >= oldId game
        const allGamesAffected = await prismaTransaction.game_results.findMany({
          select: {
            id: true,
            created_at: true,
            usa_player_id: true,
            ussr_player_id: true,
            game_winner: true,
            game_code: true,
            game_type: true,
          },
          where: {
            created_at: {
              gte: new Date(oldGameDate?.created_at as Date),
            },
          },
          orderBy: {
            created_at: "asc",
          },
        });
        console.log("allGamesAffected", allGamesAffected);
        // we delete all rating info related to those games
        const ids = allGamesAffected.map((game) => game.id);

        const deletedMany = await prismaTransaction.ratings_history.deleteMany({
          where: {
            game_result_id: {
              in: ids,
            },
          },
        });
        const gameDeleted = await prismaTransaction.game_results.delete({
          where: {
            id: Number(input.oldId),
          },
        });
        console.log("deletedMany", deletedMany, gameDeleted);

        for (const game of allGamesAffected) {
          if (game.id.toString() === input.oldId) {
            continue;
          } else {
            console.log("others");
            const { usaRating, ussrRating } = await createNewRating({
              usaPlayerId: BigInt(game.usa_player_id),
              ussrPlayerId: BigInt(game.ussr_player_id),
              gameWinner: game.game_winner as GameWinner,
              createdAt: game.created_at,
              updatedAt: dateNow,
              gameId: game.id,
              gameType: game.game_type,
              prismaTransaction,
            });
            console.log("new rating created", usaRating, ussrRating);
            const dd = await prismaTransaction.game_results.update({
              data: {
                usa_previous_rating: usaRating,
                ussr_previous_rating: ussrRating,
              },
              where: {
                id: game.id,
              },
            });
            console.log("result updated", dd);
          }
        }
      },
      {
        maxWait: 5000, // default: 2000
        timeout: 20000, // default: 5000
      },
    );
  } catch (error) {
    console.error("transaction", error);
  } finally {
    console.error("disconnecting");
    prisma.$disconnect();
    console.error("disconnected");
  }

  return { success: true };
};

const createNewRating = async ({
  usaPlayerId,
  ussrPlayerId,
  gameWinner,
  createdAt,
  updatedAt,
  gameId,
  gameType,
  prismaTransaction,
}: {
  usaPlayerId: bigint;
  ussrPlayerId: bigint;
  gameWinner: GameWinner;
  createdAt: Date | null;
  updatedAt: Date | null;
  gameId: bigint;
  gameType: string;
}) => {
  //we recalculate all ratings based on the games retrieved,
  const { newUsaRating, newUssrRating, usaRating, ussrRating } = await calculateRating({
    usaPlayerId,
    ussrPlayerId,
    gameWinner,
    gameType,
    prismaTransaction,
  });
  console.log("newUsaRating, newUssrRating", gameId, newUsaRating, newUssrRating);
  console.log("ratings_history.createMany", [
    {
      player_id: BigInt(usaPlayerId),
      rating: newUsaRating,
      game_code: "recr",
      created_at: createdAt,
      updated_at: updatedAt,
      game_result_id: gameId,
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
      player_id: BigInt(ussrPlayerId),
      rating: newUssrRating,
      game_code: "recr",
      created_at: createdAt,
      updated_at: updatedAt,
      game_result_id: gameId,
      total_games: 0,
      friendly_games: 0,
      usa_victories: 0,
      usa_losses: 0,
      usa_ties: 0,
      ussr_victories: 0,
      ussr_losses: 0,
      ussr_ties: 0,
    },
  ]);
  await prismaTransaction.ratings_history.createMany({
    data: [
      {
        player_id: BigInt(usaPlayerId),
        rating: newUsaRating,
        game_code: "recr",
        created_at: createdAt,
        updated_at: updatedAt,
        game_result_id: gameId,
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
        player_id: BigInt(ussrPlayerId),
        rating: newUssrRating,
        game_code: "recr",
        created_at: createdAt,
        updated_at: updatedAt,
        game_result_id: gameId,
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
  });

  return { usaRating, ussrRating };
};
