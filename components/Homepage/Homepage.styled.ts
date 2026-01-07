import Link from "next/link";
import styled from "styled-components";
import Text from "components/Text";
import { media } from "../../theme";

export const ContainerGameResults = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  gap: 16px;

  /* Give the page some breathing room like other pages */
  padding: 16px;

  ${media.md} {
    flex-direction: column;
    padding: 12px;
  }
`;

export const GlobalContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  /* Center the main column on wide screens */
  max-width: 56rem;
  margin: 0 auto;

  gap: 12px;
`;

export const ResultsHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const ResultsFooter = styled.div`
  display: flex;
  justify-content: center;
  padding: 8px 0;
`;

export const FilterPanel = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;

  /* Card-style container like other pages */
  background-color: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
  box-shadow: var(--shadow-soft);
  padding: 12px;

  ${media.md} {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const StyledResultsPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;

  /* Don’t double-card: rows are the cards */
  background-color: transparent;
`;

export const LoadingPanel = styled.div`
  min-height: 420px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  background-color: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
  box-shadow: var(--shadow-soft);
`;

export const PlayerCard = styled.div`
  background-color: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
  box-shadow: var(--shadow-soft);

  padding: 10px 12px;

  display: flex;
  flex-direction: column;
  gap: 8px;

  transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 20px rgba(15, 15, 15, 0.08);
    border-color: rgba(0, 0, 0, 0.12);
  }
`;

export const ResultMetaRow = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 10px;

  padding-left: 4px;
`;

export const ResponsiveText = styled(Text)`
  font-size: small;
  align-self: center;
  margin-left: 4px;

  ${media.md} {
    display: none;
  }
`;

export const MonoText = styled.span`
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.02em;
  font-size: small;
  color: var(--secondary-text);
`;

export const MatchupRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const PlayerInline = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;

  line-height: 1;
`;

export const VsText = styled.span`
  font-size: 13px;
  color: var(--secondary-text);
  margin: 0 2px;
`;

export const UnstyledLink = styled(Link)`
  display: block;
  color: var(--primary-text);
  text-decoration: none;
  font-weight: normal;

  &:hover,
  &:focus,
  &:active {
    text-decoration: none;
  }
`;

