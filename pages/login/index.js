import { useState } from "react";
import Head from "next/head";
import { FormattedMessage } from "react-intl";

import { styled } from "stitches.config";

import { Button } from "components/Button";
import { Input } from "components/Input";
import { Label } from "components/Label";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/router";
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

const Login = ({ user }) => {
  const { error } = useRouter().query;
  const { data: session, status } = useSession();
  const [mail, setMail] = useState("");
  const [pwd, setPwd] = useState("");

  return (
    <>
      <Form css={formStyles}>
        <Head>
          <title>Sign Up</title>
        </Head>

        <Box
          css={{
            display: "flex",
            flexDirection: "column",
            justifyItems: "center",
            alignItems: "center",
          }}
        >
          <h1>Sign up</h1>
          <Label htmlFor="mail">
            <FormattedMessage id="mail" />
          </Label>
          <Input
            type="text"
            id="mail"
            margin="login"
            defaultValue={mail}
            onChange={(event) => setMail(event.target.value)}
            css={{ width: "300px" }}
          />
          <Label htmlFor="pwd">
            <FormattedMessage id="password" />
          </Label>
          <Input
            type="text"
            id="pwd"
            margin="login"
            defaultValue={pwd}
            onChange={(event) => setPwd(event.target.value)}
            css={{ width: "300px" }}
          />
          {error && <ErrorInfo>Could not sign in</ErrorInfo>}
          {!session && (
            <Button
              onClick={(e) => {
                e.preventDefault();
                signIn("credentials", {
                  mail,
                  pwd,
                  callbackUrl: "/submitform",
                });
              }}
            >
              Login
            </Button>
          )}
          {session && (
            <Button
              onClick={() => signOut("credentials", { callbackUrl: "/" })}
            >
              Sign out
            </Button>
          )}
        </Box>
      </Form>
    </>
  );
};

export default Login;
