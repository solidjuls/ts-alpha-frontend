import { initTRPC } from "@trpc/server";
import { userRouter } from "./user";
import { gameRouter } from "./game";
import { ratingsRouter } from "./ratings";
import type { Context } from "../context";

const trpc = initTRPC.create();

export const appRouter = trpc.router({
  user: userRouter,
  game: gameRouter,
  rating: ratingsRouter,
})
  // .router<Context>()
  // .merge("user-", userRouter)
  // .merge("game-", gameRouter)
  // .merge("rating-", ratingsRouter);

export type AppRouter = typeof appRouter;
