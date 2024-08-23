import { appRouter } from "backend/router";
import { createNextApiHandler } from "@trpc/server/adapters/next";
import { createContext } from "backend/context";
import superjson from 'superjson';

export default createNextApiHandler({
  router: appRouter,
  transformer: superjson,
  createContext,
});
