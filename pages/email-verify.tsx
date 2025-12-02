import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import styled from 'styled-components';
import { Spinner } from '@radix-ui/themes';

import { Button } from 'components/Button';
import Text from 'components/Text';
import { Input } from 'components/Input';
import { Label } from 'components/Label';
import { useEmailVerificationRequest } from '../hooks/useAuth';

// Styled Components
const VerifyContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20px;
`;

const VerifyForm = styled.form`
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

const BackLink = styled.div`
  margin-top: 20px;
  text-align: center;
  
  a {
    color: #3b82f6;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

// Email Verification Form Component
const EmailVerifyFormComponent: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const emailVerificationMutation = useEmailVerificationRequest();

  const validate = (): boolean => {
    if (!email.trim()) {
      setMessage('Email is required');
      setIsSuccess(false);
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setMessage('Please enter a valid email address');
      setIsSuccess(false);
      return false;
    }
    
    setMessage('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setMessage('');

    try {
      const result = await emailVerificationMutation.mutateAsync({ email: email.trim() });

      if (result.success) {
        setMessage(result.message);
        setIsSuccess(true);
        setEmail(''); // Clear the form
      } else {
        setMessage(result.message);
        setIsSuccess(false);
      }
    } catch (error: any) {
      console.error('Email verification request error:', error);

      // Handle different error types
      if (error.response?.data?.message) {
        setMessage(error.response.data.message);
      } else if (error.message) {
        setMessage(error.message);
      } else {
        setMessage('An error occurred. Please try again later.');
      }
      setIsSuccess(false);
    }
  };

  return (
    <VerifyForm onSubmit={handleSubmit}>
      <FormTitle>Email Verification</FormTitle>
      
      <InfoText>
        Enter your email address to receive a verification link. 
        You must verify your email before you can log in to your account.
      </InfoText>

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

      {message && (
        isSuccess ? (
          <SuccessMessage>{message}</SuccessMessage>
        ) : (
          <ErrorMessage>{message}</ErrorMessage>
        )
      )}

      <Button
        type="submit"
        disabled={emailVerificationMutation.isPending}
        style={{ width: '100%', marginBottom: '15px' }}
      >
        {emailVerificationMutation.isPending ? <Spinner size="3" /> : <b>Send Verification Email</b>}
      </Button>

      <BackLink>
        <Link href="/login">Back to Login</Link>
      </BackLink>
    </VerifyForm>
  );
};

// Main Email Verification Page Component
const EmailVerifyPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>Email Verification - Twilight Struggle</title>
        <meta name="description" content="Verify your email address to access your account" />
      </Head>
      
      <VerifyContainer>
        <EmailVerifyFormComponent />
      </VerifyContainer>
    </>
  );
};

export default EmailVerifyPage;
