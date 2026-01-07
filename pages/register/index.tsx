import React, { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { FormattedMessage } from "react-intl";
import { Spinner } from "@radix-ui/themes";
import { useRegister } from "../../hooks/useAuth";
import { Label } from "components/Label";
import { DropdownWithLabel } from "components/EditFormComponents";
import CountrySearchTypeahead from "components/Register/CountrySearchTypeahead";
import CitySearchTypeahead from "components/Register/CitySearchTypeahead";
import { platforms, gameDurations } from "utils/constants";
import { DropdownItemType } from "types/types";
import { 
  PageShell,
  Card,
  Header,
  Title,
  Subtitle,
  Form,
  Row,
  Field,
  StyledInput,
  StyledPasswordInput,
  HelpText,
  SubmitButton,
  FooterRow,
  InlineLink,
  Alert,
  AlertList,
  AlertTitle
 } from "styles/register.styled";


/* -----------------------
   Component
------------------------ */

const RegisterFormComponent: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    playdek_name: "",
    countryId: "",
    cityId: "",
    phoneNumber: "",
    preferredGamingPlatform: "",
    preferredGameDuration: "",
  });

  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const registerMutation = useRegister();

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (validationErrors.length > 0) setValidationErrors([]);
  };

  const validateForm = (): boolean => {
    const errors: string[] = [];

    if (!formData.firstName.trim()) errors.push("First name is required");
    if (!formData.lastName.trim()) errors.push("Last name is required");
    if (!formData.email.trim()) errors.push("Email is required");
    if (!formData.password.trim()) errors.push("Password is required");
    if (!formData.confirmPassword.trim()) errors.push("Password confirmation is required");
    if (!formData.playdek_name.trim()) errors.push("Playdek name is required");

    if (!formData.countryId.trim()) errors.push("Country is required");
    if (!formData.cityId.trim()) errors.push("City is required");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email.trim() && !emailRegex.test(formData.email.trim())) {
      errors.push("Please enter a valid email address");
    }

    if (formData.password.trim() && formData.password.length < 8) {
      errors.push("Password must be at least 8 characters long");
    }

    if (formData.password !== formData.confirmPassword) {
      errors.push("Passwords do not match");
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
      console.error("Registration error:", error);
    }
  };

  const allErrors = [
    ...validationErrors,
    ...(registerMutation.error?.response?.data?.message
      ? [registerMutation.error.response.data.message]
      : []),
    ...(registerMutation.error?.message && !registerMutation.error?.response
      ? [registerMutation.error.message]
      : []),
  ];

  return (
    <Card>
      <Header>
        <Title>Create Account</Title>
        <Subtitle>
          Join the Twilight Struggle community and start playing competitive Twilight Struggle!
        </Subtitle>
      </Header>

      <Form onSubmit={handleSubmit}>
        <Row>
          <Field>
            <Label htmlFor="firstName">
              <FormattedMessage id="firstName" defaultMessage="First Name" />
            </Label>
            <StyledInput
              type="text"
              id="firstName"
              value={formData.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              disabled={registerMutation.isPending}
              required
            />
          </Field>

          <Field>
            <Label htmlFor="lastName">
              <FormattedMessage id="lastName" defaultMessage="Last Name" />
            </Label>
            <StyledInput
              type="text"
              id="lastName"
              value={formData.lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              disabled={registerMutation.isPending}
              required
            />
          </Field>
        </Row>

        <Field>
          <Label htmlFor="email">
            <FormattedMessage id="email" defaultMessage="Email" />
          </Label>
          <StyledInput
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            disabled={registerMutation.isPending}
            required
          />
        </Field>

        <Field>
          <Label htmlFor="playdek_name">
            <FormattedMessage id="playdeckName" defaultMessage="Playdek Name" />
          </Label>
          <StyledInput
            type="text"
            id="playdek_name"
            value={formData.playdek_name}
            onChange={(e) => handleInputChange("playdek_name", e.target.value)}
            disabled={registerMutation.isPending}
            placeholder="Playdek Username..."
            required
          />
        </Field>

        <Field>
          <Label htmlFor="password">
            <FormattedMessage id="password" defaultMessage="Password" />
          </Label>
          <StyledPasswordInput
            id="password"
            value={formData.password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleInputChange("password", e.target.value)
            }
            disabled={registerMutation.isPending}
            required
          />
          <HelpText>Password must be at least 8 characters long.</HelpText>
        </Field>

        <Field>
          <Label htmlFor="confirmPassword">
            <FormattedMessage id="confirmPassword" defaultMessage="Confirm Password" />
          </Label>
          <StyledPasswordInput
            id="confirmPassword"
            value={formData.confirmPassword}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleInputChange("confirmPassword", e.target.value)
            }
            disabled={registerMutation.isPending}
            required
          />
        </Field>

        <Field>
          <Label>
            <FormattedMessage id="country" defaultMessage="Country" /> *
          </Label>
          <CountrySearchTypeahead
            placeholder="Search Countries..."
            css={{ width: "100%" }}
            onBlur={() => {}}
            onSelect={(value: DropdownItemType | null | undefined) => {
              handleInputChange("countryId", value?.value || "");
            }}
            error={validationErrors.some((error) => error.includes("Country"))}
            selectedItem={formData.countryId}
          />
        </Field>

        <Field>
          <Label>
            <FormattedMessage id="city" defaultMessage="City" /> *
          </Label>
          <CitySearchTypeahead
            placeholder="Search Cities..."
            css={{ width: "100%" }}
            onBlur={() => {}}
            onSelect={(value: DropdownItemType | null | undefined) => {
              handleInputChange("cityId", value?.value || "");
            }}
            error={validationErrors.some((error) => error.includes("City"))}
            selectedItem={formData.cityId}
          />
        </Field>

        <Field>
          <Label htmlFor="phone">
            <FormattedMessage id="phone" defaultMessage="Phone Number" />
          </Label>
          <StyledInput
            type="tel"
            id="phone"
            value={formData.phoneNumber}
            onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
            disabled={registerMutation.isPending}
            placeholder="Phone Number (Optional)"
          />
        </Field>

        <Field>
          <DropdownWithLabel
            labelText="preferredGamingPlatform"
            items={platforms}
            error={false}
            css={{ width: "100%" }}
            selectedItem={formData.preferredGamingPlatform}
            placeholder="Select preferred gaming platform (optional)"
            onSelect={(value: string) => handleInputChange("preferredGamingPlatform", value)}
          />
        </Field>

        <Field>
          <DropdownWithLabel
            labelText="preferredGameDuration"
            items={gameDurations}
            error={false}
            css={{ width: "100%" }}
            selectedItem={formData.preferredGameDuration}
            placeholder="Select preferred game duration (optional)"
            onSelect={(value: string) => handleInputChange("preferredGameDuration", value)}
          />
        </Field>

        {allErrors.length > 0 && (
          <Alert role="alert" aria-live="polite">
            <AlertTitle>Please fix the following:</AlertTitle>
            <AlertList>
              {allErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </AlertList>
          </Alert>
        )}

        <SubmitButton type="submit" disabled={registerMutation.isPending}>
          {registerMutation.isPending ? <Spinner size="3" /> : <b>Create Account</b>}
        </SubmitButton>

        <FooterRow>
          Already have an account?{" "}
          <Link href="/login" passHref legacyBehavior>
            <InlineLink>Sign In Here</InlineLink>
          </Link>
        </FooterRow>
      </Form>
    </Card>
  );
};

const RegisterPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>Register - Twilight Struggle</title>
      </Head>

      <PageShell>
        <RegisterFormComponent />
      </PageShell>
    </>
  );
};

export default RegisterPage;
