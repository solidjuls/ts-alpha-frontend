import styled from "styled-components";
import { media } from "theme";
import { Form } from "components/Atoms";
import { Button } from "components/Button";

export const Page = styled.div`
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  padding: 16px;
`;

export const Card = styled.div`
  background-color: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
  box-shadow: var(--shadow-soft);
  padding: 16px;

  @media (min-width: 768px) {
    padding: 20px;
  }
`;

export const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 12px;
`;

export const Title = styled.h2`
  margin: 0;
  color: var(--primary-text);
`;

export const Subtitle = styled.p`
  margin: 0;
  color: var(--primary-text);
  opacity: 0.85;
  font-size: 14px;
`;

export const Alert = styled.div<{ $variant: "success" | "error" }>`
  margin-bottom: 12px;
  padding: 12px;
  border-radius: 12px;
  border: 1px solid var(--border);
  box-shadow: var(--shadow-soft);
  background-color: ${({ $variant }) =>
    $variant === "success" ? "var(--usa-half)" : "var(--ussr-quarter)"};
  color: var(--primary-text);
`;

export const StyledForm = styled(Form)`
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: stretch;
  width: 100%;
`;

export const Field = styled.div`
  width: 100%;
`;

export const ActionsRow = styled.div`
  display: flex;
  justify-content: flex-start;
  margin-top: 8px;
`;

export const SubmitButton = styled(Button)`
  width: 200px;
  font-size: 18px;

  ${media.md} {
    width: 100%;
  }
`;