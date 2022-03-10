import * as trpc from "@trpc/server";
import { userRouter } from "./user";
import { gameRouter } from "./game";
import { ratingsRouter } from "./ratings";
import { Ratings } from "types/ratings.types";

export const appRouter = trpc
  .router()
  .merge("user-", userRouter)
  .merge("game-", gameRouter)
  .merge("rating-", ratingsRouter);

export type AppRouter = typeof appRouter;
