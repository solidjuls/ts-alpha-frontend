import "../styles/globals.css";
import { IdProvider } from "@radix-ui/react-id";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { ThemeProvider } from "next-themes";

import { IntlContextProvider } from "contexts/IntlContext";
import Layout from "components/Layout";
import { darkTheme } from "stitches.config.js";
import { withTRPC } from "@trpc/next";
import type { AppRouter } from "backend/router";

import "./date.css";
import "./stylesGlobal.css";

function App({ Component, pageProps }: AppProps) {
  return (
    <IdProvider>
      <SessionProvider session={pageProps.session}>
        <IntlContextProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            value={{
              dark: darkTheme.className,
              light: "light",
            }}
          >
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </ThemeProvider>
        </IntlContextProvider>
      </SessionProvider>
    </IdProvider>
  );
}

export default withTRPC<AppRouter>({
  config({ ctx }) {
    /**
     * If you want to use SSR, you need to use the server's full URL
     * @link https://trpc.io/docs/ssr
     */
    console.log("process.env.NEXT_PUBLIC_VERCEL_URL", process.env.NEXT_PUBLIC_URL)
    const url = process.env.NEXT_PUBLIC_URL
      ? `${process.env.NEXT_PUBLIC_URL}/api/trpc`
      : "http://localhost:3000/api/trpc";

    return {
      url,
      /**
       * @link https://react-query.tanstack.com/reference/QueryClient
       */
      // queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
    };
  },
  /**
   * @link https://trpc.io/docs/ssr
   */
  ssr: true,
})(App);
