import styled from "styled-components";
import { media } from "theme";

export const ChartCard = styled.div`
  width: 100%;
  max-width: 52rem;
  margin-top: 16px;

  background-color: var(--bg-card);
  color: var(--primary-text);

  padding: 16px;
  border: 1px solid var(--border);
  border-radius: 8px;
  box-shadow: var(--shadow-soft);

  ${media.md} {
    max-width: none;
    padding: 12px;
  }
`;

export const ChartArea = styled.div`
  width: 100%;
  height: 400px;
`;

export const CenterMessage = styled.div`
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
