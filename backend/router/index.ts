import * as trpc from "@trpc/server";
import { userRouter } from "./user";
import { gameRouter } from "./game";
import { ratingsRouter } from "./ratings";
import type { Context } from "../context";

export const appRouter = trpc
  .router<Context>()
  .merge("user-", userRouter)
  .merge("game-", gameRouter)
  .merge("rating-", ratingsRouter);

export type AppRouter = typeof appRouter;
