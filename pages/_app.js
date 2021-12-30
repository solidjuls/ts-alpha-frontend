import "../styles/globals.css";
import { IdProvider } from "@radix-ui/react-id";
import { IntlContextProvider } from "../contexts/IntlContext";
import { SessionProvider } from "next-auth/react";
import "./date.css";

function MyApp({ Component, pageProps }) {
  return (
    <IdProvider>
      <SessionProvider session={pageProps.session}>
        <IntlContextProvider>
          <Component {...pageProps} />
        </IntlContextProvider>
      </SessionProvider>
    </IdProvider>
  );
}

export default MyApp;
