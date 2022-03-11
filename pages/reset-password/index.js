import { useState } from "react";
import { Box, Form } from "components/Atoms";
import { trpc } from "utils/trpc";
import Text from "components/Text";
import { Input } from "components/Input";
import { Label } from "components/Label";
import { Button } from "components/Button";
import Head from "next/head";
import { styled } from "stitches.config";
import { FormattedMessage } from "react-intl";

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

const ResetPassword = () => {
  const [mail, setMail] = useState("");
  const [confirmation, setConfirmation] = useState(false);
  const mutation = trpc.useMutation(["user-reset-pwd"]);

  return (
    <Form css={formStyles}>
      <Head>
        <title>Reset Password</title>
      </Head>

      {confirmation && <Text>An email has been sent to your account</Text>}
      {!confirmation && (
        <Box
          css={{
            display: "flex",
            flexDirection: "column",
            justifyItems: "center",
            alignItems: "center",
          }}
        >
          <h1>Reset password</h1>
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
          <Button
            onClick={() => {
              if (mail) {
                mutation.mutate({
                  mail,
                });
                setConfirmation(true)
              }
              // call reset endpoint
            }}
          >
            Reset
          </Button>
        </Box>
      )}
    </Form>
  );
};

export default ResetPassword;
