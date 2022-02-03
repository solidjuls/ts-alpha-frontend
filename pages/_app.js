import "../styles/globals.css";
import { IdProvider } from "@radix-ui/react-id";
import { SessionProvider } from "next-auth/react";

import { IntlContextProvider } from "../contexts/IntlContext";
import Layout from "components/Layout";

import "./date.css";
import "./stylesGlobal.css";

function App({ Component, pageProps }) {
  return (
    <IdProvider>
      <SessionProvider session={pageProps.session}>
        <IntlContextProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </IntlContextProvider>
      </SessionProvider>
    </IdProvider>
  );
}

export default App;
