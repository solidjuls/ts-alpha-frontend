import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { FormattedMessage } from 'react-intl';
import { Spinner } from '@radix-ui/themes';

import { useLogin, useLogout, useIsAuthenticated } from '../../hooks/useAuth';
import { Button } from 'components/Button';
import Text from 'components/Text';
import { Input, PasswordInput } from 'components/Input';
import { Label } from 'components/Label';
import { Checkbox } from 'components/Checkbox';

// Styled Components
const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20px;
`;

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: white;
  width: 100%;
  max-width: 400px;
  padding: 40px;
  border-radius: 8px;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
`;

const FormTitle = styled.h1`
  margin-bottom: 30px;
  color: #333;
  text-align: center;
`;

const FormField = styled.div`
  width: 100%;
  margin-bottom: 20px;
`;

const StyledInput = styled(Input)`
  width: 100%;
  margin-top: 5px;
`;

const StyledPasswordInput = styled(PasswordInput)`
  width: 100%;
  margin-top: 5px;
`;

const ErrorMessage = styled.div`
  color: #e74c3c;
  margin: 10px 0;
  text-align: center;
  font-size: 14px;
`;

const SuccessMessage = styled.div`
  color: #27ae60;
  margin: 10px 0;
  text-align: center;
  font-size: 14px;
`;

const InfoText = styled(Text)`
  text-align: center;
  margin-bottom: 20px;
  font-size: 14px;
  color: #666;
`;

const CheckboxContainer = styled.div`
  width: 100%;
  margin: 15px 0;
`;

const ForgotPasswordLink = styled.div`
  margin-top: 15px;
  text-align: center;
  
  a {
    color: #3498db;
    text-decoration: none;
    font-size: 14px;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const LogoutContainer = styled.div`
  text-align: center;
`;

const WelcomeText = styled.h2`
  color: #333;
  margin-bottom: 20px;
`;

// Helper functions for localStorage
const saveCredentials = (mail: string, password: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('mail', mail);
    localStorage.setItem('password', password);
  }
};

const getCredentials = (): { mail: string | null; password: string | null } => {
  if (typeof window !== 'undefined') {
    const mail = localStorage.getItem('mail');
    const password = localStorage.getItem('password');
    return { mail, password };
  }
  return { mail: null, password: null };
};

const clearCredentials = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('mail');
    localStorage.removeItem('password');
  }
};

// Login Form Component
const LoginFormComponent: React.FC = () => {
  const [mail, setMail] = useState<string>('');
  const [pwd, setPwd] = useState<string>('');
  const [saveCred, setSaveCred] = useState<boolean>(true);
  const [validationError, setValidationError] = useState<string>('');
  
  const loginMutation = useLogin();

  useEffect(() => {
    loadSavedCredentials();
  }, []);

  const loadSavedCredentials = () => {
    const credentials = getCredentials();
    if (credentials.mail && credentials.password) {
      setMail(credentials.mail);
      setPwd(credentials.password);
    }
  };

  const validate = (): boolean => {
    if (!mail.trim()) {
      setValidationError('Email is required');
      return false;
    }
    if (!pwd.trim()) {
      setValidationError('Password is required');
      return false;
    }
    setValidationError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    try {
      await loginMutation.mutateAsync({ mail: mail.trim(), pwd });
      
      if (saveCred) {
        saveCredentials(mail, pwd);
      } else {
        clearCredentials();
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleRememberMeChange = (checked: boolean) => {
    setSaveCred(checked);
    if (!checked) {
      clearCredentials();
    }
  };

  const errorMessage = validationError || loginMutation.error?.response?.data?.message || loginMutation.error?.message;

  return (
    <LoginForm onSubmit={handleSubmit}>
      <FormTitle>Login</FormTitle>
      
      <InfoText>
        <b>
          If this is your first time using the website, click the <i>Forgot your password?</i>{' '}
          link to create a new password
        </b>
      </InfoText>

      <FormField>
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
      </FormField>

      <FormField>
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
      </FormField>

      <CheckboxContainer>
        <Checkbox 
          text="Remember Me" 
          onCheckedChange={handleRememberMeChange} 
          checked={saveCred} 
        />
      </CheckboxContainer>

      {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}

      <Button 
        type="submit" 
        disabled={loginMutation.isPending}
        style={{ width: '100%', marginBottom: '15px' }}
      >
        {loginMutation.isPending ? <Spinner size="3" /> : <b>Login</b>}
      </Button>

      <ForgotPasswordLink>
        <Link href="/reset-password">
          Forgot your password?
        </Link>
      </ForgotPasswordLink>
    </LoginForm>
  );
};

// Logout Component
const LogoutComponent: React.FC<{ userName: string }> = ({ userName }) => {
  const logoutMutation = useLogout();

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <LoginForm>
      <WelcomeText>Hi {userName}!</WelcomeText>
      
      <Button 
        onClick={handleLogout}
        disabled={logoutMutation.isPending}
        style={{ width: '100%' }}
      >
        {logoutMutation.isPending ? <Spinner size="3" /> : 'Sign out'}
      </Button>
      
      {logoutMutation.error && (
        <ErrorMessage>
          {logoutMutation.error?.response?.data?.message || 'Logout failed'}
        </ErrorMessage>
      )}
    </LoginForm>
  );
};

// Main Login Page Component
const LoginPage: React.FC = () => {
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useIsAuthenticated();

  if (isLoading) {
    return (
      <LoginContainer>
        <Spinner size="3" />
      </LoginContainer>
    );
  }

  return (
    <>
      <Head>
        <title>{isAuthenticated ? 'Sign Out' : 'Login'} - Twilight Struggle</title>
      </Head>
      
      <LoginContainer>
        {isAuthenticated && user ? (
          <LogoutComponent userName={user.name} />
        ) : (
          <LoginFormComponent />
        )}
        
        {router?.query?.error && (
          <ErrorMessage>Could not sign in</ErrorMessage>
        )}
      </LoginContainer>
    </>
  );
};

export default LoginPage;
