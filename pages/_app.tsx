import AuthProvider from "contexts/AuthProvider";
import type { AppContext, AppProps } from "next/app";
import { ThemeProvider } from "next-themes";
import { Theme } from "@radix-ui/themes";
import { IntlContextProvider } from "contexts/IntlContext";
import Layout from "components/Layout";

import "primereact/resources/themes/saga-blue/theme.css"; // Change the theme as needed
import "primereact/resources/primereact.min.css"; // Core PrimeReact CSS
import "primeicons/primeicons.css"; // PrimeIcons CSS
import "styles/date.css";
import "styles/stylesGlobal.css";
import "@radix-ui/themes/styles.css";
import { getInfoFromCookies } from "utils/cookies";

function App({ Component, pageProps, name, id, email, role }: AppProps) {
  return (
    <AuthProvider name={name} email={email} id={id} role={role}>
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

App.getInitialProps = async (appContext: AppContext) => {
  const { ctx, Component } = appContext;
  const { req, res } = appContext.ctx;

  const payload = getInfoFromCookies(req, res);

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
  };
};

export default App;
