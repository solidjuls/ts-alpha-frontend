import styled from "styled-components";
import { Input } from "components/Input";
import { Button } from "components/Button";
import { Span } from "components/Atoms";

export const Panel = styled.div`
  padding: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  color: var(--primary-text);
  background-color: var(--bg-card);
  margin-bottom: 8px;
`;

export const ScheduleSection = styled.div`
  margin-top: 16px;
  padding: 16px;
  border: 1px solid var(--border);
  border-radius: 6px;
  background-color: var(--bg-card);
`;

export const SectionTitle = styled.h4`
  margin: 0 0 12px 0;
  color: var(--primary-text);
`;

export const FormRow = styled.div`
  display: flex;
  gap: 12px;
  align-items: flex-end;
  margin-bottom: 12px;
  flex-wrap: wrap;
`;

export const GameCodeInput = styled(Input)`
  width: 80px;
  height: 35px;
`;

export const RemoveButton = styled(Button)`
  height: 33px;
  margin-left: 8px;
`;

export const RemovePlayerContainer = styled.div`
    display: flex;
    align-items: flex-end;
`;

export const SmallSpan = styled(Span)`
    font-size: 12px;
    color: var(--muted-text);
`;