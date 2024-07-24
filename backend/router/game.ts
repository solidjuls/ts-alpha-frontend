import * as trpc from "@trpc/server";
import { z } from "zod";
import { prisma } from "backend/utils/prisma";
import { dateAddDay } from "utils/dates";
import {
  Game,
  GameAPI,
  GameWinner,
  GameRecreate,
  zGameAPI,
  zGameRecreateAPI,
} from "types/game.types";
import { calculateRating } from "backend/controller/rating.controller";
import { getGameWithRatings, getGameByGameId } from "backend/controller/game.controller";
import { getWinnerText } from "utils/games";

const submitGame = async (data: GameAPI) => {
  const { newUsaRating, newUssrRating, usaRating, ussrRating } = await calculateRating({
    usaPlayerId: data.usaPlayerId,
    ussrPlayerId: data.ussrPlayerId,
    gameWinner: data.gameWinner,
    gameType: data.gameType,
  });

  console.log("newUsaRating, newUssrRating", newUsaRating, newUssrRating);
  const dateNow = new Date(Date.now());
  const newGame = {
    created_at: dateNow,
    updated_at: dateNow,
    usa_player_id: BigInt(data.usaPlayerId),
    ussr_player_id: BigInt(data.ussrPlayerId),
    usa_previous_rating: usaRating,
    ussr_previous_rating: ussrRating,
    game_type: data.gameType,
    game_code: data.gameCode,
    reported_at: dateNow,
    game_winner: data.gameWinner,
    end_turn: Number(data.endTurn),
    end_mode: data.endMode,
    game_date: new Date(Date.parse(data.gameDate)),
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

export const gameRouter = trpc
  .router()
  .query("getAll", {
    input: z.object({ d: z.string() }),
    async resolve({ input }) {
      const date = new Date(Date.parse(input.d));
      const datePlusOne = dateAddDay(date, 1);
      console.log("enter router", new Date());
      const gamesNormalized = await getGameWithRatings({
        created_at: {
          lte: datePlusOne,
        },
      });

      console.log("gamesNormalized", new Date());
      const gameParsed = JSON.stringify(gamesNormalized, (key, value) =>
        typeof value === "bigint" ? value.toString() : value,
      );
      console.log("gameParsed", new Date());
      return JSON.parse(gameParsed) as Game[];
    },
  })
  .query("get", {
    input: z.object({ id: z.string() }),
    async resolve({ input }) {
      const gameNormalized = await getGameWithRatings({
        id: input.id
      });
      const gameParsed = JSON.stringify(gameNormalized[0], (key, value) =>
        typeof value === "bigint" ? value.toString() : value,
      );
      return JSON.parse(gameParsed) as Game;
    }
  })
  .query("getDataByGame", {
    input: z.object({ id: z.number() }),
    async resolve({ input }) {
      const game = await prisma.game_results.findFirst({
        select: {
          game_code: true,
          game_type: true,
          usa_player_id: true,
          ussr_player_id: true,
          game_winner: true,
          end_turn: true,
          end_mode: true,
          game_date: true,
          video1: true,
        },
        where: {
          id: input.id,
        },
      });

      console.log("game", game);

      const gameParsed = JSON.stringify(game, (key, value) =>
        typeof value === "bigint" ? value.toString() : value,
      );
      return JSON.parse(gameParsed);
    },
  })
  .mutation("submit", {
    input: z.object({
      data: zGameAPI,
    }),
    async resolve({ input }) {
      const newGameWithId = await submitGame(input.data);
      console.log("newGameWithId", newGameWithId);
      const newGameWithIdParsed = JSON.stringify(newGameWithId, (key, value) =>
        typeof value === "bigint" ? value.toString() : value,
      );
      return JSON.parse(newGameWithIdParsed);
    },
  })
  .mutation("restoreConfirm", {
    input: z.object({ id: z.string() }),
    async resolve({ input }) {
      console.log("input", input);
      const summaryGames = await recreateRatingsConfirm(input.id);

      const gameParsed = JSON.stringify(summaryGames);
      return JSON.parse(gameParsed);
    },
  })
  .mutation("restore", {
    input: z.object({
      data: zGameRecreateAPI,
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
      const summaryGames = await recreateRatings(input.data);

      console.log("summaryGames", summaryGames);
      const gameParsed = JSON.stringify(summaryGames);
      return JSON.parse(gameParsed);
      // return JSON.parse("yeah");
    },
  });

async function recreateRatingsConfirm(oldId: string) {
  const oldGameDate = await getGameByGameId(oldId);
  if (oldGameDate && oldGameDate.created_at != null) {
    const gamesAffected = await getGameWithRatings({
      created_at: {
        gte: oldGameDate.created_at,
      },
    });

    return gamesAffected.map(
      (game, index) =>
        `G${index} - ${game.usaPlayer} (${game.ratingsUSA.rating}) (${game.ratingsUSA.ratingDifference}) vs ${game.ussrPlayer} (${game.ratingsUSSR.rating}) (${game.ratingsUSSR.ratingDifference})`,
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
  gameType,
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
  });
  console.log("newUsaRating, newUssrRating", gameId, newUsaRating, newUssrRating);
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

  return { usaRating, ussrRating };
};

const startRecreatingRatings = async (input: GameRecreate) => {
  const dateNow = new Date(Date.now());
  // we select the oldId game created_at
  const oldGameDate = await getGameByGameId(input.oldId);

  // we select all games with date created_at >= oldId game
  const allGamesAffected = await prisma.game_results.findMany({
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
  });
  console.log("allGamesAffected", allGamesAffected);
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
    console.log("index", index, game.id, input.oldId);
    if (game.id.toString() === input.oldId) {
      // const oldId = BigInt(input.oldId);
      const { usaRating, ussrRating } = await createNewRating({
        usaPlayerId: BigInt(input.usaPlayerId),
        ussrPlayerId: BigInt(input.ussrPlayerId),
        gameWinner: input.gameWinner as GameWinner,
        createdAt: game.created_at,
        updatedAt: dateNow,
        gameId: game.id,
        gameType: game.game_type,
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

      await prisma.game_results.update({
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
      });
      await prisma.game_results.update({
        data: {
          usa_previous_rating: usaRating,
          ussr_previous_rating: ussrRating,
        },
        where: {
          id: game.id,
        },
      });
    }
  }

  return null;
};
async function recreateRatings(input: GameRecreate) {
  try {
    return await startRecreatingRatings(input);
    // await prisma.$transaction(async (prisma) => {

    // });
  } catch (e) {
    console.log("trans error", e);
  }
}

export type GameRouter = typeof gameRouter;
