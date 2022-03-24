import { useContext } from "react";
import { createReactQueryHooks } from "@trpc/react";
import type { inferProcedureOutput } from '@trpc/server';
import jwt from "next-auth/jwt"
import { QueryClient, QueryClientProvider } from "react-query";
import { getCookie, getCookies } from "cookies-next";
import { getSession } from "next-auth/react"
import type { AppRouter } from "backend/router";
import { getToken } from "next-auth/jwt"

const queryClient = new QueryClient();
export const trpc = createReactQueryHooks<AppRouter>();
const trpcClient = trpc.createClient({
  url: process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}/api/trpc`
    : "http://localhost:3000/api/trpc",
  headers() {
    const sessionToken = getCookie("next-auth.session-token");
    
    console.log("taking value from cookies here", getCookies())
    return {
      authorization: sessionToken ? `bearer ${sessionToken}` : undefined,
      "Content-Type": "application/json",
      Accept: "application/json",
    };
  },
});

const APIProvider = ({ children }: React.ComponentProps<any>) => {
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      {children}
    </trpc.Provider>
  );
};

export default APIProvider;
