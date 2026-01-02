import styled from "styled-components";
import Link from "next/link";
import Text from "components/Text";
import { media } from "theme";

/**
 * Page container
 * - Centers content
 * - Uses main background + primary text from global styles
 */
export const Container = styled.div`
  max-width: 72rem;
  margin: 0 auto;
  padding: 1.5rem 1rem 2rem;

  ${media.md} {
    padding: 2rem 1.5rem 3rem;
  }

  h2 {
    margin: 0 0 1.25rem;
  }
`;

/**
 * Wrapper for the whole results section
 */
export const FlexContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

/**
 * Column inside a card row
 */
export const FlexColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
`;

/**
 * Row for label + value (or flag + value)
 */
export const FlexRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
`;

/**
 * Filter row above the results
 * - Wraps on small screens
 * - Keeps spacing consistent with homepage
 */
export const FilterPanelStyled = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  gap: 8px;
  margin: 0 0 8px 0;
  flex-wrap: wrap;

  ${media.lg} {
    flex-direction: column;
    align-items: flex-start;
  }
`;

/**
 * Playdek input (and other inputs when needed)
 * - Matches card & border tokens from the style guide
 */
export const StyledInput = styled.input`
    width: 250px;
    max-width: 100%;
    margin-left: 24px;

    background-color: var(--bg-card);
    color: var(--primary-text);
    border-radius: 8px;
    border: 1px solid var(--border);
    padding: 0px 10px;
    font-size: 15px;
    height: 40px;

    &:focus-visible {
        outline: 2px solid var(--usa);
        outline-offset: 2px;
    }

    ${media.md} {
        margin-left: 0;
        width: 100%;
    }
`;

/**
 * Unstyled link used to wrap clickable rows
 * - Inherits primary text color
 * - No underline even on hover
 * - Lets the card itself handle the hover effect
 */
export const UnstyledLink = styled(Link)`
  all: unset;
  display: block;
  cursor: pointer;
  color: inherit;
  text-decoration: none;

  &:hover,
  &:focus-visible {
    text-decoration: none;
  }
`;

/**
 * Wrapper around the results panel (for spacing)
 */
export const ResultsStyleWrapper = styled.div`
  margin-top: 0.5rem;
`;

/**
 * List of cards
 */
export const StyledResultsPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

/**
 * Individual player row
 * - Uses card styling & hover pattern from the design guide
 * - Grid layout that collapses to a single column on narrow screens
 */
export const StyledCardRow = styled.article`
  display: grid;
  grid-template-columns: 80px minmax(0, 2fr) 96px;
  gap: 0.75rem;
  align-items: center;
  padding: 0.75rem 1rem;

  color: var(--primary-text);
  background-color: var(--bg-card);
  border-radius: 8px;
  border: 1px solid var(--border);
  box-shadow: var(--shadow-soft);

  transition:
    box-shadow 0.2s ease,
    transform 0.2s ease,
    background-color 0.2s ease;

  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
    background-color: var(--ussr);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
  }

  ${media.md} {
    grid-template-columns: 1fr;
    align-items: flex-start;
  }
`;

export const PageTitle = styled.h2`
    color: var(--primary-text);
    margin 0 0 16px 0;
`;

export const StyledText = styled(Text)`
    color: var(--primary-text);
`;

export const TextHeader = styled(Text)`
    color: var(--muted-text);
    textTransform: uppercase;
    letterSpacing: 0.04em;
    font-size: small;
`;