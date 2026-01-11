import styled from "styled-components";
import { Button } from "components/Button";

/**
 * DangerButton
 * - Same size as primary buttons
 * - Uses "danger-alt" color (USSR + alt-text)
 * - Intended for destructive actions (Delete, Close, Remove)
 */
export const DangerButton = styled(Button)`
  height: 36px;
  min-width: 110px;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  font-weight: 600;

  background-color: var(--ussr);
  color: var(--alt-text);

  border: 1px solid var(--border);

  transition:
    background-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.15s ease;

  &:hover:not(:disabled) {
    background-color: var(--ussr);
    filter: brightness(0.95);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
    transform: translateY(-1px);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  }

  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;
