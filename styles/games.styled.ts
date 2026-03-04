import styled from "styled-components";
import { media } from "theme";
import Link from "next/link";
import { ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";
import { Flex } from "components/Atoms";
import { Button } from "components/Button";
import Text from "components/Text";

export const GameContainer = styled.div<{ $isLoading: boolean }>`
  display: flex;
  width: 100%;
  max-width: 48rem;
  flex-direction: column;
  background-color: var(--bg-card);
  padding: 24px 16px 16px;
  align-items: center;
  justify-content: ${({ $isLoading }) => ($isLoading ? "center" : "flex-start")};
  height: ${({ $isLoading }) => ($isLoading ? "250px" : "auto")};
  border: 1px solid var(--border);
  border-radius: 8px;
  box-shadow: var(--shadow-soft);
`;

// Top row with USA vs USSR players
export const PlayersHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 0 0 12px 0;
  gap: 8px;

  ${media.md} {
    align-items: flex-start;
  }
`;

export const PlayerNameBlock = styled.div`
  display: flex;
  flex-direction: column;
`;

// Row with flag + name
export const PlayerRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  margin: 0 8px;
  gap: 4px;
`;

// Ratings row under each player
export const RatingRow = styled.div<{ $isUSSR?: boolean }>`
  display: flex;
  flex-direction: row;
  margin: 0 8px;
  ${({ $isUSSR }) =>
    $isUSSR
      ? `
    justify-content: flex-start;
  `
      : `
    justify-content: flex-end;
  `}
  gap: 4px;

  .mono {
    font-size: 0.875rem;
  }
`;

// Link for player names, using brand colors & side-specific border
export const PlayerLink = styled(Link)<{
  $side: "usa" | "ussr";
  $isWinner?: boolean;
}>`
  text-decoration: none;
  color: var(--primary-text);

  /* Winner stays bold, loser becomes normal */
  font-weight: ${({ $isWinner }) => ($isWinner ? 600 : 400)};

  border-bottom: 2px solid
    ${({ $side }) => ($side === "usa" ? "var(--usa)" : "var(--ussr)")};
  padding-bottom: 1px;

  &:hover,
  &:focus-visible {
    color: var(--ussr);
    text-decoration: none;
  }
`;


// Meta grid (tournament, code, etc.)
export const MetaWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 8px;
  width: 100%;
`;

export const MetaGrid = styled.div`
  display: grid;
  gap: 0.5rem;
  grid-template-columns: minmax(0, 5fr) 0.1fr minmax(0, 5fr);
  width: 100%;
  max-width: 32rem;

  @media (max-width: 600px) {
    grid-template-columns: max-content minmax(0, 1fr);
    gap: 0.35rem 0.75rem;
  }
`;


export const MetaLabelColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;

  @media (max-width: 600px) {
    align-items: flex-start;
  }
`;

export const MetaValueColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

export const MetaSpacer = styled.div`
  @media (max-width: 600px) {
    display: none;
  }
`;

// Chevron icons (rating change)
interface ChevronIconProps {
  $color?: "var(--ussr)" | "var(--usa)";
}

export const ChevronWrapper = styled.div`
  position: relative;
  width: 15px;
`;

export const StyledChevronDownIcon = styled(ChevronDownIcon)<ChevronIconProps>`
  position: absolute;
  color: ${({ $color }) => $color || "black"};
`;

export const StyledChevronUpIcon = styled(ChevronUpIcon)<ChevronIconProps>`
  position: absolute;
  color: ${({ $color }) => $color || "black"};
`;

// Tournament name with ellipsis + responsive max width
export const TruncatedSpan = styled.span`
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;

  ${media.md} {
    max-width: 130px;
  }
`;

export const UnstyledLink = styled(Link)`
  all: unset;

  /* Explicitly remove underline */
  text-decoration: none;

  &:hover,
  &:focus,
  &:active {
    color: inherit;
    text-decoration: none;
  }
`;

// Admin actions (Buttons)
export const AdminActions = styled(Flex)`
  margin-top: 8px;
  gap: 8px;
`;

export const AdminButton = styled(Button)`
  width: 150px;
  margin: 8px 0;
`;

// Label copy box
export const LabelCopyBox = styled.div`
  padding: 12px;
  border: 1px solid var(--border);
  border-radius: 6px;
  margin-top: 12px;
  background-color: var(--bg-card);
`;

export const NumericText = styled(Text)<{ $newRating?: boolean }>`
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;

  /* default */
  font-size: small;

  /* override when variant is used */
  ${({ $newRating }) => $newRating && `
    font-size: inherit;
  `}
`;