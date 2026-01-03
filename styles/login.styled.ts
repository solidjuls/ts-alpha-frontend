import styled from "styled-components";
import Text from "components/Text";
import { Input, PasswordInput } from "components/Input";
import { Button } from "components/Button";

export const Page = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;

  background: var(--bg-card);
`;

export const Card = styled.div`
  width: 100%;
  max-width: 420px;

  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: 12px;

  padding: 28px;
`;

export const Title = styled.h1`
  margin: 0 0 16px;
  text-align: center;

  font-size: 22px;
  font-weight: 700;
  color: var(--primary-text);
`;

export const SubText = styled(Text)`
  margin: 0 0 20px;
  text-align: center;
  color: var(--muted-text);
  font-size: 14px;

  b {
    color: var(--primary-text);
    font-weight: 600;
  }
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const Field = styled.div`
  width: 100%;
`;

export const StyledInput = styled(Input)`
  width: 100%;
  margin-top: 6px;
`;

export const StyledPasswordInput = styled(PasswordInput)`
  width: 100%;
  margin-top: 6px;
`;

export const CheckboxRow = styled.div`
  width: 100%;
  margin-top: 4px;
`;

export const Message = styled.div<{ $variant?: "error" | "success" }>`
  margin: 8px 0 0;
  text-align: center;
  font-size: 14px;

  color: ${(p) =>
    p.$variant === "success" ? "var(--usa)" : "var(--ussr)"};

  a {
    color: inherit;
    text-decoration: underline;
  }
`;

export const PrimaryButton = styled(Button)`
  width: 100%;
`;

export const Links = styled.div`
  margin-top: 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  text-align: center;
`;

export const RouterError = styled.div`
  margin-top: 16px;
`;