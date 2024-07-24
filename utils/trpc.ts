// src/utils/trpc.ts
import { createTRPCClient } from '@trpc/client';
import type { AppRouter } from "backend/router"

const trpc = createTRPCClient<AppRouter>({
    url: '/api/trpc',
  });

export default trpc;
