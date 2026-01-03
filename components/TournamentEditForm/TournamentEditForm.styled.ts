import styled from "styled-components";
import { media } from "theme";
import { Button } from "components/Button";

/* -------------------- Layout / Card -------------------- */

export const Card = styled.section`
  width: 100%;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
  box-shadow: var(--shadow-soft);
  overflow: hidden;
`;

export const CardHeader = styled.div`
  padding: 12px 16px;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

export const CardTitle = styled.h3`
  margin: 0;
  color: var(--primary-text);
  font-size: 16px;
  font-weight: 700;
`;

export const CardBody = styled.form`
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 16px;
  min-width: 0;
`;

export const InlineError = styled.div`
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid var(--border);
  background: rgba(0, 0, 0, 0.03);
  color: var(--primary-text);
  box-shadow: var(--shadow-soft);
`;

export const ErrorText = styled.div`
  color: var(--primary-text);
  font-size: 14px;
`;

/* -------------------- Admin Section -------------------- */

export const Section = styled.div`
  margin-top: 6px;
  padding: 12px;
  border-radius: 12px;
  border: 1px solid var(--border);
  background: var(--bg-card);
  box-shadow: var(--shadow-soft);
`;

export const SectionHeaderRow = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
`;

export const SectionTitle = styled.h4`
  margin: 0;
  color: var(--primary-text);
  font-size: 14px;
  font-weight: 700;
`;

export const SectionHint = styled.div`
  color: var(--primary-text);
  opacity: 0.75;
  font-size: 12px;
`;

export const AdminList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
`;

export const AdminItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;

  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid var(--border);
  background: var(--bg-card);
  box-shadow: var(--shadow-soft);
  min-width: 0;
`;

export const AdminName = styled.div`
  color: var(--primary-text);
  font-size: 14px;
  font-weight: 600;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

/* -------------------- Buttons -------------------- */

export const ButtonRow = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  flex-wrap: wrap;
`;

export const PrimaryButton = styled(Button)`
  &:hover:not(:disabled) {
    background: var(--ussr);
    color: var(--alt-text);
  }
`;

export const DangerButton = styled(Button)`
  background: var(--ussr);
  color: var(--alt-text);

  &:hover:not(:disabled) {
    filter: brightness(0.95);
  }
`;

export const AddAdminRow = styled.div`
  display: flex;
  gap: 12px;
  align-items: flex-end;
  flex-wrap: wrap;

  > * {
    min-width: 0;
  }

  ${media.md} {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const AddAdminButton = styled(PrimaryButton)`
  height: 40px;
`;

/* -------------------- Sizing helpers -------------------- */

export const FieldWrap = styled.div`
  width: 100%;
  max-width: 520px;

  ${media.md} {
    max-width: 100%;
  }
`;

export const WideFieldWrap = styled.div`
  width: 100%;
  max-width: 700px;

  ${media.md} {
    max-width: 100%;
  }
`;