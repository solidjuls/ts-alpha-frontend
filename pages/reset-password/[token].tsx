import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { Spinner } from '@radix-ui/themes';

import { Button } from 'components/Button';
import { Label } from 'components/Label';
import { PasswordInput } from 'components/Input';
import { useResetPasswordConfirm } from '../../hooks/useAuth';
import {
  ResetContainer,
  ResetCard,
  FormTitle,
  FormField,
  ErrorMessage,
  SuccessBanner,
  InfoText,
  PasswordRequirements,
  BackLink,
} from '../reset-password';

const StyledPasswordInput = styled(PasswordInput)`
  width: 100%;
  margin-top: 5px;
`;

const ResetPasswordConfirmPage: React.FC = () => {
  const router = useRouter();
  const { token } = router.query;

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const resetPasswordMutation = useResetPasswordConfirm();

  const validate = (): boolean => {
    if (!newPassword) {
      setMessage('New password is required');
      return false;
    }

    if (newPassword.length < 8) {
      setMessage('Password must be at least 8 characters long');
      return false;
    }

    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match');
      return false;
    }

    setMessage('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;
    if (!token || typeof token !== 'string') {
      setMessage('Invalid reset link');
      return;
    }

    try {
      const result = await resetPasswordMutation.mutateAsync({
        token,
        newPassword,
        confirmPassword,
      });

      if (result.success) {
        setIsSuccess(true);
        setMessage(result.message);
        router.push('/login');
      } else {
        setMessage(result.message);
      }
    } catch (error: any) {
      console.error('Password reset error:', error);
      if (error.response?.data?.message) {
        setMessage(error.response.data.message);
      } else {
        setMessage('An error occurred. Please try again.');
      }
    }
  };

  if (isSuccess) {
    return (
      <>
        <Head>
          <title>Password Reset - Twilight Struggle</title>
          <meta name="description" content="Reset your password" />
        </Head>
        <ResetContainer>
          <ResetCard>
            <FormTitle>Password Reset</FormTitle>
            <SuccessBanner>{message || 'Your password has been reset successfully!'}</SuccessBanner>
            <InfoText>
              You can now log in with your new password.
            </InfoText>
            <Link href="/login">
              <Button style={{ backgroundColor: '#16a34a' }}>
                <b>Go to Login</b>
              </Button>
            </Link>
          </ResetCard>
        </ResetContainer>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Reset Password - Twilight Struggle</title>
        <meta name="description" content="Set your new password" />
      </Head>

      <ResetContainer>
        <ResetCard>
          <FormTitle>Set New Password</FormTitle>

          <InfoText>
            Enter your new password below.
          </InfoText>

          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <FormField>
              <Label htmlFor="newPassword">New Password</Label>
              <StyledPasswordInput
                id="newPassword"
                value={newPassword}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value)}
                disabled={resetPasswordMutation.isPending}
                required
              />
              <PasswordRequirements>
                Password must be at least 8 characters long
              </PasswordRequirements>
            </FormField>

            <FormField>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <StyledPasswordInput
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                disabled={resetPasswordMutation.isPending}
                required
              />
            </FormField>

            {message && <ErrorMessage>{message}</ErrorMessage>}

            <Button
              type="submit"
              disabled={resetPasswordMutation.isPending}
              style={{ width: '100%', marginBottom: '15px' }}
            >
              {resetPasswordMutation.isPending ? <Spinner size="3" /> : <b>Reset Password</b>}
            </Button>
          </form>

          <BackLink>
            <Link href="/login">Back to Login</Link>
          </BackLink>
        </ResetCard>
      </ResetContainer>
    </>
  );
};

export default ResetPasswordConfirmPage;
