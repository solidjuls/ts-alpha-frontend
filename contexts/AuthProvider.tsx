import {
  useContext,
  createContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import cookieCutter from "cookie-cutter";
import type { AuthType } from "../types/user.types";

type AuthContextProps = Pick<AuthType, "name" | "email"> & {
  setAuthentication?: (authProps: AuthType) => void;
};

const KEY = "ts-user";
const AuthContext = createContext<AuthContextProps>({
  email: undefined,
  name: undefined,
});

function getSessionStorageOrDefault(key: string, defaultValue?: AuthType) {
  console.log("asdfafsdf", key, defaultValue);
  if (typeof window !== "undefined") {
    const stored = sessionStorage.getItem(key);
    if (!stored) {
      return defaultValue;
    }
    return JSON.parse(stored);
  }
  return defaultValue;
}

type AuthProviderProps = {
  children: ReactNode;
};
const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [auth, setAuth] = useState<AuthType>(
    getSessionStorageOrDefault(KEY, {})
  );
  useEffect(() => {
    console.log("useSession effect enters");
    if (typeof window !== "undefined") {
      sessionStorage.setItem(KEY, JSON.stringify(auth));
    }
  }, [auth]);

  const setAuthentication = (authProps: AuthType) => {
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
