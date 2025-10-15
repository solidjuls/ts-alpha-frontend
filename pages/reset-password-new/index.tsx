import React, { useState } from 'react';
import Head from 'next/head';
import styled from 'styled-components';
import { Spinner } from '@radix-ui/themes';

import { useResetPasswordRequest } from '../../hooks/useAuth';
import { Button } from 'components/Button';
import Text from 'components/Text';
import { Input } from 'components/Input';
import { Label } from 'components/Label';

// Styled Components
const ResetContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20px;
`;

const ResetForm = styled.form`
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

const InfoText = styled.div`
  text-align: center;
  margin-bottom: 30px;
  font-size: 16px;
  color: #666;
  line-height: 1.5;
`;

const SuccessContainer = styled.div`
  text-align: center;
`;

const SuccessIcon = styled.div`
  font-size: 48px;
  color: #27ae60;
  margin-bottom: 20px;
`;

// Reset Password Form Component
const ResetPasswordFormComponent: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [validationError, setValidationError] = useState<string>('');
  
  const resetMutation = useResetPasswordRequest();

  const validate = (): boolean => {
    if (!email.trim()) {
      setValidationError('Email is required');
      return false;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
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
      await resetMutation.mutateAsync({ mail: email.trim() });
    } catch (error) {
      console.error('Reset password error:', error);
    }
  };

  const errorMessage = validationError || 
    resetMutation.error?.response?.data?.message || 
    resetMutation.error?.message;

  // Show success state
  if (resetMutation.isSuccess) {
    return (
      <ResetForm>
        <SuccessIcon>✓</SuccessIcon>
        <FormTitle>Email Sent!</FormTitle>
        <SuccessMessage>
          An email has been sent to your account with instructions to reset your password.
        </SuccessMessage>
        <InfoText>
          Please check your email and follow the instructions to create a new password.
          If you don't see the email, please check your spam folder.
        </InfoText>
      </ResetForm>
    );
  }

  return (
    <ResetForm onSubmit={handleSubmit}>
      <FormTitle>Reset Password</FormTitle>
      
      <InfoText>
        Enter your email address and we will send you a link to reset your password.
      </InfoText>

      <FormField>
        <Label htmlFor="email">Email Address</Label>
        <StyledInput
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={resetMutation.isPending}
          placeholder="Enter your email address"
          required
        />
      </FormField>

      {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}

      <Button 
        type="submit" 
        disabled={resetMutation.isPending || !email.trim()}
        style={{ width: '100%' }}
      >
        {resetMutation.isPending ? <Spinner size="3" /> : 'Send Reset Link'}
      </Button>
    </ResetForm>
  );
};

// Main Reset Password Page Component
const ResetPasswordPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>Reset Password - Twilight Struggle</title>
      </Head>
      
      <ResetContainer>
        <ResetPasswordFormComponent />
      </ResetContainer>
    </>
  );
};

export default ResetPasswordPage;
