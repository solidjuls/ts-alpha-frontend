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

const Login = () => {
  const { error } = useRouter().query;
  const signin = trpc.useMutation(["user-signin"]);
  const signout = trpc.useMutation(["user-signout"]);
  const { email, setAuthentication } = useSession();
  const [mail, setMail] = useState<string>("");
  const [pwd, setPwd] = useState<string>("");

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
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setPwd(event.target.value)
            }
            css={{ width: "300px" }}
          />
          {error && <ErrorInfo>Could not sign in</ErrorInfo>}
          <Button
            onClick={async (e) => {
              e.preventDefault();
              try {
                const response = await signin.mutateAsync({
                  mail,
                  pwd,
                });
                if (response && setAuthentication) setAuthentication(response);
              } catch (e) {
                console.log("login error", e);
              }
            }}
          >
            Login
          </Button>
          {email && (
            <Button
              onClick={async (e) => {
                e.preventDefault();
                try {
                  const response = await signout.mutateAsync();
                  if (response && response.success && setAuthentication)
                    setAuthentication({});
                } catch (e) {
                  console.log("sign out error", e);
                }
              }}
            >
              Sign out
            </Button>
          )}
          <Link href="/reset-password" passHref>
            <Text css={{ cursor: "pointer" }}>Forgot your password?</Text>
          </Link>
        </Box>
      </Form>
    </>
  );
};

export default Login;
