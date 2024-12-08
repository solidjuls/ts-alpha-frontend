import React, { useState } from "react";
import { Box, Form } from "components/Atoms";
import Text from "components/Text";
import { Input } from "components/Input";
import { Label } from "components/Label";
import { Button } from "components/Button";
import Head from "next/head";
import { styled } from "stitches.config";
import getAxiosInstance from "utils/axios";

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

const Headline = styled("strong", {
  marginBottom: "30px",
});
const ResetPassword = () => {
  const [mail, setMail] = useState<string>("");
  const [confirmation, setConfirmation] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  return (
    <Form css={formStyles}>
      <Head>
        <title>Reset Password</title>
      </Head>
      {confirmation && <Text>An email has been sent to your account</Text>}
      {!confirmation && (
        <>
          <Headline>Add your mail and we will send you a link to reset your password</Headline>
          <Box css={{ display: "flex", flexDirection: "row" }}>
            <Label htmlFor="mail">Mail</Label>
            <Input
              id="mail"
              margin="login"
              defaultValue={mail}
              onChange={(event) => setMail(event.target.value)}
              css={{ width: "300px" }}
            />
          </Box>
          <Button
            onClick={async (e) => {
              e.preventDefault();
              try {
                if (mail) {
                  // @ts-ignore
                  const response = await getAxiosInstance()
                    .post(`/api/user/reset-password/`, {
                      mail,
                    })
  
                  if (response.data.success) {
                    setConfirmation(true)
                  } else {
                    setErrorMsg("This email does not exist. Contact Junta")
                  }
                }
              } catch(e) {
                setErrorMsg("Unexpected error. Contact Junta")
              }
              
            }}
          >
            Reset
          </Button>
          {errorMsg && <Text type="error">{errorMsg}</Text>}
        </>
      )}
    </Form>
  );
};

export default ResetPassword;
