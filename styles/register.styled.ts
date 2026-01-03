import styled from "styled-components";
import Text from "components/Text";
import { Input, PasswordInput } from "components/Input";
import { Button } from "components/Button";

/* -----------------------
   Style Guide Wrappers
------------------------ */

export const PageShell = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;

  padding: 24px 16px;
  background: transparent;
`;

export const Card = styled.div`
  width: 100%;
  max-width: 520px;

  background-color: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
  box-shadow: var(--shadow-soft);

  padding: 20px;

  @media (min-width: 520px) {
    padding: 28px;
  }
`;

export const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
`;

export const Title = styled.h2`
  margin: 0;
  color: var(--primary-text);
  text-align: center;
`;

export const Subtitle = styled(Text)`
  text-align: center;
  color: var(--primary-text);
  opacity: 0.9;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 14px;

  @media (min-width: 520px) {
    grid-template-columns: 1fr 1fr;
  }
`;

export const Field = styled.div`
  width: 100%;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const StyledInput = styled(Input)`
  width: 100%;
  color: var(--primary-text);
  background-color: var(--bg-color);
  min-width: 0;
  border-color: var(--border);
`;

export const StyledPasswordInput = styled(PasswordInput)`
  width: 100%;
  color: var(--primary-text);
  min-width: 0;
`;

export const HelpText = styled.div`
  font-size: 12px;
  line-height: 1.4;
  color: var(--primary-text);
  opacity: 0.85;
`;

export const Alert = styled.div`
  padding: 12px;
  border-radius: 12px;
  border: 1px solid var(--border);
  background: rgba(0, 0, 0, 0.04);
  color: var(--primary-text);
  box-shadow: var(--shadow-soft);
`;

export const AlertTitle = styled.div`
  font-weight: 700;
  margin-bottom: 6px;
`;

export const AlertList = styled.ul`
  margin: 0;
  padding-left: 18px;

  li {
    margin: 4px 0;
  }
`;

export const InlineLink = styled.a``;

export const FooterRow = styled.div`
  margin-top: 6px;
  text-align: center;
  color: var(--primary-text);
`;

export const SubmitButton = styled(Button)`
  width: 100%;
`;