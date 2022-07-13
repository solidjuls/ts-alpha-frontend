import {
  useContext,
  createContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import cookieCutter from "cookie-cutter";
import { useRouter } from "next/router";
import type { AuthType } from "../types/user.types";
import { trpc } from "contexts/APIProvider";

type LoginFnType = (mail: string, pwd: string) => void;
type LogoutFnType = () => void

type AuthContextProps = Pick<AuthType, "name" | "email"> & {
  setAuthentication?: (authProps: AuthType) => void;
  login?: LoginFnType;
  logout?: LogoutFnType;
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
  const router = useRouter();
  const signIn = trpc.useMutation(["user-signin"]);
  const signOut = trpc.useMutation(["user-signout"]);
  const [auth, setAuth] = useState<AuthType>(
    getSessionStorageOrDefault(KEY, {})
  );
  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(KEY, JSON.stringify(auth));
    }
  }, [auth]);

  const setAuthentication = (authProps: AuthType) => {
    cookieCutter.set("ts-user", authProps);
    setAuth(authProps);
  };

  const login: LoginFnType = async (mail, pwd) => {
    try {
      const response = await signIn.mutateAsync({
        mail,
        pwd,
      });
      if (response && setAuthentication) {
        router.push("/");
        setAuthentication(response);
      }
    } catch (e) {
      console.log("login error", e);
    }
  };

  const logout: LogoutFnType = async () => {
    try {
      const response = await signOut.mutateAsync();
      if (response && response.success && setAuthentication)
        setAuthentication({});
        router.push("/");
    } catch (e) {
      console.log("sign out error", e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        email: auth.email,
        name: auth.name,
        setAuthentication,
        login,
        logout,
      }}
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
