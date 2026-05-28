import styled from "styled-components";
import Link from "next/link";
import Text from "components/Text";
import { Box, Flex } from "components/Atoms";
import { media } from "theme";

/**
 * Wrapper
 * - Uses your card surface + border + soft shadow
 */
export const ResultsStyleWrapper = styled.div`
  display: flex;
  flex-direction: column;

  background-color: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
  box-shadow: var(--shadow-soft);

  flex-grow: 1;
  margin-bottom: 12px;
  width: 100%;
  max-width: 1000px;
  min-height: 600px;

  color: var(--primary-text);

  &:hover {
    color: var(--alt-text);
  }
`;

interface PlayerInfoProps {
  status?: "played" | "default" | "firstAlert" | "secondAlert" | "duedate";
}

/**
 * PlayerInfo (card)
 * - Keeps status colors but makes them muted / theme-aligned
 */
export const PlayerInfo = styled.div<PlayerInfoProps>`
  display: flex;
  flex-direction: column;

  width: 100%;
  padding: 0.75rem 1rem;
  margin: 0.5rem 0;

  border-radius: 8px;
  border: 1px solid var(--border);
  box-shadow: var(--shadow-soft);

  color: var(--primary-text);

  /* theme-aligned background tints */
  background-color: ${(props) => {
    switch (props.status) {
      case "played":
        /* Calm resolution (USA) */
        return "var(--usa-half)";

      case "firstAlert":
        /* Rising tension */
        return "var(--ussr-quarter)";

      case "secondAlert":
        /* Escalation */
        return "var(--ussr-half)";

      case "duedate":
        /* Critical moment (USSR) */
        return "var(--ussr)";

      case "default":
      default:
        return "var(--bg-card)";
    }
  }};

  transition: box-shadow 0.2s ease, transform 0.2s ease;
  cursor: pointer;
  
  &:hover {
    background-color: var(--ussr);
    transform: translateY(-2px);
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
    color: var(--alt-text);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
  }
`;

export const CheckOpponentProfileCell = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  justify-content: center;

  background-color: var(--bg-card);
  color: var(--primary-text);
  font-weight: 600;

  padding: 0.75rem 1rem;
  margin: 0.5rem 0.5rem;

  border-radius: 8px;
  border: 1px solid var(--border);
  box-shadow: var(--shadow-soft);

  ${media.md} {
    display: none;
  }

  cursor: pointer;

  &:hover {
    background-color: var(--ussr);
    transform: translateY(-2px);
    color: var(--alt-text);
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
  }
`;

export const DueDateCell = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;

  padding: 0.75rem 1rem;
  margin: 0.5rem 0.5rem;

  border-radius: 8px;
  border: 1px solid var(--border);
  box-shadow: var(--shadow-soft);

  background-color: var(--bg-card);
  color: var(--primary-text);

  ${media.md} {
    display: none;
  }
`;

interface UnstyledLinkProps {
  $hoverVariant?: "primary" | "alt";
}

/**
 * Nav-style links (no underline; hover is color only)
 */
export const UnstyledLink = styled(Link)<UnstyledLinkProps>`
  all: unset;
  cursor: pointer;
  text-decoration: none;

  &:hover,
  &:focus-visible,
  &:active {
    color: ${({ $hoverVariant }) =>
      $hoverVariant === "alt"
        ? "var(--alt-text)"
        : "var(--primary-text)"};
    text-decoration: none;
  }
`;

interface ResponsiveContainerProps {
  direction?: "row" | "column";
}

export const ResponsiveContainer = styled.div<ResponsiveContainerProps>`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 0 auto;
  max-width: 1100px;
`;

export const FlexRow = styled(Flex)`
  display: flex;
  flex-direction: row;
`;

export const PlayerInfoContainer = styled(Box)`
  display: flex;
  margin: 0 8px 0 8px;
  flex-direction: row;
  line-height: 1;
  align-items: center;
  color: inherit;
`;

export const TournamentInfoFlex = styled(Flex)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 0 0 0 8px;
`;

export const LoadingContainer = styled(Flex)`
  width: 100%;
`;

export const CenteredResultsWrapper = styled(ResultsStyleWrapper)`
  justify-content: center;
  align-items: center;
`;

export const TournamentText = styled(Text)`
  align-self: center;
  margin-left: 4px;
  font-size: small;
  color: inherit;
`;
export const HigherSeedText = styled(Text)`
  font-size: small;
  color: inherit;
  margin-left: 12px;
`;

export const ColumnUnstyledLink = styled(UnstyledLink)`
  display: flex;
  flex-direction: column;
  color: inherit;
  &:hover {
    color: inherit;
  }
`;

/**
 * Tabs
 * - Neutral surface + border
 * - Active uses USA color, hover uses USSR accent
 */
export const TabContainer = styled.div`
  display: inline-flex;
  align-self: flex-start;
  width: fit-content;
  max-width: 100%;
  overflow-x: auto; 
  white-space: nowrap; 

  border-radius: 8px;
  border: 1px solid var(--border);
  background-color: var(--bg-card);
`;

interface TabButtonProps {
  $active?: boolean;
}

export const TabButton = styled.button<TabButtonProps>`
  padding: 10px 18px;
  border: none;
  border-radius: 0;
  cursor: pointer;

  font-size: 14px;
  font-weight: 600;

  &:hover {
    background-color: var(--ussr);
    color: var(--alt-text);
  }

  background-color: ${({ $active }) =>
    $active ? "var(--usa)" : "var(--bg-card)"};

  color: ${({ $active }) =>
    $active ? "var(--alt-text)" : "var(--primary-text)"};

  border-right: 1px solid var(--border);

  transition:
    background-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;
`;

export const PageTitle = styled.h2`
    color: var(--primary-text);
    margin 0 0 16px 0;
`;

export const SpinnerContainer = styled.div`
  position: absolute;
  top: 50%; 
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
`;

export const ActionButtonsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  margin-left: auto;

  ${media.md} {
    display: none;
  }
`;

export const DeleteButton = styled.button`
  height: 36px;
  min-width: 96px;

  padding: 0 14px;
  font-size: 14px;
  font-weight: 600;

  border-radius: 6px;
  border: 1px solid var(--border);

  background-color: var(--ussr);
  color: var(--alt-text);

  cursor: pointer;
  transition:
    background-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.15s ease;

  &:hover:not(:disabled) {
    background-color: var(--ussr-dark, var(--ussr));
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
    transform: translateY(-1px);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
