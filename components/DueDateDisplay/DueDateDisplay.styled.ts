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

export const DangerActionButton = styled(Button)`
  height: 36px;
  min-width: 110px;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  /* Same color language as Close Tournament */
  background-color: var(--ussr);
  color: var(--alt-text);

  &:hover:not(:disabled) {
    background-color: var(--ussr);
    color: var(--alt-text);
    filter: brightness(0.95);
  }

  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }
`;