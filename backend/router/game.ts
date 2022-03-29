import * as trpc from "@trpc/server";
import { z } from "zod";
import { prisma } from "backend/utils/prisma";
import { dateAddDay } from "utils/dates";
import { Game, SubmitGameType } from "types/game.types";
import { calculateRating } from "backend/controller/rating.controller";
import {
  getGameWithRatings,
  getGameById,
} from "backend/controller/game.controller";
import { getWinnerText } from "utils/games";

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

      const gamesNormalized = await getGameWithRatings({
        created_at: {
          lt: datePlusOne,
          gte: date,
        },
      });

      const gameParsed = JSON.stringify(gamesNormalized, (key, value) =>
        typeof value === "bigint" ? value.toString() : value
      );

      return JSON.parse(gameParsed) as Game[];
    },
  })
  .mutation("restoreConfirm", {
    input: z.object({ id: z.string() }),
    async resolve({ input }) {
      console.log("input", input)
      const summaryGames = await recreateRatingsConfirm(input?.id);

      const gameParsed = JSON.stringify(summaryGames);
      return JSON.parse(gameParsed);
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
      // await recreateRatings(input)
      //   .catch(console.error)
      //   .finally(() => {
      //     prisma.$disconnect();
      //     console.log("Disconnecting!!!!");
      //   });
      console.log("input?.data", input?.data);
      const summaryGames = await recreateRatings(input);
      
      console.log("summaryGames", summaryGames);
      const gameParsed = JSON.stringify(summaryGames);
      return JSON.parse(gameParsed);
      // return JSON.parse("yeah");
    },
  });


async function recreateRatingsConfirm(oldId: string) {
  const oldGameDate = await getGameById(oldId);

  if (oldGameDate && oldGameDate.created_at != null) {
    const gamesAffected = await getGameWithRatings({
      created_at: {
        gte: new Date(oldGameDate.created_at),
      },
    });
    return gamesAffected.map(
      (game, index) =>
        `G${index} - ${game.usaPlayer} (${game.ratingsUSA.rating}) (${
          game.ratingsUSA.ratingDifference
        }) vs ${game.ussrPlayer} (${game.ratingsUSSR.rating}) (${
          game.ratingsUSSR.ratingDifference
        }) ->Winner ${getWinnerText(game.gameWinner)}`
    );
  }
  return [];
}

const createNewRating = async ({
  usaPlayerId,
  ussrPlayerId,
  gameWinner,
  createdAt,
  updatedAt,
  gameId,
}) => {
  //we recalculate all ratings based on the games retrieved,
  const { newUsaRating, newUssrRating } = await calculateRating({
    usaPlayerId,
    ussrPlayerId,
    gameWinner,
  });
  console.log(
    "newUsaRating, newUssrRating",
    gameId,
    newUsaRating,
    newUssrRating
  );
  await prisma.ratings_history.createMany({
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
};

const startRecreatingRatings = async (input) => {
  const dateNow = new Date(Date.now());
  // we select the oldId game created_at
  const oldGameDate = await getGameById(input?.data?.oldId);

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

  await prisma.ratings_history.deleteMany({
    where: {
      game_result_id: {
        in: ids,
      },
    },
  });

  for (let index = 0; index < allGamesAffected.length; index++) {
    const game = allGamesAffected[index];
    console.log("index", index, game.id, input?.data?.oldId);
    if (game.id.toString() === input?.data?.oldId) {
      const oldId = BigInt(input?.data?.oldId);
      const newGame = {
        updated_at: dateNow,
        usa_player_id: BigInt(input?.data?.usaPlayerId),
        ussr_player_id: BigInt(input?.data?.ussrPlayerId),
        game_type: input?.data?.gameType,
        game_code: input?.data?.gameCode,
        game_winner: input?.data?.gameWinner,
        end_turn: Number(input?.data?.endTurn),
        end_mode: input?.data?.endMode,
        game_date: new Date(Date.parse(input?.data?.gameDate)),
        video1: input?.data?.video1 || null,
        video2: input?.data?.video2 || null,
        video3: input?.data?.video3 || null,
        reporter_id: BigInt(input?.data?.usaPlayerId),
      };

      await prisma.game_results.update({
        data: {
          ...newGame,
        },
        where: {
          id: oldId,
        },
      });
      await createNewRating({
        usaPlayerId: BigInt(input?.data?.usaPlayerId),
        ussrPlayerId: BigInt(input?.data?.ussrPlayerId),
        gameWinner: input?.data?.gameWinner,
        createdAt: game.created_at,
        updatedAt: dateNow,
        gameId: game.id,
      });
    } else {
      await createNewRating({
        usaPlayerId: BigInt(game.usa_player_id),
        ussrPlayerId: BigInt(game.ussr_player_id),
        gameWinner: game.game_winner,
        createdAt: game.created_at,
        updatedAt: dateNow,
        gameId: game.id,
      });
    }
  }

  return null;
};
async function recreateRatings(input: any) {
  try {
    return await startRecreatingRatings(input);
    // await prisma.$transaction(async (prisma) => {

    // });
  } catch (e) {
    console.log("trans error", e);
  }
}

export type GameRouter = typeof gameRouter;
