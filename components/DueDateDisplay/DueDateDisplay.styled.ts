import styled from "styled-components";
import { Span } from "components/Atoms";
import { Button } from "components/Button";

export const DateSpan = styled(Span)`
    margin: 0 4px 0 4px;
    color: var(--primary-text);
`;

export const ActionButton = styled(Button)`
  height: 36px;
  min-width: 110px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;