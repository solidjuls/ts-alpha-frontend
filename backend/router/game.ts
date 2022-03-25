import * as trpc from "@trpc/server";
import { z } from "zod";
import { prisma } from "backend/utils/prisma";
import { dateAddDay } from "utils/dates";
import { Game, SubmitGameType } from "types/game.types";
import { getRatingByPlayer } from "backend/utils/common";

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
})

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
      data: z.object({...getGameEndpointContract()}),
    }),
    async resolve({ input }) {
      const usaRating = await getRatingByPlayer({
        playerId: BigInt(input.data.usaPlayerId),
      });
      const ussrRating = await getRatingByPlayer({
        playerId: BigInt(input.data.ussrPlayerId),
      });
      let ratingDifference: number = 0;
      let newUsaRating: number = 0;
      let newUssrRating: number = 0;

      if (ussrRating && usaRating) {
        if (input?.data?.gameWinner === "1") {
          ratingDifference = getRatingDifference(
            ussrRating.rating,
            usaRating.rating,
            100
          );
          newUsaRating = usaRating.rating + ratingDifference;
          newUssrRating = ussrRating.rating - ratingDifference;
        } else if (input?.data?.gameWinner === "2") {
          ratingDifference = getRatingDifference(
            usaRating.rating,
            ussrRating.rating,
            100
          );
          newUsaRating = usaRating.rating - ratingDifference;
          newUssrRating = ussrRating.rating + ratingDifference;
        } else if (input?.data?.gameWinner === "3") {
          const { bigger, smaller } = getSmallerValue(
            usaRating.rating,
            ussrRating.rating
          );
          ratingDifference = getRatingDifference(smaller, bigger, 0);
          if (usaRating.rating < ussrRating.rating) {
            newUsaRating = usaRating.rating + ratingDifference;
            newUssrRating = ussrRating.rating - ratingDifference;
          } else if (usaRating.rating > ussrRating.rating) {
            newUsaRating = usaRating.rating - ratingDifference;
            newUssrRating = ussrRating.rating + ratingDifference;
          }
        }
      }

      const dateNow = new Date(Date.now());
      const newGame = {
        created_at: dateNow,
        updated_at: dateNow,
        usa_player_id: BigInt(input.data.usaPlayerId),
        ussr_player_id: BigInt(input.data.ussrPlayerId),
        game_type: input.data.gameType,
        game_code: input.data.gameCode,
        reported_at: dateNow,
        game_winner: input.data.gameWinner,
        end_turn: Number(input.data.endTurn),
        end_mode: input.data.endMode,
        game_date: new Date(Date.parse(input.data.gameDate)),
        video1: input.data.video1 || null,
        video2: input.data.video2 || null,
        video3: input.data.video3 || null,
        reporter_id: BigInt(input.data.usaPlayerId),
      };

      const newGameWithId = await prisma.game_results.create({
        data: {
          ...newGame,
          ratings_history: {
            create: [
              {
                player_id: BigInt(input.data.usaPlayerId),
                rating: newUsaRating,
                game_code: input.data.gameCode,
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
                player_id: BigInt(input.data.ussrPlayerId),
                rating: newUssrRating,
                game_code: input.data.gameCode,
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
      console.log("newGameWithId", newGameWithId);
      return null;
    },
  })
  .mutation("restore", {
    input: z.object({
      data: z.object({...getGameEndpointContract(), oldId: z.string()}),
    }),
    async resolve({ input }) {
      // ALL DATA CHANGE MUST RESPECT THE OLD DATES
      // we select the oldId game
      // we select all games with date created_at >= oldId game
      // we select all rating info related to those games
      // we update oldId game data with the new one submited
      // we recalculate all ratings based on the games retrieved, 
      // we update all ratings records on DB

      // Endpoint response will return all rating variations

      // No new rows, nor deleted rows, should happen
    }
  })
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
