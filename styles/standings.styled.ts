import styled from "styled-components";
import { media } from "theme";

/* ---------- Layout ---------- */

export const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  width: 100%;
`;

export const PageHeader = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  min-width: 0;

  ${media.sm} {
    flex-direction: column;
    align-items: flex-start;
  }
`;


export const Title = styled.h2`
  margin: 0;
  color: var(--primary-text);
  min-width: 0;

  ${media.sm} {
    width: 100%;
  }
`;


/* ---------- Division Tabs ---------- */

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

  background-color: ${({ $active }) => ($active ? "var(--usa)" : "var(--bg-card)")};
  color: ${({ $active }) => ($active ? "var(--alt-text)" : "var(--primary-text)")};

  border-right: 1px solid var(--border);

  transition: background-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;

  &:hover {
    background-color: var(--ussr);
    color: var(--alt-text);
  }

  &:focus-visible {
    outline: 2px solid var(--usa);
    outline-offset: 2px;
  }

  &:last-child {
    border-right: none;
  }
`;

/* ---------- Standings Grid + Loading ---------- */

export const StandingsContainer = styled.div`
  display: grid;
  gap: 16px;
  position: relative;
  align-items: start;
  min-width: 0;

  /* Default: multi-column when there is room */
  grid-template-columns: repeat(auto-fit, minmax(520px, 1fr));

  /* Only when the screen/container is too small for 520px, use 1 column */
  @media (max-width: 540px) {
    grid-template-columns: 1fr;
  }
`;




interface LoadingOverlayProps {
  $isVisible: boolean;
}

export const LoadingOverlay = styled.div<LoadingOverlayProps>`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(1px);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: ${({ $isVisible }) => ($isVisible ? 1 : 0)};
  pointer-events: ${({ $isVisible }) => ($isVisible ? "auto" : "none")};
  transition: opacity 0.2s ease;
  z-index: 10;
  border-radius: 12px;
`;

/* ---------- Card ---------- */

export const StandingGroup = styled.section`
    min-width: 0;
    display: flex;
    flex-direction: column;
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 12px;
    box-shadow: var(--shadow-soft);
    overflow: hidden;
`;

/* Card Header */
export const StandingTitleBar = styled.div`
  padding: 10px 12px;
  background: var(--usa);
  color: var(--alt-text);
`;

export const StandingTitle = styled.h3`
  margin: 0;
`;

/* ---------- Table ---------- */

export const TableScroll = styled.div`
    min-width: 0;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
`;

export const StyledTable = styled.table`
    width: 100%;
    border-collapse: collapse;
    min-width: 0;

    @media (min-width: 768px) {
        min-width: 520px;
    }
`;

export const StyledHeading = styled.thead`
  background: rgba(0, 0, 0, 0.04);
`;

export const StyledHeaderCell = styled.th`
  text-align: left;
  font-size: 12px;
  font-weight: 700;
  color: var(--alt-text);
  padding: 10px 12px;
  border-bottom: 1px solid var(--border);
  white-space: nowrap;
`;

export const StyledHeaderCellCentered = styled(StyledHeaderCell)`
  text-align: center;
`;


export const StyledRow = styled.tr`
    &:hover td {
        background: transparent;
  }
`;

export const StyledCell = styled.td`
  padding: 10px 12px;
  border-bottom: 1px solid var(--border);
  font-size: 12px;
  color: var(--primary-text);
  vertical-align: middle;
  white-space: normal;
`;


export const RankCell = styled(StyledCell)`
  width: 56px;
  text-align: center;
  white-space: nowrap;
`;

export const PlayerCell = styled(StyledCell)`
  min-width: 0;
`;

export const StatCell = styled(StyledCell)`
  width: 84px;
  text-align: center;
  white-space: nowrap;
  font-family: var(--font-mono);
`;

export const PlayerInfoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;

  /* specifically truncate the name text */
  .playerName {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

export const ErrorBox = styled.div`
  padding: 12px;
  border: 1px solid var(--border);
  border-radius: 12px;
  background: var(--bg-card);
  color: var(--primary-text);
  box-shadow: var(--shadow-soft);
`;