import styled from "styled-components";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Cross2Icon, MagnifyingGlassIcon, ChevronDownIcon } from "@radix-ui/react-icons";

export const StyledTrigger = styled(DropdownMenu.Trigger)`
  all: unset;
  min-width: 250px;
  min-height: 36px;
  padding: 4px 32px 4px 10px;
  border-radius: 8px;
  border: 1px solid var(--border);
  background-color: var(--bg-card);
  color: var(--primary-text);
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
  cursor: pointer;
  box-sizing: border-box;
  position: relative;

  &:hover {
    border-color: var(--ussr);
  }

  &:focus-visible {
    outline: 2px solid var(--usa);
    outline-offset: 2px;
  }

  &[data-state="open"] {
    border-color: var(--usa);
  }
`;

export const StyledContent = styled(DropdownMenu.Content)`
  border-radius: 8px;
  background-color: var(--bg-card);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-soft);
  z-index: 99;
  padding: 4px;
  width: var(--radix-popper-anchor-width);
  min-width: 250px;
  box-sizing: border-box;
`;

export const SearchWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 8px;
  border-bottom: 1px solid var(--border);
  margin-bottom: 4px;
`;

export const SearchIcon = styled(MagnifyingGlassIcon)`
  color: var(--muted-text);
  flex-shrink: 0;
`;

export const SearchInput = styled.input`
  all: unset;
  flex: 1;
  font-size: 0.875rem;
  color: var(--primary-text);
  min-width: 0;

  &::placeholder {
    color: var(--muted-text);
  }
`;

export const OptionItem = styled(DropdownMenu.CheckboxItem)`
  font-size: 0.875rem;
  line-height: 1.4;
  color: var(--primary-text);
  cursor: pointer;
  border-radius: 6px;
  padding: 6px 10px 6px 28px;
  transition: background-color 0.15s ease;
  display: flex;
  align-items: center;
  position: relative;
  user-select: none;

  &[data-highlighted] {
    outline: none;
    background-color: var(--ussr);
    color: #ffffff;
  }

  &[data-state="checked"] {
    font-weight: 600;
  }
`;

export const ItemIndicator = styled(DropdownMenu.ItemIndicator)`
  position: absolute;
  left: 8px;
  display: flex;
  align-items: center;
`;

export const Pill = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 6px;
  border-radius: 4px;
  background-color: var(--usa-half);
  color: var(--alt-text);
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1.4;
  white-space: nowrap;
  cursor: pointer;
  transition: opacity 0.15s ease;

  &:hover {
    opacity: 0.75;
  }
`;

export const Placeholder = styled.span`
  color: var(--muted-text);
  font-size: 0.875rem;
`;

export const ChevronIcon = styled(ChevronDownIcon)`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--muted-text);
  pointer-events: none;
`;

export const NoResults = styled.div`
  padding: 8px 10px;
  font-size: 0.875rem;
  color: var(--muted-text);
  text-align: center;
`;

export const ClearButton = styled.div`
  padding: 6px 10px;
  font-size: 0.8rem;
  color: var(--ussr);
  cursor: pointer;
  border-top: 1px solid var(--border);
  margin-top: 4px;
  text-align: center;
  border-radius: 0 0 6px 6px;
  transition: background-color 0.15s ease;

  &:hover {
    background-color: var(--ussr);
    color: var(--alt-text);
  }
`;
