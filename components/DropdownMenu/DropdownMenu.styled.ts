import styled from "styled-components";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { TriangleDownIcon } from "@radix-ui/react-icons";
import { Box, Span } from "components/Atoms";

/* =========================
   Menu Item
   ========================= */

export const StyledItem = styled(DropdownMenu.Item)`
  font-size: 0.875rem;
  line-height: 1.4;
  color: var(--primary-text);
  cursor: pointer;
  border-radius: 6px;
  padding: 6px 10px;
  transition: background-color 0.15s ease, color 0.15s ease;
  display: flex;
  align-items: center;
  justify-content: space-between;

  &[data-highlighted] {
    outline: none;
    background-color: var(--ussr);
    color: #ffffff;
  }
`;

/* =========================
   Trigger
   ========================= */

interface StyledTriggerProps {
  hasError?: boolean;
}

export const StyledTrigger = styled(DropdownMenu.Trigger)<StyledTriggerProps>`
  padding: 0;
  border-radius: 8px;
  border: 1px solid var(--border);
  background-color: var(--bg-card);
  min-height: 36px;
  display: flex;
  align-items: center;

  ${({ hasError }) =>
    hasError &&
    `
      border-color: var(--ussr);
    `}

  &:focus-visible {
    outline: 2px solid var(--usa);
    outline-offset: 2px;
  }
`;

/* =========================
   Content
   ========================= */

export const StyledContent = styled(DropdownMenu.Content)`
  border-radius: 8px;
  background-color: var(--bg-card);
  max-height: 260px;
  overflow-y: auto;
  border: 1px solid var(--border);
  box-shadow: var(--shadow-soft);
  z-index: 99;
`;

/* =========================
   Misc
   ========================= */

export const StyledTriangleDownIcon = styled(TriangleDownIcon)`
  position: absolute;
  top: 50%;
  right: 10px;
  color: var(--muted-text);
  transform: translateY(-50%);
`;

export const SelectedItemDiv = styled.div`
  height: 36px;
  border-radius: 8px;
  background-color: var(--bg-card);
  text-align: left;
  line-height: 2.3;
  font-size: 0.95rem;
  color: var(--primary-text);
  padding: 0 32px 0 10px;
`;

export const TriggerContainer = styled(Box)`
  position: relative;
  cursor: pointer;
  width: 100%;
`;

export const StyledSpan = styled(Span)`
  margin-left: 8px;
`;

export const DynamicStyledTrigger = styled(StyledTrigger)<{ width: string }>`
    width: 100%;
    max-width: ${({ width }) => width};
    min-width: 250px;
`;

export const DynamicStyledContent = styled(StyledContent)<{
  maxHeight?: string;
  width: string; // (can leave for now so you don't have to touch callers)
}>`
  max-height: ${({ maxHeight }) => maxHeight || "auto"};

  /* Match the trigger width (responsive) */
  width: var(--radix-popper-anchor-width);
  min-width: var(--radix-popper-anchor-width);

  /* Never exceed viewport */
  max-width: calc(100vw - 2rem);
  box-sizing: border-box;
`;