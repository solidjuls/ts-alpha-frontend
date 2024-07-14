import { useState } from "react";
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

const formStyles = {
  display: "flex",
  flexDirection: "column",
  justifyItems: "center",
  justifyContent: "center",
  alignItems: "center",
  alignSelf: "center",
  backgroundColor: "White",
  width: "640px",
  height: "400px",
  boxShadow: "rgb(100 100 111 / 20%) 0px 7px 29px 0px",
};

const ErrorInfo = styled("span", {
  color: "red",
  margin: "8px",
});

const LoginForm: React.FC = () => {
  const { login } = useSession();
  const [mail, setMail] = useState<string>("");
  const [pwd, setPwd] = useState<string>("");

  return (
    <>
      <h1>Sign up</h1>
      <Label htmlFor="mail">
        <FormattedMessage id="mail" />
      </Label>
      <Input
        type="text"
        id="mail"
        margin="login"
        // defaultValue={mail}
        onChange={(event) => setMail(event.target.value)}
        css={{ width: "300px" }}
      />
      <Label htmlFor="pwd">
        <FormattedMessage id="password" />
      </Label>
      <PasswordInput
        id="pwd"
        margin="login"
        defaultValue={pwd}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setPwd(event.target.value)}
        css={{ width: "300px" }}
      />
      <Button
        onClick={async (e) => {
          e.preventDefault();
          if (login) await login(mail, pwd);
        }}
      >
        Login
      </Button>
      <Link href="/reset-password" passHref>
        <Text css={{ cursor: "pointer" }}>Forgot your password?</Text>
      </Link>
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
