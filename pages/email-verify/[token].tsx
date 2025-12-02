import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { GetServerSideProps } from 'next';
import styled from 'styled-components';

import { Button } from 'components/Button';
import Text from 'components/Text';

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

interface VerificationResult {
  status: 'success' | 'error' | 'invalid';
  message: string;
}

interface EmailVerifyConfirmProps {
  result: VerificationResult;
}

// Email Verification Confirmation Component
const EmailVerifyConfirmComponent: React.FC<EmailVerifyConfirmProps> = ({ result }) => {
  const renderBanner = () => {
    switch (result.status) {
      case 'success':
        return <SuccessBanner>{result.message}</SuccessBanner>;
      case 'error':
      case 'invalid':
        return <ErrorBanner>{result.message}</ErrorBanner>;
      default:
        return null;
    }
  };

  const renderActions = () => {
    return (
      <ActionButtons>
        {result.status === 'success' ? (
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

      {result.status === 'success' && (
        <InfoText>
          Welcome! Your email address has been confirmed. You can now access all features of your account.
        </InfoText>
      )}

      {(result.status === 'error' || result.status === 'invalid') && (
        <InfoText>
          If you continue to have problems, please contact support or try requesting a new verification email.
        </InfoText>
      )}

      {renderActions()}
    </VerifyCard>
  );
};

// Main Email Verification Confirmation Page Component
const EmailVerifyConfirmPage: React.FC<EmailVerifyConfirmProps> = ({ result }) => {
  return (
    <>
      <Head>
        <title>Email Verification - Twilight Struggle</title>
        <meta name="description" content="Confirming your email verification" />
      </Head>

      <VerifyContainer>
        <EmailVerifyConfirmComponent result={result} />
      </VerifyContainer>
    </>
  );
};

export default EmailVerifyConfirmPage;

// Server-side verification - runs before page renders
export const getServerSideProps: GetServerSideProps<EmailVerifyConfirmProps> = async (context) => {
  const { token } = context.params!;

  // Validate token parameter
  if (!token || typeof token !== 'string') {
    return {
      props: {
        result: {
          status: 'invalid',
          message: 'Invalid verification link. Please check your email and try again.'
        }
      }
    };
  }

  try {
    // Make API call to verify email
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4002/api';
    const response = await fetch(`${apiUrl}/auth/email-verify/confirm`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      return {
        props: {
          result: {
            status: 'success',
            message: data.message
          }
        }
      };
    } else {
      return {
        props: {
          result: {
            status: 'error',
            message: data.message || 'An error occurred while verifying your email.'
          }
        }
      };
    }
  } catch (error) {
    console.error('Email verification error:', error);
    return {
      props: {
        result: {
          status: 'error',
          message: 'An error occurred while verifying your email. Please try again.'
        }
      }
    };
  }
};
