import React, { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import styled from "styled-components";
import { FormattedMessage } from "react-intl";
import { Spinner } from "@radix-ui/themes";
import { useLogin, useLogout, useIsAuthenticated } from "../../hooks/useAuth";
import { Label } from "components/Label";
import { Checkbox } from "components/Checkbox";
import { 
  Page,
  Card,
  Title,
  SubText,
  Form,
  Field,
  StyledInput,
  StyledPasswordInput,
  CheckboxRow,
  PrimaryButton,
  Links,
  Message,
  RouterError
 } from "styles/login.styled";


/* =========================
   localStorage helpers
   ========================= */

const saveCredentials = (mail: string, password: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("mail", mail);
    localStorage.setItem("password", password);
  }
};

const getCredentials = (): { mail: string | null; password: string | null } => {
  if (typeof window !== "undefined") {
    return {
      mail: localStorage.getItem("mail"),
      password: localStorage.getItem("password"),
    };
  }
  return { mail: null, password: null };
};

const clearCredentials = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("mail");
    localStorage.removeItem("password");
  }
};

/* =========================
   Login form
   ========================= */

const LoginFormComponent: React.FC = () => {
  const [mail, setMail] = useState<string>("");
  const [pwd, setPwd] = useState<string>("");
  const [saveCred, setSaveCred] = useState<boolean>(true);
  const [validationError, setValidationError] = useState<string>("");

  const loginMutation = useLogin();

  useEffect(() => {
    const credentials = getCredentials();
    if (credentials.mail && credentials.password) {
      setMail(credentials.mail);
      setPwd(credentials.password);
    }
  }, []);

  const validate = (): boolean => {
    if (!mail.trim()) {
      setValidationError("Email is required");
      return false;
    }
    if (!pwd.trim()) {
      setValidationError("Password is required");
      return false;
    }
    setValidationError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await loginMutation.mutateAsync({ mail: mail.trim(), pwd });

      if (saveCred) saveCredentials(mail, pwd);
      else clearCredentials();
    } catch (error) {
      // keep existing behavior; message shown below from mutation error
      console.error("Login error:", error);
    }
  };

  const handleRememberMeChange = (checked: boolean) => {
    setSaveCred(checked);
    if (!checked) clearCredentials();
  };

  const errorMessage =
    validationError ||
    loginMutation.error?.response?.data?.message ||
    loginMutation.error?.message;

  const isEmailNotVerified =
    loginMutation.error?.response?.data?.code === "EMAIL_NOT_VERIFIED";

  return (
    <Card>
      <Title>Login</Title>

      <SubText>
        <b>
          If this is your first time using the website, click the{" "}
          <Link href="/reset-password">Forgot Password</Link> link to create a new password.
        </b>
      </SubText>

      <Form onSubmit={handleSubmit}>
        <Field>
          <Label htmlFor="mail">
            <FormattedMessage id="mail" defaultMessage="Email" />
          </Label>
          <StyledInput
            type="email"
            id="mail"
            value={mail}
            onChange={(e) => setMail(e.target.value)}
            disabled={loginMutation.isPending}
            required
          />
        </Field>

        <Field>
          <Label htmlFor="pwd">
            <FormattedMessage id="password" defaultMessage="Password" />
          </Label>
          <StyledPasswordInput
            id="pwd"
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            disabled={loginMutation.isPending}
            required
          />
        </Field>

        <CheckboxRow>
          <Checkbox
            text="Remember Me"
            onCheckedChange={handleRememberMeChange}
            checked={saveCred}
          />
        </CheckboxRow>

        {errorMessage && (
          <Message $variant="error">
            {errorMessage}
            {isEmailNotVerified && (
              <div style={{ marginTop: 8 }}>
                <Link href="/email-verify">Click here to verify your email</Link>
              </div>
            )}
          </Message>
        )}

        <PrimaryButton type="submit" disabled={loginMutation.isPending}>
          {loginMutation.isPending ? <Spinner size="3" /> : "Login"}
        </PrimaryButton>

        <Links>
          <Link href="/reset-password">Forgot your password?</Link>
          <Link href="/email-verify">Need to verify your email?</Link>
          <Link href="/register" passHref>
          <PrimaryButton>
            Create Account
          </PrimaryButton>
          </Link>
        </Links>
      </Form>
    </Card>
  );
};

/* =========================
   Logout card
   ========================= */

const WelcomeText = styled.h2`
  margin: 0 0 16px;
  text-align: center;

  font-size: 18px;
  font-weight: 700;
  color: var(--primary-text);
`;

const LogoutComponent: React.FC<{ userName: string }> = ({ userName }) => {
  const logoutMutation = useLogout();

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <Card>
      <WelcomeText>Hi {userName}!</WelcomeText>

      <PrimaryButton onClick={handleLogout} disabled={logoutMutation.isPending}>
        {logoutMutation.isPending ? <Spinner size="3" /> : "Sign out"}
      </PrimaryButton>

      {logoutMutation.error && (
        <Message $variant="error">
          {logoutMutation.error?.response?.data?.message || "Logout failed"}
        </Message>
      )}
    </Card>
  );
};

/* =========================
   Page
   ========================= */

const LoginPage: React.FC = () => {
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useIsAuthenticated();

  return (
    <>
      <Head>
        <title>{isAuthenticated ? "Sign Out" : "Login"} - Twilight Struggle</title>
      </Head>

      <Page>
        {isLoading ? (
          <Spinner size="3" />
        ) : isAuthenticated && user ? (
          <LogoutComponent userName={user.name} />
        ) : (
          <LoginFormComponent />
        )}

        {router?.query?.error && (
          <RouterError>
            <Message $variant="error">Could not sign in</Message>
          </RouterError>
        )}
      </Page>
    </>
  );
};

export default LoginPage;
