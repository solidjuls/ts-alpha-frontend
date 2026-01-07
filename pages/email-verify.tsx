import React, { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { Spinner } from "@radix-ui/themes";
import { Label } from "components/Label";
import { useEmailVerificationRequest } from "../hooks/useAuth";
import { 
  Page,
  Card,
  Title,
  InfoText,
  Form,
  FormField,
  StyledInput,
  PrimaryButton,
  BackLink,
  Message
 } from "styles/emailVerify.styled";

const EmailVerifyFormComponent: React.FC = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const emailVerificationMutation = useEmailVerificationRequest();

  const validate = (): boolean => {
    if (!email.trim()) {
      setMessage("Email is required");
      setIsSuccess(false);
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setMessage("Please enter a valid email address");
      setIsSuccess(false);
      return false;
    }

    setMessage("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setMessage("");

    try {
      const result = await emailVerificationMutation.mutateAsync({ email: email.trim() });

      if (result.success) {
        setMessage(result.message);
        setIsSuccess(true);
        setEmail("");
      } else {
        setMessage(result.message);
        setIsSuccess(false);
      }
    } catch (error: any) {
      console.error("Email verification request error:", error);

      if (error.response?.data?.message) setMessage(error.response.data.message);
      else if (error.message) setMessage(error.message);
      else setMessage("An error occurred. Please try again later.");

      setIsSuccess(false);
    }
  };

  return (
    <Card>
      <Title>Email Verification</Title>

      <InfoText>
        Enter your email address to receive a verification link. You must verify your email before you can
        log in to your account.
      </InfoText>

      <Form onSubmit={handleSubmit}>
        <FormField>
          <Label htmlFor="email">Email Address</Label>
          <StyledInput
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={emailVerificationMutation.isPending}
            placeholder="Enter your email address"
            required
          />
        </FormField>

        {message && <Message $variant={isSuccess ? "success" : "error"}>{message}</Message>}

        <PrimaryButton type="submit" disabled={emailVerificationMutation.isPending}>
          {emailVerificationMutation.isPending ? <Spinner size="3" /> : <b>Send Verification Email</b>}
        </PrimaryButton>
      </Form>

      <BackLink>
        <Link href="/login">Back to Login</Link>
      </BackLink>
    </Card>
  );
};


const EmailVerifyPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>Email Verification - Twilight Struggle</title>
        <meta name="description" content="Verify your email address to access your account." />
      </Head>

      <Page>
        <EmailVerifyFormComponent />
      </Page>
    </>
  );
};

export default EmailVerifyPage;
