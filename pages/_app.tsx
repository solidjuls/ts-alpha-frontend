import AuthProvider from "contexts/AuthProvider";
import type { AppContext, AppProps } from "next/app";
import { ThemeProvider } from "next-themes";
import { Theme } from "@radix-ui/themes";
import { IntlContextProvider } from "contexts/IntlContext";

import "primereact/resources/themes/saga-blue/theme.css"; // Change the theme as needed
import "primereact/resources/primereact.min.css"; // Core PrimeReact CSS
import "primeicons/primeicons.css"; // PrimeIcons CSS
import "styles/date.css";
import "styles/stylesGlobal.css";
import "@radix-ui/themes/styles.css";
import { getInfoFromCookies } from "utils/cookies";
import { Provider } from "react-redux";
import { store } from "../redux/store";
import { ThemeProvider as StyledThemeProvider } from "styled-components";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { theme } from "../theme";
import Layout, { MainLayout } from "components/Layout";

interface CustomAppProps extends AppProps {
  name?: string;
  id?: string;
  email?: string;
  role?: number;
  tournaments?: any[];
}

function App({ Component, pageProps, name, id, email, role, tournaments }: CustomAppProps) {
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
      <AuthProvider name={name} email={email} id={id} role={role} tournaments={tournaments}>
        <Provider store={store}>
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
        </Provider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

App.getInitialProps = async (appContext: AppContext) => {
  const { ctx, Component } = appContext;
  const { req, res } = appContext.ctx;

  const payload = getInfoFromCookies(req as any, res as any);

  let pageProps = {};
  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx); // Fetch the specific page's initial props
  }

  if (!payload) {
    return { ...pageProps };
  }
  return {
    ...pageProps,
    name: payload.name,
    id: payload.id,
    email: payload.mail,
    role: payload.role,
    tournaments: payload.tournamentsRegistered || []
  };
};

export default App;
