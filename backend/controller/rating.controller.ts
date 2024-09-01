import { prisma } from "backend/utils/prisma";
import { BiggerLowerValue } from "types/game.types";

const DEFAULT_RATING = 5000;

export const getAllPlayers = async () =>
  await prisma.users.findMany({
    select: {
      id: true,
      first_name: true,
      last_name: true,
      last_login_at: true,
      countries: {
        select: {
          tld_code: true,
        },
      },
    },
  });

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
