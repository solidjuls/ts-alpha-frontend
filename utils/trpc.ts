import { createReactQueryHooks } from "@trpc/react";
import { createTRPCClient } from '@trpc/client';
import type { AppRouter } from "backend/router";

export const trpc = createReactQueryHooks<AppRouter>();
export const client = createTRPCClient<AppRouter>({
    url: process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}/api/trpc`
      : "http://localhost:3000/api/trpc"
});
