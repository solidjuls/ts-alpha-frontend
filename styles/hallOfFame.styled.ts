import Link from "next/link";
import Text from "components/Text";
import styled from "styled-components";
import { media } from "theme";

/* ---------- Layout ---------- */

export const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  width: 100%;
  color: var(--primary-text);
`;

export const Title = styled.h2`
  margin: 0;
`;

export const Lead = styled.p`
  margin: 0;
  line-height: 1.5;
`;

export const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const SectionTitle = styled.h3`
  margin: 0;
`;

export const SectionSubtitle = styled.p`
  margin: 0;
  line-height: 1.5;
`;

export const RegionalBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;

  ${media.md} {
    padding-left: 16px;
    border-left: 2px solid var(--border);
  }
`;

export const RegionalTitle = styled.h4`
  margin: 6px 0 0 0;
`;

/* ---------- Links ---------- */

export const StyledLink = styled(Link)`
  color: var(--usa);
  font-weight: 600;
  text-decoration: none;
  transition: color 0.15s ease, text-decoration 0.15s ease;

  &:hover,
  &:active {
    color: var(--ussr);
    text-decoration: underline;
  }

  &:focus-visible {
    outline: 2px solid var(--usa);
    outline-offset: 2px;
    border-radius: 4px;
  }
`;

/* ---------- Card + Table ---------- */

export const Card = styled.div`
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
  box-shadow: var(--shadow-soft);
  overflow: hidden;
`;

export const TableScroll = styled.div`
  width: 100%;
  min-width: 0;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;

  ${media.md} {
    overflow-x: visible;
  }
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 720px;

  ${media.md} {
    min-width: 0;
  }

  /* ----- MOBILE CARD STYLE ----- */
  ${media.md} {
    display: block;

    thead {
      display: none;
    }

    tbody,
    tr,
    td {
      display: block;
      width: 100%;
    }

    tbody {
      padding: 12px;
    }

    tr {
      margin-bottom: 12px;
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 12px;
      box-shadow: var(--shadow-soft);
    }

    td {
      padding: 10px 12px;
      border-bottom: 1px solid var(--border);

      &:last-child {
        border-bottom: none;
      }

      &::before {
        content: attr(data-label);
        display: block;
        font-weight: 700;
        color: var(--usa);
        margin-bottom: 6px;
      }
    }
  }
`;

export const Thead = styled.thead`
  background: rgba(0, 0, 0, 0.04);
`;

export const Th = styled.th`
  text-align: left;
  font-size: 12px;
  font-weight: 700;
  padding: 10px 12px;
  border-bottom: 1px solid var(--border);
  white-space: nowrap;
`;

export const Td = styled.td`
  padding: 10px 12px;
  border-bottom: 1px solid var(--border);
  font-size: 12px;
  vertical-align: middle;
  white-space: nowrap;

  ${media.md} {
    white-space: normal;
  }
`;

/* ---------- Player + Medal ---------- */

export const PlayerInfo = styled.div<{ $winner?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: ${({ $winner }) => ($winner ? 700 : 400)};
`;

export const Medal = styled.span`
  font-size: 14px;
  line-height: 1;
  filter: drop-shadow(0 1px 0 rgba(0, 0, 0, 0.12));
`;

export const PlayerName = styled(Text)`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

/* ---------- Misc ---------- */

export const Center = styled.div`
  display: flex;
  justify-content: center;
  padding: 24px 0;
`;

export const ErrorBox = styled.div`
  padding: 12px;
  border: 1px solid var(--border);
  border-radius: 12px;
  background: var(--bg-card);
  box-shadow: var(--shadow-soft);
`;