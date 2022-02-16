import * as trpc from "@trpc/server";
import { userRouter } from "./user";
import { gameRouter } from "./game";

export const appRouter = trpc
  .router()
  .merge("user-", userRouter)
  .merge("game-", gameRouter);

export type AppRouter = typeof appRouter;
