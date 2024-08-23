import AuthProvider from "contexts/AuthProvider";
import type { AppProps } from "next/app";
import { ThemeProvider } from "next-themes";
import { Theme } from "@radix-ui/themes";
import { IntlContextProvider } from "contexts/IntlContext";
// import APIProvider from "contexts/APIProvider";
import Layout from "components/Layout";
// import { withTRPC } from "@trpc/next";
import { trpc } from "utils/trpc";
import type { AppRouter } from "backend/router";

import "styles/date.css";
import "styles/stylesGlobal.css";
import "@radix-ui/themes/styles.css";

function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <IntlContextProvider>
        {/* @ts-ignore */}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          value={{
            light: "light",
          }}
        >
          <Theme>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </Theme>
        </ThemeProvider>
      </IntlContextProvider>
    </AuthProvider>
  );
}

export default App;
