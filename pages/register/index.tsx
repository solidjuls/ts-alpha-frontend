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
import { DropdownWithLabel } from 'components/EditFormComponents';
import CountrySearchTypeahead from 'components/Register/CountrySearchTypeahead';
import CitySearchTypeahead from 'components/Register/CitySearchTypeahead';
import { platforms, gameDurations } from 'utils/constants';
import { DropdownItemType } from 'types/types';

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
    playdek_name: '',
    countryId: '',
    cityId: '',
    phoneNumber: '',
    preferredGamingPlatform: '',
    preferredGameDuration: '',
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
    if (!formData.playdek_name.trim()) {
      errors.push('Playdek name is required');
    }

    // New mandatory fields
    if (!formData.countryId.trim()) {
      errors.push('Country is required');
    }

    if (!formData.cityId.trim()) {
      errors.push('City is required');
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
        playdek_name: formData.playdek_name.trim(),
        countryId: formData.countryId.trim() || undefined,
        cityId: formData.cityId.trim() || undefined,
        phoneNumber: formData.phoneNumber.trim() || undefined,
        preferredGamingPlatform: formData.preferredGamingPlatform.trim() || undefined,
        preferredGameDuration: formData.preferredGameDuration.trim() || undefined,
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
          id="mail"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          disabled={registerMutation.isPending}
          required
        />
      </FormField>

      <FormField>
        <Label htmlFor="playdek_name">
          <FormattedMessage id="playdeckName" defaultMessage="Playdek Name" />
        </Label>
        <StyledInput
          type="text"
          id="playdek_name"
          value={formData.playdek_name}
          onChange={(e) => handleInputChange('playdek_name', e.target.value)}
          disabled={registerMutation.isPending}
          placeholder="Enter your Playdek username"
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
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('password', e.target.value)}
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
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('confirmPassword', e.target.value)}
          disabled={registerMutation.isPending}
          required
        />
      </FormField>

      {/* Country Selection - Mandatory */}
      <FormField>
        <Label>
          <FormattedMessage id="country" defaultMessage="Country" /> *
        </Label>
        <CountrySearchTypeahead
          placeholder="Type at least 3 characters to search countries..."
          css={{ width: '100%' }}
          onBlur={() => {}}
          onSelect={(value: DropdownItemType | null | undefined) => {
            handleInputChange('countryId', value?.value || '');
          }}
          error={validationErrors.some(error => error.includes('Country'))}
          selectedItem={formData.countryId}
        />
      </FormField>

      {/* City Selection - Mandatory */}
      <FormField>
        <Label>
          <FormattedMessage id="city" defaultMessage="City" /> *
        </Label>
        <CitySearchTypeahead
          placeholder="Type at least 3 characters to search cities..."
          css={{ width: '100%' }}
          onBlur={() => {}}
          onSelect={(value: DropdownItemType | null | undefined) => {
            handleInputChange('cityId', value?.value || '');
          }}
          error={validationErrors.some(error => error.includes('City'))}
          selectedItem={formData.cityId}
        />
      </FormField>

      {/* Phone Number - Optional */}
      <FormField>
        <Label htmlFor="phone">
          <FormattedMessage id="phone" defaultMessage="Phone Number" />
        </Label>
        <StyledInput
          type="tel"
          id="phone"
          value={formData.phoneNumber}
          onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
          disabled={registerMutation.isPending}
          placeholder="Enter your phone number (optional)"
        />
      </FormField>

      {/* Preferred Gaming Platform - Optional */}
      <FormField>
        <DropdownWithLabel
          labelText="preferredGamingPlatform"
          items={platforms}
          error={false}
          css={{ width: '100%' }}
          selectedItem={formData.preferredGamingPlatform}
          placeholder="Select preferred gaming platform (optional)"
          onSelect={(value: string) => handleInputChange('preferredGamingPlatform', value)}
        />
      </FormField>

      {/* Preferred Game Duration - Optional */}
      <FormField>
        <DropdownWithLabel
          labelText="preferredGameDuration"
          items={gameDurations}
          error={false}
          css={{ width: '100%' }}
          selectedItem={formData.preferredGameDuration}
          placeholder="Select preferred game duration (optional)"
          onSelect={(value: string) => handleInputChange('preferredGameDuration', value)}
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
        Already have an account? <Link href="/login">Sign in here</Link>
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
