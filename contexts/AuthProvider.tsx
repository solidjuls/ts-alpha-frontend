import getAxiosInstance from "utils/axios";
import { useContext, createContext, useState, useEffect, ReactNode } from "react";
import cookieCutter from "cookie-cutter";
import { useRouter } from "next/router";
import type { AuthType } from "../types/user.types";

type LoginFnType = (mail: string, pwd: string) => void;
type LogoutFnType = () => void;

type AuthContextProps = Pick<AuthType, "name" | "email" | "id"> & {
  setAuthentication?: (authProps: AuthType) => void;
  login?: LoginFnType;
  logout?: LogoutFnType;
  errorMsg?: string;
};

const KEY = "ts-user";
const AuthContext = createContext<AuthContextProps>({
  email: undefined,
  name: undefined,
});

type AuthProviderProps = {
  children: ReactNode;
};

const AuthProvider: React.FC<AuthProviderProps> = ({ children, name, email, id, role }) => {
  const router = useRouter();
  const [auth, setAuth] = useState<AuthType>({ name, email, id, role });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const setAuthentication = (authProps: AuthType) => {
    setAuth(authProps);
  };

  const login: LoginFnType = async (mail, pwd) => {
    try {
      // @ts-ignore
      const { data } = await getAxiosInstance().post("/api/user/login", {
        mail,
        pwd,
      });

      if (data && setAuthentication) {
        router.push("/");
        setAuthentication(data);
      }
    } catch (e) {
      console.log("login error", e.message);
      setErrorMsg(e.message);
    }
  };

  const logout: LogoutFnType = async () => {
    try {
      const { data } = await getAxiosInstance().post("/api/user/signout");
      if (data && data.success && setAuthentication) setAuthentication({});
      router.push("/");
    } catch (e) {
      console.log("sign out error", e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        id: auth.id,
        email: auth.email,
        name: auth.name,
        role: auth.role,
        setAuthentication,
        errorMsg,
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
