import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { FormattedMessage } from 'react-intl';
import { Spinner } from '@radix-ui/themes';

import { useImpersonate, useIsAuthenticated } from '../../hooks/useAuth';
import { Button } from 'components/Button';
import Text from 'components/Text';
import { Input } from 'components/Input';
import { Label } from 'components/Label';

// Styled Components (reusing from login page)
const ImpersonateContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20px;
`;

const ImpersonateForm = styled.form`
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

const ErrorMessage = styled.div`
  color: #e74c3c;
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

const BackLink = styled.div`
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

const AccessDeniedMessage = styled.div`
  background-color: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
  text-align: center;
  max-width: 400px;
  
  h2 {
    color: #e74c3c;
    margin-bottom: 20px;
  }
  
  p {
    color: #666;
    margin-bottom: 20px;
  }
`;

// Impersonate Form Component
const ImpersonateFormComponent: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [validationError, setValidationError] = useState<string>('');
  
  const impersonateMutation = useImpersonate();

  const validate = (): boolean => {
    if (!email.trim()) {
      setValidationError('Email is required');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setValidationError('Please enter a valid email address');
      return false;
    }
    setValidationError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    try {
      await impersonateMutation.mutateAsync({ email: email.trim() });
    } catch (error) {
      console.error('Impersonate error:', error);
    }
  };

  const errorMessage = impersonateMutation.error?.response?.data?.message || 
                      impersonateMutation.error?.message || 
                      validationError;

  return (
    <ImpersonateForm onSubmit={handleSubmit}>
      <FormTitle>Impersonate User</FormTitle>
      
      <InfoText>
        <b>
          Enter the email address of the user you want to impersonate. 
          This will log you in as that user without requiring their password.
        </b>
      </InfoText>

      <FormField>
        <Label htmlFor="email">
          <FormattedMessage id="mail" defaultMessage="Email" />
        </Label>
        <StyledInput
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={impersonateMutation.isPending}
          required
          placeholder="user@example.com"
        />
      </FormField>

      {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}

      <Button 
        type="submit" 
        disabled={impersonateMutation.isPending}
        style={{ width: '100%', marginBottom: '15px' }}
      >
        {impersonateMutation.isPending ? <Spinner size="3" /> : <b>Impersonate User</b>}
      </Button>

      <BackLink>
        <Link href="/">
          Back to Home
        </Link>
      </BackLink>
    </ImpersonateForm>
  );
};

// Access Denied Component
const AccessDeniedComponent: React.FC = () => {
  return (
    <AccessDeniedMessage>
      <h2>Access Denied</h2>
      <p>
        Only superadmins can access the impersonate functionality.
      </p>
      <BackLink>
        <Link href="/">
          Back to Home
        </Link>
      </BackLink>
    </AccessDeniedMessage>
  );
};

// Main Impersonate Page Component
const ImpersonatePage: React.FC = () => {
  const { isAuthenticated, isLoading, user } = useIsAuthenticated();

  if (isLoading) {
    return (
      <ImpersonateContainer>
        <Spinner size="3" />
      </ImpersonateContainer>
    );
  }

  // Check if user is authenticated and is superadmin (role 1)
  const isSuperAdmin = isAuthenticated && user && user.role === 1;

  return (
    <>
      <Head>
        <title>Impersonate User - Twilight Struggle</title>
      </Head>

      <ImpersonateContainer>
        {isSuperAdmin ? (
          <ImpersonateFormComponent />
        ) : (
          <AccessDeniedComponent />
        )}
      </ImpersonateContainer>
    </>
  );
};

export default ImpersonatePage;
