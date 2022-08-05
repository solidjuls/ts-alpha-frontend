import { prisma } from "backend/utils/prisma";
import { BiggerLowerValue } from "types/game.types";

const DEFAULT_RATING = 5000;

export const getPreviousRating = async ({
  playerId,
  createdAt,
}: {
  playerId: bigint;
  createdAt: Date;
}) => {
  const ratingsPlayer = await prisma.ratings_history.findFirst({
    select: {
      rating: true,
    },
    where: {
      player_id: playerId,
      created_at: {
        lt: createdAt,
      },
    },
    orderBy: [
      {
        created_at: "desc",
      },
    ],
  });

  return ratingsPlayer?.rating as number;
};

const getRatingDifference = (
  defeated: number,
  winner: number,
  addValue: number = 100
) => {
  console.log("defeated", defeated);
  console.log("winner", winner);
  console.log("(defeated - winner) * 0.05", (defeated - winner) * 0.05);
  console.log(
    "Math.round((defeated - winner) * 0.05)",
    Math.round((defeated - winner) * 0.05)
  );
  console.log(
    "Math.abs(Math.round((defeated - winner) * 0.05))",
    Math.abs(Math.round((defeated - winner) * 0.05))
  );
  console.log("addValue", addValue);

  const newValue = Math.round((defeated - winner) * 0.05) + addValue;

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

const getSmallerValue: (value1: number, value2: number) => BiggerLowerValue = (
  value1,
  value2
) => {
  if (value1 > value2) return { bigger: value1, smaller: value2 };
  if (value1 < value2) return { bigger: value1, smaller: value2 };
  return { bigger: value1, smaller: value2 };
};

const getNewRatings = (
  usaRating: number,
  ussrRating: number,
  gameWinner: string
) => {
  let newUsaRating: number = 0;
  let newUssrRating: number = 0;
  if (gameWinner === "1") {
    const ratingDifference: number = getRatingDifference(
      ussrRating,
      usaRating,
      100
    );
    newUsaRating = usaRating + ratingDifference;
    newUssrRating = ussrRating - ratingDifference;
  } else if (gameWinner === "2") {
    const ratingDifference: number = getRatingDifference(
      usaRating,
      ussrRating,
      100
    );
    newUsaRating = usaRating - ratingDifference;
    newUssrRating = ussrRating + ratingDifference;
  } else if (gameWinner === "3") {
    const { bigger, smaller } = getSmallerValue(usaRating, ussrRating);
    const ratingDifference: number = getRatingDifference(smaller, bigger, 0);
    if (usaRating < ussrRating) {
      newUsaRating = usaRating + ratingDifference;
      newUssrRating = ussrRating - ratingDifference;
    } else if (usaRating > ussrRating) {
      newUsaRating = usaRating - ratingDifference;
      newUssrRating = ussrRating + ratingDifference;
    }
  }
  return { newUsaRating, newUssrRating };
};

export const calculateRating = async ({
  usaPlayerId,
  ussrPlayerId,
  gameWinner,
}: {
  usaPlayerId: any;
  ussrPlayerId: any;
  gameWinner: any;
}) => {
  const usaRating = await getRatingByPlayer({
    playerId: BigInt(usaPlayerId),
  });
  const ussrRating = await getRatingByPlayer({
    playerId: BigInt(ussrPlayerId),
  });

  console.log("usaRating, ussrRating", usaRating, ussrRating)
  return getNewRatings(
    usaRating?.rating || DEFAULT_RATING,
    ussrRating?.rating || DEFAULT_RATING,
    gameWinner
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
