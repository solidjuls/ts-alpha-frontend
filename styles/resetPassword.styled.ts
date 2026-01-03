import styled from "styled-components";
import Text from "components/Text";
import { Input } from "components/Input";
import { Button } from "components/Button";

export const ResetContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;

  background: var(--bg-page);
`;

export const ResetCard = styled.div`
  width: 100%;
  max-width: 450px;
  padding: 28px;

  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: 12px;
`;

export const FormTitle = styled.h1`
  margin: 0 0 14px;
  text-align: center;

  font-size: 22px;
  font-weight: 700;
  color: var(--primary-text);
`;

export const InfoText = styled(Text)`
  margin: 0 0 18px;
  text-align: center;

  font-size: 14px;
  color: var(--muted-text);
`;

export const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export const FormField = styled.div`
  width: 100%;
`;

export const StyledInput = styled(Input)`
  width: 100%;
  margin-top: 6px;
`;

export const Message = styled.div<{ $variant: "error" | "success" }>`
  text-align: center;
  font-size: 14px;
  margin-top: 4px;

  color: ${(p) => (p.$variant === "success" ? "var(--usa)" : "var(--ussr)")};
`;

export const PrimaryButton = styled(Button)`
  width: 100%;
`;

export const BackLink = styled.div`
  margin-top: 16px;
  text-align: center;
`;

export const SuccessBanner = styled.div`
  background-color: var(--bg-card);
  border: 1px solid var(--border);
  color: var(--primary-text);
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  text-align: center;
  width: 100%;
`;

export const PasswordRequirements = styled.div`
  font-size: 12px;
  color: var(--primary-text);
  margin-top: 5px;
`;

export const ErrorMessage = styled.div`
  color: var(--ussr);
  margin: 10px 0;
  text-align: center;
  font-size: 14px;
`;