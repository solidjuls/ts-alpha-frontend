import "../styles/globals.css";
import { IdProvider } from "@radix-ui/react-id";
import { appWithTranslation } from "next-i18next";
import "./date.css";

function MyApp({ Component, pageProps }) {
  return (
    <IdProvider>
      <Component {...pageProps} />
    </IdProvider>
  );
}

export default appWithTranslation(MyApp);
