import { useContext, createContext, useState } from "react";
import { IntlProvider } from "react-intl";

const IntlContext = createContext();

const useIntlContext = () => {
  const context = useContext(IntlContext);

  if (!context) {
    throw new Error(
      "You need a IntlContextProvider component to use useIntlContext"
    );
  }

  return context;
};

const IntlContextProvider = ({ children, ...rest }) => {
  const [locale, setLocale] = useState("en");

  return (
    <IntlContext.Provider
      value={{
        locale,
        setLocale,
      }}
      {...rest}
    >
      <IntlProvider
        locale={locale}
        key={locale}
        messages={require(`../locales/${locale}.js`).messages}
        defaultLocale="en"
      >
        {children}
      </IntlProvider>
    </IntlContext.Provider>
  );
};

export { useIntlContext, IntlContextProvider };
