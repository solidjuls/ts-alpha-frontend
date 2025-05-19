import AuthProvider from "contexts/AuthProvider";
import type { AppContext, AppProps } from "next/app";
import { ThemeProvider } from "next-themes";
import { Theme } from "@radix-ui/themes";
import { IntlContextProvider } from "contexts/IntlContext";
import Layout from "components/Layout";
import { Provider } from "react-redux";
import { store } from "../redux/store";
import type { IncomingMessage, ServerResponse } from "http";
import type { NextApiRequest, NextApiResponse } from "next";

import "primereact/resources/themes/saga-blue/theme.css"; // Change the theme as needed
import "primereact/resources/primereact.min.css"; // Core PrimeReact CSS
import "primeicons/primeicons.css"; // PrimeIcons CSS
import "styles/date.css";
import "styles/stylesGlobal.css";
import "@radix-ui/themes/styles.css";
import { getInfoFromCookies } from "utils/cookies";

interface CustomAppProps extends AppProps {
  name?: string;
  id?: string;
  email?: string;
  role?: number;
}

function App({ Component, pageProps, name, id, email, role }: CustomAppProps) {
  return (
    <AuthProvider name={name} email={email} id={id} role={role}>
      <Provider store={store}>
        <IntlContextProvider>
          {/* @ts-ignore */}
          <Theme>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </Theme>
        </IntlContextProvider>
      </Provider>
    </AuthProvider>
  );
}

App.getInitialProps = async (appContext: AppContext) => {
  const { ctx, Component } = appContext;
  const { req, res } = appContext.ctx;

  // Cast req and res to NextApiRequest and NextApiResponse since we know they have the required properties
  const payload =
    req && res ? getInfoFromCookies(req as NextApiRequest, res as NextApiResponse) : null;

  let pageProps = {};
  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx);
  }

  if (!payload) {
    return { ...pageProps };
  }
  return {
    ...pageProps,
    name: payload.name || null,
    id: payload.id || null,
    email: payload.mail || null,
    role: payload.role || null,
  };
};

export default App;
