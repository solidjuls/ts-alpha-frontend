import "../styles/globals.css";
import { IdProvider } from "@radix-ui/react-id";
import { IntlContextProvider } from "../contexts/IntlContext";
import "./date.css";

function MyApp({ Component, pageProps }) {
  return (
    <IdProvider>
      <IntlContextProvider>
        <Component {...pageProps} />
      </IntlContextProvider>
    </IdProvider>
  );
}

export default MyApp;
