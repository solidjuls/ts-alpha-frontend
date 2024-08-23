// // src/utils/trpc.ts
// import { createTRPCClient } from "@trpc/client";
// import type { AppRouter } from "backend/router";

// const trpc = createTRPCClient<AppRouter>({
//   url: "/api/trpc",
// });

// export default trpc;

// src/utils/trpc.ts
import { createTRPCNext } from '@trpc/next';
import { httpBatchLink } from '@trpc/client';
import type { AppRouter } from 'backend/router';
import superjson from 'superjson';

export const trpc = createTRPCNext<AppRouter>({
  config() {
    return {
      transformer: superjson,
      links: [
        httpBatchLink({
          url: '/api/trpc',
        }),
      ],
    };
  },
  ssr: true
});