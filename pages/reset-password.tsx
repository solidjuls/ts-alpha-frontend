import React, { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { Spinner } from "@radix-ui/themes";
import { Label } from "components/Label";
import { useResetPasswordRequest } from "../hooks/useAuth";
import { 
  ResetContainer,
  ResetCard,
  FormTitle,
  FormField,
  InfoText,
  Form,
  StyledInput,
  PrimaryButton,
  BackLink,
  Message
} from "styles/resetPassword.styled";

/* =========================
   Reset Password Form
   ========================= */

const ResetPasswordFormComponent: React.FC = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const resetPasswordMutation = useResetPasswordRequest();

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
      const result = await resetPasswordMutation.mutateAsync({ mail: email.trim() });

      if (result.success) {
        setMessage(result.message);
        setIsSuccess(true);
        setEmail("");
      } else {
        setMessage(result.message);
        setIsSuccess(false);
      }
    } catch (error: any) {
      console.error("Password reset request error:", error);

      if (error.response?.data?.message) setMessage(error.response.data.message);
      else if (error.message) setMessage(error.message);
      else setMessage("An error occurred. Please try again later.");

      setIsSuccess(false);
    }
  };

  return (
    <ResetCard>
      <FormTitle>Reset Password</FormTitle>

      <InfoText>Enter your email address to receive a password reset link.</InfoText>

      <Form onSubmit={handleSubmit}>
        <FormField>
          <Label htmlFor="email">Email Address</Label>
          <StyledInput
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={resetPasswordMutation.isPending}
            placeholder="Enter your email address"
            required
          />
        </FormField>

        {message && <Message $variant={isSuccess ? "success" : "error"}>{message}</Message>}

        <PrimaryButton type="submit" disabled={resetPasswordMutation.isPending}>
          {resetPasswordMutation.isPending ? <Spinner size="3" /> : <b>Send Reset Link</b>}
        </PrimaryButton>
      </Form>

      <BackLink>
        <Link href="/login">Back to Login</Link>
      </BackLink>
    </ResetCard>
  );
};

/* =========================
   Page
   ========================= */

const ResetPasswordPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>Reset Password - Twilight Struggle</title>
        <meta name="description" content="Reset your password" />
      </Head>

      <ResetContainer>
        <ResetPasswordFormComponent />
      </ResetContainer>
    </>
  );
};

export default ResetPasswordPage;
