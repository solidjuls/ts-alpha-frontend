import styled from "styled-components";
import { media } from "theme";
import { Button } from "components/Button";

export const Page = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  padding: 16px;
`;

export const Card = styled.section`
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 8px;
  box-shadow: var(--shadow-soft);
  overflow: hidden;
`;

export const CardBody = styled.div`
  padding: 16px;

  ${media.md} {
    padding: 14px;
  }
`;

export const CardFooter = styled.div`
  padding: 12px 16px;
  border-top: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;

  ${media.md} {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const HeaderRow = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  padding: 16px;
  border-bottom: 1px solid var(--border);

  ${media.md} {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const Title = styled.h2`
  margin: 0;
  color: var(--primary-text);
`;

export const Subtle = styled.div`
  color: var(--primary-text);
  opacity: 0.85;
`;

export const Badge = styled.span<{ $variant?: "neutral" | "usa" | "ussr" }>`
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 999px;
  border: 1px solid var(--border);
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;

  background: ${({ $variant }) => {
    switch ($variant) {
      case "usa":
        return "var(--usa-half)";
      case "ussr":
        return "var(--ussr-quarter)";
      default:
        return "var(--bg-card)";
    }
  }};

  color: var(--primary-text);
`;

export const InfoGrid = styled.div`
  display: grid;
  gap: 10px 16px;
  grid-template-columns: 1fr 1fr;
  align-items: start;

  ${media.md} {
    grid-template-columns: 1fr;
  }
`;

export const FullWidth = styled.div`
  grid-column: 1 / -1;
  min-width: 0;
`;

export const DescriptionBox = styled.div`
  margin-top: 8px;
  padding: 12px;
  background: var(--bg-card);
  border-radius: 10px;
  border: 1px solid var(--border);
  box-shadow: var(--shadow-soft);
  color: var(--primary-text);

  overflow-wrap: anywhere;

  p:first-child {
    margin-top: 0;
  }
  p:last-child {
    margin-bottom: 0;
  }
`;

export const StatusLine = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
`;

export const StatusText = styled.span<{ $tone?: "neutral" | "good" | "warn" }>`
  font-weight: 600;
  color: ${({ $tone }) => {
    switch ($tone) {
      case "good":
        return "var(--usa)";
      case "warn":
        return "var(--ussr)";
      default:
        return "var(--primary-text)";
    }
  }};
`;

export const ButtonRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: flex-end;

  ${media.md} {
    justify-content: flex-start;
  }
`;

export const PillButton = styled(Button)<{ $tone?: "usa" | "ussr" | "neutral" }>`
  &:hover:not(:disabled) {
    background-color: var(--ussr);
    color: var(--alt-text);
  }
`;

export const DangerPillButton = styled(Button)`
  padding: 10px 14px;
  font-weight: 600;

  background: var(--ussr);
  color: var(--alt-text);
  border: 1px solid var(--border);

  &:hover:not(:disabled) {
    background: var(--ussr);
    filter: brightness(0.95);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const AdminBar = styled.div`
  padding: 12px 16px;
  border-top: 1px solid var(--border);
  background: var(--bg-card);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;

  ${media.md} {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const AdminLabel = styled.div`
  font-weight: 700;
  color: var(--primary-text);
`;

export const NotFoundContainer = styled.div`
  padding: 18px;
  border-radius: 12px;
  border: 1px solid var(--border);
  background: var(--bg-card);
  box-shadow: var(--shadow-soft);
  color: var(--primary-text);
  text-align: center;
`;

export const InlineFormCard = styled(Card)`
  overflow: visible;
`;

export const FormHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 12px;
`;

export const FormTitle = styled.h3`
  margin: 0;
  color: var(--primary-text);
  font-size: 16px;
`;

export const FormDescription = styled.p`
  margin: 0;
  color: var(--primary-text);
  opacity: 0.8;
  font-size: 13px;
`;

export const FormRow = styled.div`
  display: flex;
  gap: 12px;
  align-items: flex-end;

  @media (max-width: 700px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const FormField = styled.div`
  flex: 1;
  min-width: 0;
`;