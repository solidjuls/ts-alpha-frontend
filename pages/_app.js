import "../styles/globals.css";
import { IdProvider } from "@radix-ui/react-id";
import "./date.css";

function MyApp({ Component, pageProps }) {
  return (
    <IdProvider>
      <Component {...pageProps} />
    </IdProvider>
  );
}

export default MyApp;
