import Link from "next/link";
import styled from "styled-components";
import Text from "components/Text";
import { media } from "../../theme";

export const ResponsiveText = styled(Text)`
  font-size: small;
  align-self: center;
  margin-left: 4;
  ${media.md} {
    display: none;
  }
`;

export const ContainerGameResults = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;

  background-color: transparent;
  ${media.md} {
    flex-direction: column;
  }
`;

export const GlobalContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const PlayerInfo = styled.div`
  background-color: var(--bg-card);
  border-radius: 8px;
  box-shadow: var(--shadow-soft);
  padding: 8px 12px;
  display: flex;
  flex-direction: column;
  transition: box-shadow 0.2s ease, transform 0.2s ease;
  cursor: pointer;

  &:hover {
    color: var(--alt-text);
    background-color: var(--ussr);
    transform: translateY(-2px);
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
  }
`;

export const StyledCardRow = styled.div`
  display: grid;
  gap: 1rem;
  grid-template-columns: min-content 3fr 2fr min-content;
  padding-inline-start: 8px;
  padding-inline-end: 8px;
  padding-top: 4px;
  padding-bottom: 4px;
  border-width: 1px;
  border-radius: 6px;
`;

export const StyledResultsPanel = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  color: var(--primary-text);
  background-color: var(--bg-card);
  border: solid 1px transparent;
  border-radius: 12px;
  flex-grow: 1;
  margin-bottom: 12px;
  min-height: 600px;
`;

export const FilterPanel = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;

  ${media.md} {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const UnstyledLink = styled(Link)`
  all: unset;

  /* Explicitly remove underline */
  text-decoration: none;

  &:hover,
  &:focus,
  &:active {
    text-decoration: none;
  }
`;

export const MonoText = styled.span`
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.02em;
  font-size: small;
`;
