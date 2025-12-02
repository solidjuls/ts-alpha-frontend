import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { Spinner } from '@radix-ui/themes';

import { Button } from 'components/Button';
import Text from 'components/Text';
import { useEmailVerificationConfirm } from '../../hooks/useAuth';

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

const VerifyCard = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: white;
  width: 100%;
  max-width: 500px;
  padding: 40px;
  border-radius: 8px;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
`;

const Title = styled.h1`
  margin-bottom: 20px;
  color: #333;
  text-align: center;
`;

const SuccessBanner = styled.div`
  background-color: #d4edda;
  border: 1px solid #c3e6cb;
  color: #155724;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  text-align: center;
  width: 100%;
`;

const ErrorBanner = styled.div`
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  color: #721c24;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  text-align: center;
  width: 100%;
`;

const LoadingBanner = styled.div`
  background-color: #d1ecf1;
  border: 1px solid #bee5eb;
  color: #0c5460;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  text-align: center;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;

const InfoText = styled(Text)`
  text-align: center;
  margin-bottom: 20px;
  font-size: 16px;
  color: #666;
  line-height: 1.5;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 20px;
  
  @media (max-width: 480px) {
    flex-direction: column;
    width: 100%;
  }
`;

const StyledButton = styled(Button)`
  padding: 12px 24px;
  
  @media (max-width: 480px) {
    width: 100%;
  }
`;

interface VerificationState {
  status: 'loading' | 'success' | 'error' | 'invalid';
  message: string;
}

// Email Verification Confirmation Component
const EmailVerifyConfirmComponent: React.FC = () => {
  const router = useRouter();
  const { token } = router.query;
  const [verificationState, setVerificationState] = useState<VerificationState>({
    status: 'loading',
    message: 'Verifying your email address...'
  });

  const emailVerificationConfirmMutation = useEmailVerificationConfirm();

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token || typeof token !== 'string') {
        setVerificationState({
          status: 'invalid',
          message: 'Invalid verification link. Please check your email and try again.'
        });
        return;
      }

      try {
        const result = await emailVerificationConfirmMutation.mutateAsync({ token });

        if (result.success) {
          setVerificationState({
            status: 'success',
            message: result.message
          });
        } else {
          setVerificationState({
            status: 'error',
            message: result.message
          });
        }
      } catch (error: any) {
        console.error('Email verification error:', error);

        // Handle different error types
        let errorMessage = 'An error occurred while verifying your email. Please try again later.';

        if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.message) {
          errorMessage = error.message;
        }

        setVerificationState({
          status: 'error',
          message: errorMessage
        });
      }
    };

    // Only verify when we have the token and router is ready
    if (router.isReady) {
      verifyEmail();
    }
  }, [token, router.isReady, emailVerificationConfirmMutation]);

  const renderBanner = () => {
    switch (verificationState.status) {
      case 'loading':
        return (
          <LoadingBanner>
            <Spinner size="3" />
            {verificationState.message}
          </LoadingBanner>
        );
      case 'success':
        return <SuccessBanner>{verificationState.message}</SuccessBanner>;
      case 'error':
      case 'invalid':
        return <ErrorBanner>{verificationState.message}</ErrorBanner>;
      default:
        return null;
    }
  };

  const renderActions = () => {
    if (verificationState.status === 'loading') {
      return null;
    }

    return (
      <ActionButtons>
        {verificationState.status === 'success' ? (
          <>
            <Link href="/login">
              <StyledButton style={{ backgroundColor: '#16a34a' }}>
                <b>Go to Login</b>
              </StyledButton>
            </Link>
            <Link href="/">
              <StyledButton>
                <b>Go to Home</b>
              </StyledButton>
            </Link>
          </>
        ) : (
          <>
            <Link href="/email-verify">
              <StyledButton style={{ backgroundColor: '#3b82f6' }}>
                <b>Request New Link</b>
              </StyledButton>
            </Link>
            <Link href="/login">
              <StyledButton>
                <b>Back to Login</b>
              </StyledButton>
            </Link>
          </>
        )}
      </ActionButtons>
    );
  };

  return (
    <VerifyCard>
      <Title>Email Verification</Title>
      
      {renderBanner()}
      
      {verificationState.status === 'success' && (
        <InfoText>
          Welcome! Your email address has been confirmed. You can now access all features of your account.
        </InfoText>
      )}
      
      {(verificationState.status === 'error' || verificationState.status === 'invalid') && (
        <InfoText>
          If you continue to have problems, please contact support or try requesting a new verification email.
        </InfoText>
      )}
      
      {renderActions()}
    </VerifyCard>
  );
};

// Main Email Verification Confirmation Page Component
const EmailVerifyConfirmPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>Email Verification - Twilight Struggle</title>
        <meta name="description" content="Confirming your email verification" />
      </Head>
      
      <VerifyContainer>
        <EmailVerifyConfirmComponent />
      </VerifyContainer>
    </>
  );
};

export default EmailVerifyConfirmPage;
