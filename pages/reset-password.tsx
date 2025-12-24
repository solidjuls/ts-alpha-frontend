import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import styled from 'styled-components';
import { Spinner } from '@radix-ui/themes';

import { Button } from 'components/Button';
import Text from 'components/Text';
import { Input } from 'components/Input';
import { Label } from 'components/Label';
import { useResetPasswordRequest } from '../hooks/useAuth';

// Styled Components - exported for reuse
export const ResetContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20px;
`;

export const ResetCard = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: white;
  width: 100%;
  max-width: 450px;
  padding: 40px;
  border-radius: 8px;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
`;

export const FormTitle = styled.h1`
  margin-bottom: 30px;
  color: #333;
  text-align: center;
`;

export const FormField = styled.div`
  width: 100%;
  margin-bottom: 20px;
`;

const StyledInput = styled(Input)`
  width: 100%;
  margin-top: 5px;
`;

export const ErrorMessage = styled.div`
  color: #e74c3c;
  margin: 10px 0;
  text-align: center;
  font-size: 14px;
`;

export const SuccessMessage = styled.div`
  color: #27ae60;
  margin: 10px 0;
  text-align: center;
  font-size: 14px;
`;

export const SuccessBanner = styled.div`
  background-color: #d4edda;
  border: 1px solid #c3e6cb;
  color: #155724;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  text-align: center;
  width: 100%;
`;

export const InfoText = styled(Text)`
  text-align: center;
  margin-bottom: 20px;
  font-size: 14px;
  color: #666;
`;

export const PasswordRequirements = styled.div`
  font-size: 12px;
  color: #666;
  margin-top: 5px;
`;

export const BackLink = styled.div`
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

// Reset Password Form Component
const ResetPasswordFormComponent: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const resetPasswordMutation = useResetPasswordRequest();

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
      const result = await resetPasswordMutation.mutateAsync({ mail: email.trim() });

      if (result.success) {
        setMessage(result.message);
        setIsSuccess(true);
        setEmail('');
      } else {
        setMessage(result.message);
        setIsSuccess(false);
      }
    } catch (error: any) {
      console.error('Password reset request error:', error);

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
    <ResetCard>
      <FormTitle>Reset Password</FormTitle>

      <InfoText>
        Enter your email address to receive a password reset link.
      </InfoText>

      <form onSubmit={handleSubmit} style={{ width: '100%' }}>
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

        {message && (
          isSuccess ? (
            <SuccessMessage>{message}</SuccessMessage>
          ) : (
            <ErrorMessage>{message}</ErrorMessage>
          )
        )}

        <Button
          type="submit"
          disabled={resetPasswordMutation.isPending}
          style={{ width: '100%', marginBottom: '15px' }}
        >
          {resetPasswordMutation.isPending ? <Spinner size="3" /> : <b>Send Reset Link</b>}
        </Button>
      </form>

      <BackLink>
        <Link href="/login">Back to Login</Link>
      </BackLink>
    </ResetCard>
  );
};

// Main Reset Password Page Component
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
