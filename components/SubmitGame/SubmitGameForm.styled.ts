import styled from "styled-components";
import { media } from "theme";
import { Box, Form } from "components/Atoms";
import { Button } from "components/Button";
import TextComponent from "./TextComponent";

export const Banner = styled.div`
  align-items: flex-start;
  padding: 12px 16px;
  border-radius: 10px;
  border: 1px solid var(--border);
  box-shadow: 0 6px 18px rgba(15,15,15,0.04);
  max-width: 100%;
  margin-bottom: 12px;
  background-color: var(--bg-card);
  color: var(--primary-text);

  span {
    font-weight: 600;
  }
`;

export const StyledForm = styled(Form)`
  align-items: center;
  background-color: var(--bg-card);
  width: 640px;
  align-self: center;
  padding: 12px;
  margin: 0 auto;

  ${media.md} {
    width: 100%;
  }
`;

export const FormContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 15px;
`;

export const SubmitButton = styled(Button)`
  width: 200px;
  font-size: 18px;
`;

export const SizedText = styled(TextComponent)<{ $variant?: "small" }>`
  width: ${({ $variant }) => ($variant === "small" ? "80px" : "250px")};
  color: var(--primary-text);
  border-color: var(--border);
`;