import AuthProviderNew from "contexts/AuthProviderNew";
import type { AppProps } from "next/app";
import { ThemeProvider } from "next-themes";
import { Theme } from "@radix-ui/themes";
import { IntlContextProvider } from "contexts/IntlContext";

import "primereact/resources/themes/saga-blue/theme.css"; // Change the theme as needed
import "primereact/resources/primereact.min.css"; // Core PrimeReact CSS
import "primeicons/primeicons.css"; // PrimeIcons CSS
import "styles/date.css";
import "styles/stylesGlobal.css";
import "@radix-ui/themes/styles.css";

import { ThemeProvider as StyledThemeProvider } from "styled-components";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { theme } from "../theme";
import Layout, { MainLayout } from "components/Layout";

function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes
        retry: 1,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProviderNew>
        <IntlContextProvider>
          <StyledThemeProvider theme={theme}>
            {/* @ts-ignore */}
            <Theme>
              <MainLayout>
                <Component {...pageProps} />
              </MainLayout>
            </Theme>
          </StyledThemeProvider>
        </IntlContextProvider>
      </AuthProviderNew>
    </QueryClientProvider>
  );
}



export default App;
