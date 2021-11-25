import "../styles/globals.css";
import { IdProvider } from "@radix-ui/react-id";
import { appWithTranslation } from "next-i18next";
import "./date.css";

export const getInitialProps = async (context) => {
  if (context.ctx.req && context.ctx.res) {
      res.set = res.setHeader;
      req.path = context.ctx.asPath;

      const i18nHandler = handle(i18n, {ignoreRoutes: config.ignoreRoutes});
      await new Promise((resolve, reject) => {
          try {
              i18nHandler(req, res, resolve);
          } catch (e) {
              reject(e);
          }
      });
  }
}

function MyApp({ Component, pageProps }) {
  return (
    <IdProvider>
      <Component {...pageProps} />
    </IdProvider>
  );
}

export default appWithTranslation(MyApp);
