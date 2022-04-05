import { useState } from "react";
import Head from "next/head";
import { FormattedMessage } from "react-intl";
import { trpc } from "contexts/APIProvider";
import { styled } from "stitches.config";
import { hash } from "bcryptjs";

import { Button } from "components/Button";
import Text from "components/Text";
import { Input, PasswordInput } from "components/Input";
import { Label } from "components/Label";
import { useSession, signIn, signOut } from "contexts/AuthProvider";
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

const Login = ({ user }) => {
  const { error } = useRouter().query;
  const signin = trpc.useMutation(["user-signin"]);

  // const { data: session, status } = useSession();
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
          <PasswordInput
            id="pwd"
            margin="login"
            defaultValue={pwd}
            onChange={(event) => setPwd(event.target.value)}
            css={{ width: "300px" }}
          />
          {error && <ErrorInfo>Could not sign in</ErrorInfo>}
          <Button
            onClick={async (e) => {
              e.preventDefault();
              // const pwdHashed = await hash(pwd, 12);
              await signin.mutate({
                mail,
                pwd
              });
            }}
          >
            Login
          </Button>
          {/* {!session && (
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
          )} */}
          {/* {session && (
            <Button
              onClick={() => signOut("credentials", { callbackUrl: "/" })}
            >
              Sign out
            </Button>
          )} */}
          <Link href="/reset-password" passHref>
            <Text css={{ cursor: "pointer" }}>Forgot your password?</Text>
          </Link>
        </Box>
      </Form>
    </>
  );
};

export default Login;
