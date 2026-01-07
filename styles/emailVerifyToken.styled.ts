import styled from "styled-components";
import { media } from "theme";
import Text from "components/Text";
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
  max-width: 520px;
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

export const Banner = styled.div<{ $variant: "success" | "error" }>`
  width: 100%;
  padding: 14px;
  border-radius: 10px;
  border: 1px solid var(--border);
  text-align: center;
  margin: 0 0 14px;

  color: ${(p) => (p.$variant === "success" ? "var(--usa)" : "var(--ussr)")};
  background: var(--bg-card);
`;

export const InfoText = styled(Text)`
  margin: 0 0 18px;
  text-align: center;

  font-size: 14px;
  line-height: 1.5;
  color: var(--muted-text);
`;

export const Actions = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 6px;

  ${media.sm} {
    flex-direction: column;
  }
`;


export const ActionButton = styled(Button)`
  flex: 1;

  ${media.sm} {
    width: 100%;
  }
`;