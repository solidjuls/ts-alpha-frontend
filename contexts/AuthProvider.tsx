import { useContext, createContext, useState, useEffect } from "react";
import cookieCutter from "cookie-cutter";

const KEY = "ts-user";
const AuthContext = createContext({});
function getSessionStorageOrDefault(key, defaultValue) {
  if (typeof window !== "undefined") {
    const stored = sessionStorage.getItem(key);
    if (!stored) {
      return defaultValue;
    }
    return JSON.parse(stored);
  }
  return defaultValue;
}

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(getSessionStorageOrDefault(KEY, {}));
  useEffect(() => {
    console.log("useSession effect enters");
    if (typeof window !== "undefined") {
      sessionStorage.setItem(KEY, JSON.stringify(auth));
    }
  }, [auth]);

  const setAuthentication = (authProps) => {
    cookieCutter.set("ts-user", authProps);
    setAuth(authProps);
  };

  console.log("auth?", auth);
  return (
    <AuthContext.Provider
      value={{ email: auth.email, name: auth.name, setAuthentication }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(AuthContext);

  return context;
};

export default AuthProvider;
