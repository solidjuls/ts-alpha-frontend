import * as trpc from "@trpc/server";
import { z } from "zod";
import { prisma } from "backend/utils/prisma";
import { dateAddDay } from "utils/dates";
import { Game, SubmitGameType } from "types/game.types";
import { getRatingByPlayer } from "backend/utils/common";

const DEFAULT_RATING = 5000;

const calculateRating = async ({ usaPlayerId, ussrPlayerId, gameWinner }) => {
  const usaRating = await getRatingByPlayer({
    playerId: BigInt(usaPlayerId),
  });
  const ussrRating = await getRatingByPlayer({
    playerId: BigInt(ussrPlayerId),
  });

  return getNewRatings(
    usaRating?.rating || DEFAULT_RATING,
    ussrRating?.rating || DEFAULT_RATING,
    gameWinner
  );
};
const submitGame = async ({ data }: any) => {
  const { newUsaRating, newUssrRating } = await calculateRating({
    usaPlayerId: data.usaPlayerId,
    ussrPlayerId: data.ussrPlayerId,
    gameWinner: data.gameWinner,
  });

  const dateNow = new Date(Date.now());
  const newGame = {
    created_at: dateNow,
    updated_at: dateNow,
    usa_player_id: BigInt(data.usaPlayerId),
    ussr_player_id: BigInt(data.ussrPlayerId),
    game_type: data.gameType,
    game_code: data.gameCode,
    reported_at: dateNow,
    game_winner: data.gameWinner,
    end_turn: Number(data.endTurn),
    end_mode: data.endMode,
    game_date: new Date(Date.parse(data.gameDate)),
    video1: data.video1 || null,
    video2: data.video2 || null,
    video3: data.video3 || null,
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
const getPreviousRating = async ({
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
  const newValue = Math.abs(Math.round((defeated - winner) * 0.05)) + addValue;

  if (addValue !== 0 && newValue <= 0) {
    console.log("Difference minimum", 1);
    return 1;
  }
  if (newValue > 200) {
    console.log("Difference maximum", 200);
    return 200;
  }
  console.log("Difference normal", newValue);
  return newValue;
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

const getGameEndpointContract = () => ({
  gameDate: z.string(),
  gameWinner: z.string(),
  gameCode: z.string(),
  gameType: z.string(),
  usaPlayerId: z.string(),
  ussrPlayerId: z.string(),
  endTurn: z.string(),
  endMode: z.string(),
  video1: z.optional(z.string()),
  video2: z.optional(z.string()),
  video3: z.optional(z.string()),
});

export const gameRouter = trpc
  .router()
  .query("getAll", {
    input: z.object({ d: z.string() }),
    async resolve({ input }) {
      const date = new Date(Date.parse(input.d));
      const datePlusOne = dateAddDay(date, 1);

      const games = await prisma.game_results.findMany({
        include: {
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
          ratings_history: {
            select: {
              rating: true,
              player_id: true,
            },
          },
        },
        where: {
          created_at: {
            lt: datePlusOne,
            gte: date,
          },
        },
        orderBy: [
          {
            created_at: "desc",
          },
        ],
      });

      const gamesWithRatingRelated = games.map((game) => {
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

      const gamesNormalized = await Promise.all(
        gamesWithRatingRelated.map(async (game) => {
          const usaPreviousRating = await getPreviousRating({
            playerId: game.usa_player_id,
            createdAt: game.created_at as Date,
          });
          const ratingsUSA = {
            rating: game.ratingHistoryUSA,
            ratingDifference: game.ratingHistoryUSA - usaPreviousRating,
          };
          const ussrPreviousRating = await getPreviousRating({
            playerId: game.ussr_player_id,
            createdAt: game.created_at as Date,
          });
          const ratingsUSSR = {
            rating: game.ratingHistoryUSSR,
            ratingDifference: game.ratingHistoryUSSR - ussrPreviousRating,
          };

          return {
            created_at: game.created_at,
            endMode: game.end_mode,
            endTurn: game.end_turn,
            usaPlayerId: game.usa_player_id,
            ussrPlayerId: game.ussr_player_id,
            usaCountryCode:
              game?.users_game_results_usa_player_idTousers?.countries
                ?.tld_code,
            ussrCountryCode:
              game?.users_game_results_ussr_player_idTousers?.countries
                ?.tld_code,
            usaPlayer:
              game.users_game_results_usa_player_idTousers.first_name +
              " " +
              game.users_game_results_usa_player_idTousers.last_name,
            ussrPlayer:
              game.users_game_results_ussr_player_idTousers.first_name +
              " " +
              game.users_game_results_ussr_player_idTousers.last_name,
            gameType: game.game_type,
            videoURL: game.video1,
            gameWinner: game.game_winner,
            ratingsUSA,
            ratingsUSSR,
          };
        })
      );
      const gameParsed = JSON.stringify(gamesNormalized, (key, value) =>
        typeof value === "bigint" ? value.toString() : value
      );

      return JSON.parse(gameParsed) as Game[];
    },
  })
  .mutation("submit", {
    input: z.object({
      data: z.object({ ...getGameEndpointContract() }),
    }),
    async resolve({ input }) {
      const newGameWithId = await submitGame({ data: input.data });
      console.log("newGameWithId", newGameWithId);
      return newGameWithId;
    },
  })
  .mutation("restore", {
    input: z.object({
      data: z.object({ ...getGameEndpointContract(), oldId: z.string() }),
    }),
    async resolve({ input }) {
      // ALL DATA CHANGE MUST RESPECT THE OLD DATES

      // I get all affected games and create objects to resubmit them
      // I calculate player rating with created_at lower than

      // await recreateRatings(input)
      //   .catch(console.error)
      //   .finally(() => {
      //     prisma.$disconnect();
      //     console.log("Disconnecting!!!!");
      //   });
      const dateNow = new Date(Date.now());
      // we select the oldId game created_at
      const oldGameDate = await prisma.game_results.findFirst({
        select: {
          created_at: true,
          updated_at: true,
          reported_at: true,
        },
        where: {
          id: BigInt(input?.data?.oldId),
        },
      });

      // we select all games with date created_at >= oldId game
      const allGamesAffected = await prisma.game_results.findMany({
        select: {
          id: true,
          created_at: true,
          usa_player_id: true,
          ussr_player_id: true,
          game_winner: true,
          game_code: true,
        },
        where: {
          created_at: {
            gte: new Date(oldGameDate?.created_at as Date),
          },
        },
      });

      // we delete all rating info related to those games
      const ids = allGamesAffected.map((game) => game.id);

      const ratingsData = await prisma.ratings_history.deleteMany({
        where: {
          game_result_id: {
            in: ids,
          },
        },
      });
      console.log("ratingsData", ratingsData);
      let newGameWithId = "0";
      for (let index = 0; index < allGamesAffected.length; index++) {
        const game = allGamesAffected[index];
        console.log("index", index, game.id, input?.data?.oldId);
        if (game.id.toString() === input?.data?.oldId) {
          // we delete and add oldId game data with the new one submited
          const oldId = BigInt(input?.data?.oldId);
          await prisma.game_results.delete({
            where: {
              id: oldId,
            },
          });
          await prisma.ratings_history.deleteMany({
            where: {
              game_result_id: oldId,
            },
          });
          await submitGame({ data: input.data });
        } else {
          //we recalculate all ratings based on the games retrieved,
          const { newUsaRating, newUssrRating } = await calculateRating({
            usaPlayerId: game.usa_player_id,
            ussrPlayerId: game.ussr_player_id,
            gameWinner: game.game_winner,
          });
          console.log(
            "newUsaRating, newUssrRating",
            index,
            newUsaRating,
            newUssrRating
          );
          await prisma.ratings_history.createMany({
            data: [
              {
                player_id: BigInt(game.usa_player_id),
                rating: newUsaRating,
                game_code: "recr",
                created_at: game.created_at,
                updated_at: dateNow,
                game_result_id: game.id,
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
                player_id: BigInt(game.ussr_player_id),
                rating: newUssrRating,
                game_code: "recr",
                created_at: game.created_at,
                updated_at: dateNow,
                game_result_id: game.id,
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
        }
      }
      const restoreCompleted = await Promise.all(
        allGamesAffected.map(async (game: any, index: number) => {})
      );

      console.log("restoreCompleted", restoreCompleted);

      return null;

      console.log("Exiting!!!!");
      // we update all ratings records on DB
      // Endpoint response will return all rating variations
      // No new rows, nor deleted rows, should happen
    },
  });

async function recreateRatings(input: any) {
  try {
    await prisma.$transaction(async (prisma) => {
      
    });
  } catch (e) {
    console.log("trans error", e);
  }
}
type BiggerLowerValue = {
  bigger: number;
  smaller: number;
};

const getSmallerValue: (value1: number, value2: number) => BiggerLowerValue = (
  value1,
  value2
) => {
  if (value1 > value2) return { bigger: value1, smaller: value2 };
  if (value1 < value2) return { bigger: value1, smaller: value2 };
  return { bigger: value1, smaller: value2 };
};
export type GameRouter = typeof gameRouter;
