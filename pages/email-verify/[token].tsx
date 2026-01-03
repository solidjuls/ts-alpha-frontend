import React from "react";
import Head from "next/head";
import Link from "next/link";
import { GetServerSideProps } from "next";
import { 
  Page,
  Card,
  Title,
  Banner,
  InfoText,
  Actions,
  ActionButton,

 } from "styles/emailVerifyToken.styled";

interface VerificationResult {
  status: "success" | "error" | "invalid";
  message: string;
}

interface EmailVerifyConfirmProps {
  result: VerificationResult;
}

const EmailVerifyConfirmComponent: React.FC<EmailVerifyConfirmProps> = ({ result }) => {
  const bannerVariant = result.status === "success" ? "success" : "error";

  return (
    <Card>
      <Title>Email Verification</Title>

      <Banner $variant={bannerVariant}>{result.message}</Banner>

      {result.status === "success" && (
        <InfoText>
          Welcome! Your email address has been confirmed. You can now access all features of your account.
        </InfoText>
      )}

      {(result.status === "error" || result.status === "invalid") && (
        <InfoText>
          If you continue to have problems, please contact support or try requesting a new verification email.
        </InfoText>
      )}

      <Actions>
        {result.status === "success" ? (
          <>
            <Link href="/login" passHref legacyBehavior>
              <ActionButton as="a">
                <b>Go to Login</b>
              </ActionButton>
            </Link>

            <Link href="/" passHref legacyBehavior>
              <ActionButton as="a">
                <b>Go to Home</b>
              </ActionButton>
            </Link>
          </>
        ) : (
          <>
            <Link href="/email-verify" passHref legacyBehavior>
              <ActionButton as="a">
                <b>Request New Link</b>
              </ActionButton>
            </Link>

            <Link href="/login" passHref legacyBehavior>
              <ActionButton as="a">
                <b>Back to Login</b>
              </ActionButton>
            </Link>
          </>
        )}
      </Actions>
    </Card>
  );
};

/* =========================
   Page
   ========================= */

const EmailVerifyConfirmPage: React.FC<EmailVerifyConfirmProps> = ({ result }) => {
  return (
    <>
      <Head>
        <title>Email Verification - Twilight Struggle</title>
        <meta name="description" content="Confirming your email verification" />
      </Head>

      <Page>
        <EmailVerifyConfirmComponent result={result} />
      </Page>
    </>
  );
};

export default EmailVerifyConfirmPage;

/* =========================
   SSR
   ========================= */

export const getServerSideProps: GetServerSideProps<EmailVerifyConfirmProps> = async (context) => {
  const { token } = context.params!;

  if (!token || typeof token !== "string") {
    return {
      props: {
        result: {
          status: "invalid",
          message: "Invalid verification link. Please check your email and try again.",
        },
      },
    };
  }

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4002/api";
    const response = await fetch(`${apiUrl}/auth/email-verify/confirm`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      return {
        props: {
          result: {
            status: "success",
            message: data.message,
          },
        },
      };
    }

    return {
      props: {
        result: {
          status: "error",
          message: data.message || "An error occurred while verifying your email.",
        },
      },
    };
  } catch (error) {
    console.error("Email verification error:", error);
    return {
      props: {
        result: {
          status: "error",
          message: "An error occurred while verifying your email. Please try again.",
        },
      },
    };
  }
};
