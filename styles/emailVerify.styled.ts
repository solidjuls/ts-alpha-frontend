import styled from "styled-components";
import Text from "components/Text";
import { Input } from "components/Input";
import { Button } from "components/Button";

export const Page = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;

  background: var(--bg-page);
`;

export const Card = styled.div`
  width: 100%;
  max-width: 420px;
  padding: 28px;

  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
`;

export const Title = styled.h2`
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