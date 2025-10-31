import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import styled from 'styled-components';
import { FormattedMessage } from 'react-intl';
import { Spinner } from '@radix-ui/themes';

import { useRegister } from '../../hooks/useAuth';
import { Button } from 'components/Button';
import Text from 'components/Text';
import { Input, PasswordInput } from 'components/Input';
import { Label } from 'components/Label';

// Styled Components
const RegisterContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20px;
`;

const RegisterForm = styled.form`
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

const FormTitle = styled.h1`
  margin-bottom: 30px;
  color: #333;
  text-align: center;
`;

const FormField = styled.div`
  width: 100%;
  margin-bottom: 20px;
`;

const FormRow = styled.div`
  display: flex;
  gap: 15px;
  width: 100%;
  margin-bottom: 20px;
  
  @media (max-width: 480px) {
    flex-direction: column;
    gap: 0;
  }
`;

const FormFieldHalf = styled.div`
  flex: 1;
  
  @media (max-width: 480px) {
    margin-bottom: 20px;
  }
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

const LoginLink = styled.div`
  margin-top: 20px;
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

const PasswordRequirements = styled.div`
  margin-top: 5px;
  font-size: 12px;
  color: #666;
  line-height: 1.4;
`;

// Registration Form Component
const RegisterFormComponent: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  
  const registerMutation = useRegister();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear validation errors when user starts typing
    if (validationErrors.length > 0) {
      setValidationErrors([]);
    }
  };

  const validateForm = (): boolean => {
    const errors: string[] = [];
    
    // Required field validation
    if (!formData.firstName.trim()) {
      errors.push('First name is required');
    }
    if (!formData.lastName.trim()) {
      errors.push('Last name is required');
    }
    if (!formData.email.trim()) {
      errors.push('Email is required');
    }
    if (!formData.password.trim()) {
      errors.push('Password is required');
    }
    if (!formData.confirmPassword.trim()) {
      errors.push('Password confirmation is required');
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email.trim() && !emailRegex.test(formData.email.trim())) {
      errors.push('Please enter a valid email address');
    }
    
    // Password validation
    if (formData.password.trim() && formData.password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    
    // Password confirmation validation
    if (formData.password !== formData.confirmPassword) {
      errors.push('Passwords do not match');
    }
    
    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      await registerMutation.mutateAsync({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  const allErrors = [
    ...validationErrors,
    ...(registerMutation.error?.response?.data?.message ? [registerMutation.error.response.data.message] : []),
    ...(registerMutation.error?.message && !registerMutation.error?.response ? [registerMutation.error.message] : [])
  ];

  return (
    <RegisterForm onSubmit={handleSubmit}>
      <FormTitle>Create Account</FormTitle>
      
      <InfoText>
        Join Twilight Struggle community and start playing!
      </InfoText>

      <FormRow>
        <FormFieldHalf>
          <Label htmlFor="firstName">
            <FormattedMessage id="firstName" defaultMessage="First Name" />
          </Label>
          <StyledInput
            type="text"
            id="firstName"
            value={formData.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            disabled={registerMutation.isPending}
            required
          />
        </FormFieldHalf>
        
        <FormFieldHalf>
          <Label htmlFor="lastName">
            <FormattedMessage id="lastName" defaultMessage="Last Name" />
          </Label>
          <StyledInput
            type="text"
            id="lastName"
            value={formData.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            disabled={registerMutation.isPending}
            required
          />
        </FormFieldHalf>
      </FormRow>

      <FormField>
        <Label htmlFor="email">
          <FormattedMessage id="email" defaultMessage="Email" />
        </Label>
        <StyledInput
          type="email"
          id="email"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          disabled={registerMutation.isPending}
          required
        />
      </FormField>

      <FormField>
        <Label htmlFor="password">
          <FormattedMessage id="password" defaultMessage="Password" />
        </Label>
        <StyledPasswordInput
          id="password"
          value={formData.password}
          onChange={(e) => handleInputChange('password', e.target.value)}
          disabled={registerMutation.isPending}
          required
        />
        <PasswordRequirements>
          Password must be at least 8 characters long
        </PasswordRequirements>
      </FormField>

      <FormField>
        <Label htmlFor="confirmPassword">
          <FormattedMessage id="confirmPassword" defaultMessage="Confirm Password" />
        </Label>
        <StyledPasswordInput
          id="confirmPassword"
          value={formData.confirmPassword}
          onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
          disabled={registerMutation.isPending}
          required
        />
      </FormField>

      {allErrors.length > 0 && (
        <ErrorMessage>
          {allErrors.map((error, index) => (
            <div key={index}>{error}</div>
          ))}
        </ErrorMessage>
      )}

      <Button 
        type="submit" 
        disabled={registerMutation.isPending}
        style={{ width: '100%', marginBottom: '15px' }}
      >
        {registerMutation.isPending ? <Spinner size="3" /> : <b>Create Account</b>}
      </Button>

      <LoginLink>
        Already have an account? <Link href="/login-new">Sign in here</Link>
      </LoginLink>
    </RegisterForm>
  );
};

// Main Registration Page Component
const RegisterPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>Register - Twilight Struggle</title>
      </Head>
      
      <RegisterContainer>
        <RegisterFormComponent />
      </RegisterContainer>
    </>
  );
};

export default RegisterPage;
