import styled from "styled-components";
import { media } from "theme";
import { Button } from "components/Button";

/* -----------------------
   Layout
------------------------ */

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

  &:hover {
    color: var(--alt-text);
  }

  ${media.md} {
    width: 100%;
  }
`;

/* -----------------------
   Card + Table (desktop)
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

  /* On mobile we swap to card list instead of horizontal scrolling */
  ${media.md} {
    display: none;
  }
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
    color: var(--alt-text);
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

/* -----------------------
   Mobile tournament cards
------------------------ */

export const MobileList = styled.div`
  display: none;

  ${media.md} {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
`;

export const MobileCard = styled.div`
  background-color: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
  box-shadow: var(--shadow-soft);

  padding: 12px;
  cursor: pointer;

  transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 20px rgba(15, 15, 15, 0.08);
    border-color: rgba(0, 0, 0, 0.12);
  }
`;

export const MobileTopRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
`;

export const MobileName = styled.div`
  font-weight: 700;
  color: var(--primary-text);
  line-height: 1.2;
`;

export const MobileMeta = styled.div`
  margin-top: 10px;

  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const MobileMetaRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
`;

export const MobileLabel = styled.span`
  font-size: 12px;
  color: var(--secondary-text);
`;

export const MobileValue = styled.span`
  font-size: 13px;
  color: var(--primary-text);
  text-align: right;
`;

/* -----------------------
   Badge + States
------------------------ */

export type StatusVariant =
  | "closed"
  | "open"
  | "registrationOpen"
  | "initial"
  | "ongoing"
  | "registrationClosed";

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

  ${({ $variant }) => {
    switch ($variant) {
      case "open":
      case "ongoing":
        return `
          background: var(--usa-half);
          color: var(--alt-text);
        `;
      case "registrationOpen":
        return `
          background: var(--usa);
          color: var(--alt-text);
        `;
      case "registrationClosed":
      case "closed":
        return `
          background: var(--ussr);
          color: var(--alt-text);
        `;
      case "initial":
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
