import styled from "styled-components";
import { StyledLabel } from "components/DisplayInfo/DisplayInfo.styled";
import { Button } from "components/Button";

/* ---------- Card ---------- */

export const PlayersCard = styled.section`
  margin-top: 24px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
  box-shadow: var(--shadow-soft);
  overflow: hidden;
`;

export const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;

  padding: 12px 14px;
  background: var(--usa);
  color: var(--alt-text);
`;

export const HeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
`;

export const HeaderTitle = styled(StyledLabel)`
  color: var(--alt-text);
`;

export const HeaderSub = styled.div`
  font-size: 12px;
  opacity: 0.9;
`;

/* ---------- Body ---------- */

export const Body = styled.div`
  display: flex;
  flex-direction: column;
`;

export const LoadingOrEmpty = styled.div`
  padding: 14px;
  color: var(--primary-text);
`;

export const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;

  padding: 12px 14px;
  border-top: 1px solid var(--border);
`;

export const PlayerInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
`;

export const PlayerName = styled.div`
  color: var(--primary-text);
  font-weight: 600;
  font-size: 14px;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const PlayerEmail = styled.div`
  color: var(--primary-text);
  opacity: 0.75;
  font-size: 12px;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const RightSide = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
`;

interface StatusBadgeProps {
  $status?: "pending" | "accepted" | "rejected" | "waiting" | "forfeited";
}

export const StatusBadge = styled.span<StatusBadgeProps>`
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  line-height: 1;
  border: 1px solid var(--border);
  background: var(--bg-card);
  color: var(--primary-text);

  ${({ $status }) => {
    switch ($status) {
      case "accepted":
        return `
          background: var(--usa-half);
          color: var(--primary-text);
        `;
      case "pending":
      case "waiting":
        return `
          background: var(--ussr-quarter);
          color: var(--primary-text);
        `;
      case "rejected":
      case "forfeited":
        return `
          background: rgba(0,0,0,0.05);
          color: var(--primary-text);
          opacity: 0.85;
        `;
      default:
        return "";
    }
  }}
`;

/* ---------- Buttons ---------- */

export const HeaderButton = styled(Button)`
  padding: 8px 12px;
  font-size: 13px;
  white-space: nowrap;
  background-color: var(--bg-card);
`;

export const DangerButton = styled(Button)`
  padding: 6px 10px;
  font-size: 12px;
  white-space: nowrap;

  background-color: var(--ussr);

  &:hover {
    filter: brightness(0.95);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const WarnButton = styled(Button)`
  padding: 6px 10px;
  font-size: 12px;
  white-space: nowrap;

  background-color: rgba(0, 0, 0, 0.06);
  color: var(--primary-text);

  &:hover {
    background-color: var(--ussr);
    color: var(--alt-text);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

/* ---------- Responsive ---------- */

export const ResponsiveRow = styled(Row)`
  @media (max-width: 600px) {
    align-items: flex-start;
    flex-direction: column;
    gap: 10px;

    ${RightSide} {
      width: 100%;
      justify-content: flex-end;
    }
  }
`;