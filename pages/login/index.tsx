import { useEffect, useState } from "react";
import Head from "next/head";
import { FormattedMessage } from "react-intl";

import { styled } from "stitches.config";
import { hash } from "bcryptjs";

import { Button } from "components/Button";
import Text from "components/Text";
import { Input, PasswordInput } from "components/Input";
import { Label } from "components/Label";
import { useSession } from "contexts/AuthProvider";
import { useRouter } from "next/router";
import Link from "next/link";
import { Box, Form } from "components/Atoms";
import { Spinner } from "@radix-ui/themes";
import { Checkbox } from "components/Checkbox";

const formStyles = {
  display: "flex",
  flexDirection: "column",
  justifyItems: "center",
  justifyContent: "center",
  alignItems: "center",
  alignSelf: "center",
  backgroundColor: "White",
  width: "100%",
  height: "400px",
  boxShadow: "rgb(100 100 111 / 20%) 0px 7px 29px 0px",
};

const ErrorInfo = styled("span", {
  color: "red",
  margin: "8px",
});

const saveCredentials = (mail: string, password: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("mail", mail);
    localStorage.setItem("password", password);
  }
};

const getCredentials = (): { mail: string | null; password: string | null } => {
  if (typeof window !== "undefined") {
    const mail = localStorage.getItem("mail");
    const password = localStorage.getItem("password");
    return { mail, password };
  }
  return { mail: null, password: null };
};

const LoginForm: React.FC = () => {
  const { login, errorMsg } = useSession();
  const [mail, setMail] = useState<string>("");
  const [pwd, setPwd] = useState<string>("");
  const [saveCred, setSaveCred] = useState<boolean>(true);
  const [validationErrorMsg, setValidationErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadSavedCredentials();
  }, []);

  const loadSavedCredentials = () => {
    const credentials = getCredentials();
    if (credentials.mail && credentials.password) {
      setMail(credentials.mail);
      setPwd(credentials.password);
    }
  };

  function validate() {
    if (!mail) {
      setValidationErrorMsg("Email is empty");
      return false;
    }
    if (!pwd) {
      setValidationErrorMsg("Password is empty");
      return false;
    }
    return true;
  }

  const onClick = async (e) => {
    e.preventDefault();
    try {
      if (login && validate()) {
        setIsLoading(true);
        await login(mail, pwd);
        if (saveCred) {
          saveCredentials(mail, pwd);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onCheckedChange = (value) => {
    if (saveCred && !value) {
      localStorage.removeItem("mail");
      localStorage.removeItem("password");
    }
    setSaveCred(value);
  };

  return (
    <>
      <h1>Login</h1>
      <Label htmlFor="mail">
        <FormattedMessage id="mail" />
      </Label>
      <Input
        type="text"
        id="mail"
        margin="login"
        defaultValue={mail}
        value={mail}
        onChange={(event) => setMail(event.target.value)}
        css={{ width: "300px" }}
      />
      <Label htmlFor="pwd">
        <FormattedMessage id="password" />
      </Label>
      <PasswordInput
        id="pwd"
        margin="login"
        autocomplete="on"
        value={pwd}
        defaultValue={pwd}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setPwd(event.target.value)}
        css={{ width: "300px" }}
      />
      <Checkbox text="Remember Me" onCheckedChange={onCheckedChange} checked={saveCred} />
      {validationErrorMsg && <Text css={{ color: "red" }}>{validationErrorMsg}</Text>}
      <Button disabled={isLoading} onClick={onClick}>
        {isLoading ? <Spinner size="3" /> : <b>Login</b>}
      </Button>
      <Link href="/reset-password" passHref>
        <Text css={{ cursor: "pointer" }}>Forgot your password?</Text>
      </Link>
      {errorMsg && <Text type="error">{errorMsg}</Text>}
    </>
  );
};

const LoggedOutForm = () => {
  const { logout, name } = useSession();

  return (
    <>
      <Head>
        <title>Sign Out</title>
      </Head>
      <h2>Hi {`${name}`}</h2>
      <Button
        onClick={async (e) => {
          e.preventDefault();
          if (logout) await logout();
        }}
      >
        Sign out
      </Button>
    </>
  );
};

const Login = () => {
  const router = useRouter();

  const { email } = useSession();

  return (
    <>
      <Form css={formStyles}>
        <Box
          css={{
            display: "flex",
            flexDirection: "column",
            justifyItems: "center",
            alignItems: "center",
          }}
        >
          {!email && <LoginForm />}
          {email && <LoggedOutForm />}
          {router?.query?.error && <ErrorInfo>Could not sign in</ErrorInfo>}
        </Box>
      </Form>
    </>
  );
};

export default Login;
