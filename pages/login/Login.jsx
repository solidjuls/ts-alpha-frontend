import { useEffect } from "react";
import Head from "next/head";
import { FormattedMessage } from "react-intl";
import { styled } from "@stitches/react";

import { Button } from "components/Button";
import { Input } from "components/Input";
import { Label } from "components/Label";
import { useSession, signIn, signOut } from "next-auth/react";

const Form = styled("form", {
  display: "flex",
  flexDirection: "column",
  justifyItems: "center",
  justifyContent: "center",
  alignItems: "center",
  alignSelf: "center",
  backgroundColor: "White", 
  width: "640px",
  height: "400px",
  boxShadow: "rgb(100 100 111 / 20%) 0px 7px 29px 0px"
});

const Content = styled("div", {
  display: "flex",
  flexDirection: "column",
  justifyItems: "center",
  alignItems: "center",
});

const Login = ({ providers }) => {
  const { data: session, status } = useSession();
  console.log("login session", session);
  return (
    <>
      {Object.values(providers).map((provider) => (
        <Form key={provider.name}>
          <Head>
            <title>Sign Up</title>
          </Head>

          <Content>
            <h1>Sign up</h1>
            <Label htmlFor="mail">
              <FormattedMessage id="mail" />
            </Label>
            <Input
              type="text"
              id="mail"
              margin="login"
              //   defaultValue={inputValue}
              //   onChange={(event) => onInputValueChange(event.target.value)}
            />
            <Label htmlFor="pwd">
              <FormattedMessage id="password" />
            </Label>
            <Input
              type="text"
              id="pwd"
              margin="login"
              //   defaultValue={inputValue}
              //   onChange={(event) => onInputValueChange(event.target.value)}
              //   {...rest}
            />

            {!session && (
              <Button
                onClick={(e) => {
                  e.preventDefault()
                  signIn('credentials', { callbackUrl: '/submitform' })
                }}
              >
                Login
              </Button>
            )}
            {session && (
              <Button onClick={() => signOut(provider.id, { callbackUrl: '/foomat' })}>Sign out</Button>
            )}
          </Content>
        </Form>
      ))}
    </>
  );
};

export default Login;
