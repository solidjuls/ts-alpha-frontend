import styled from "styled-components";
import { media } from "theme";
import { Button } from "components/Button";

export const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  padding: 16px;
`;

export const PageHeader = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;

  ${media.md} {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const Title = styled.h2`
  margin: 0;
  color: var(--primary-text);
`;

export const Actions = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;

  ${media.md} {
    width: 100%;
  }
`;

export const CreateButton = styled(Button)`
  width: 180px;

  ${media.md} {
    width: 100%;
  }
`;

/* -----------------------
   Card + Table
------------------------ */

export const Card = styled.div`
  background-color: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
  box-shadow: var(--shadow-soft);
  overflow: hidden;
`;

export const TableScroll = styled.div`
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
`;

export const TournamentTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 760px;
`;

export const TableHeader = styled.thead`
  background: rgba(0, 0, 0, 0.04);
`;

export const TableHeaderCell = styled.th`
  padding: 12px 14px;
  text-align: left;
  font-weight: 700;
  font-size: 12px;
  color: var(--alt-text);
  border-bottom: 1px solid var(--border);
  white-space: nowrap;
`;

export const TableRow = styled.tr`
  border-bottom: 1px solid var(--border);
  cursor: pointer;

  &:last-child {
    border-bottom: none;
  }

  &:hover td {
    background-color: var(--ussr);
  }
`;

export const TableCell = styled.td`
  padding: 12px 14px;
  vertical-align: middle;
  font-size: 13px;
  color: var(--primary-text);
`;

export const NameCell = styled(TableCell)`
  font-weight: 600;
`;

export type StatusVariant = "closed" | "open" | "registrationOpen" | "initial" | "ongoing" | "registrationClosed";

export const StatusBadge = styled.span<{ $variant: StatusVariant }>`
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;

  border: 1px solid var(--border);
  background: var(--bg-card);
  color: var(--primary-text);

  /* Theme-aligned tints */
  ${({ $variant }) => {
    switch ($variant) {
      case "open":
      case "ongoing":
        return `
          background: var(--usa-half);
          color: var(--primary-text);
        `;
      case "registrationOpen":
        return `
          background: var(--usa);
          color: var(--primary-text);
        `;
      case "registrationClosed":
        return `
          background: var(--ussr);
          color: var(--primary-text);
        `;
      case "closed":
        return `
          background: var(--ussr);
          color: var(--primary-text);
        `;
      case "initial":
        return `
          background: var(--bg-card);
          color: var(--primary-text);
        `;
      default:
        return `
          background: var(--bg-card);
          color: var(--primary-text);
        `;
    }
  }}
`;

export const EmptyState = styled.div`
  padding: 18px;
  border-radius: 12px;
  border: 1px solid var(--border);
  background: var(--bg-card);
  box-shadow: var(--shadow-soft);
  color: var(--primary-text);
`;

export const LoadingArea = styled.div`
  min-height: 320px;
  display: flex;
  align-items: center;
  justify-content: center;
`;