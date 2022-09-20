import { IdProvider } from "@radix-ui/react-id";
import AuthProvider from "contexts/AuthProvider";
import type { AppProps } from "next/app";
import { ThemeProvider } from "next-themes";
import { IntlContextProvider } from "contexts/IntlContext";
import APIProvider from "contexts/APIProvider";
import Layout from "components/Layout";
import { withTRPC } from "@trpc/next";
import type { AppRouter } from "backend/router";

import "styles/date.css";
import "styles/stylesGlobal.css";

function App({ Component, pageProps }: AppProps) {
  return (
    <IdProvider>
      <APIProvider>
        <AuthProvider>
          <IntlContextProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              value={{
                light: "light",
              }}
            >
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </ThemeProvider>
          </IntlContextProvider>
        </AuthProvider>
      </APIProvider>
    </IdProvider>
  );
}

export default withTRPC<AppRouter>({
  config({ ctx }) {
    /**
     * If you want to use SSR, you need to use the server's full URL
     * @link https://trpc.io/docs/ssr
     */
    console.log(
      "process.env.NEXT_PUBLIC_VERCEL_URL",
      process.env.NEXT_PUBLIC_URL
    );
    const url = process.env.NEXT_PUBLIC_URL
      ? `${process.env.NEXT_PUBLIC_URL}/api/trpc`
      : "http://localhost:3000/api/trpc";

    return {
      //transformer: superjson,
      url,
      /**
       * @link https://react-query.tanstack.com/reference/QueryClient
       */
      queryClientConfig: {
        defaultOptions: {
          queries: { staleTime: Infinity, refetchOnWindowFocus: false },
        },
      },
    };
  },
  /**
   * @link https://trpc.io/docs/ssr
   */
  ssr: true,
})(App);
