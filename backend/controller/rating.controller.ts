import { prisma } from "backend/utils/prisma";
import { getTopNRatedPlayers } from '@prisma/client/sql';
import { BiggerLowerValue } from "types/game.types";

const DEFAULT_RATING = 5000;

export const getAllPlayers = async (p, pageSizeOverride = null) =>{
  const pageSize = (pageSizeOverride || 20);
  const page = Number(p)
  let skip = (page - 1) * pageSize;
  return await prisma.$queryRawTyped(getTopNRatedPlayers(pageSize, skip))
}

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
}: {
  usaPlayerId: any;
  ussrPlayerId: any;
  gameWinner: any;
  gameType: any;
}) => {
  const usaRating = await getRatingByPlayer({
    playerId: BigInt(usaPlayerId),
  });
  const ussrRating = await getRatingByPlayer({
    playerId: BigInt(ussrPlayerId),
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

// const startRecreatingRatings = async (input: GameRecreate) => {
//   const dateNow = new Date(Date.now());
//   // we select the oldId game created_at
//   const oldGameDate = await getGameByGameId(input.oldId);

//   // we select all games with date created_at >= oldId game
//   const allGamesAffected = await prisma.game_results.findMany({
//     select: {
//       id: true,
//       created_at: true,
//       usa_player_id: true,
//       ussr_player_id: true,
//       game_winner: true,
//       game_code: true,
//       game_type: true,
//     },
//     where: {
//       created_at: {
//         gte: new Date(oldGameDate?.created_at as Date),
//       },
//     },
//   });
//   console.log("allGamesAffected", allGamesAffected);
//   // we delete all rating info related to those games
//   const ids = allGamesAffected.map((game) => game.id);

//   await prisma.ratings_history.deleteMany({
//     where: {
//       game_result_id: {
//         in: ids,
//       },
//     },
//   });

//   for (let index = 0; index < allGamesAffected.length; index++) {
//     const game = allGamesAffected[index];
//     console.log("index", index, game.id, input.oldId);
//     if (game.id.toString() === input.oldId) {
//       // const oldId = BigInt(input.oldId);
//       const { usaRating, ussrRating } = await createNewRating({
//         usaPlayerId: BigInt(input.usaPlayerId),
//         ussrPlayerId: BigInt(input.ussrPlayerId),
//         gameWinner: input.gameWinner as GameWinner,
//         createdAt: game.created_at,
//         updatedAt: dateNow,
//         gameId: game.id,
//         gameType: game.game_type,
//       });
//       const newGame = {
//         updated_at: dateNow,
//         usa_player_id: BigInt(input.usaPlayerId),
//         ussr_player_id: BigInt(input.ussrPlayerId),
//         usa_previous_rating: usaRating,
//         ussr_previous_rating: ussrRating,
//         game_type: input.gameType,
//         game_code: input.gameCode,
//         game_winner: input.gameWinner,
//         end_turn: Number(input.endTurn),
//         end_mode: input.endMode,
//         game_date: new Date(Date.parse(input.gameDate)),
//         video1: input.video1 || null,
//         reporter_id: BigInt(input.usaPlayerId),
//       };

//       await prisma.game_results.update({
//         data: {
//           ...newGame,
//         },
//         where: {
//           id: game.id,
//         },
//       });
//     } else {
//       const { usaRating, ussrRating } = await createNewRating({
//         usaPlayerId: BigInt(game.usa_player_id),
//         ussrPlayerId: BigInt(game.ussr_player_id),
//         gameWinner: game.game_winner as GameWinner,
//         createdAt: game.created_at,
//         updatedAt: dateNow,
//         gameId: game.id,
//         gameType: game.game_type,
//       });
//       await prisma.game_results.update({
//         data: {
//           usa_previous_rating: usaRating,
//           ussr_previous_rating: ussrRating,
//         },
//         where: {
//           id: game.id,
//         },
//       });
//     }
//   }

//   return null;
// };
