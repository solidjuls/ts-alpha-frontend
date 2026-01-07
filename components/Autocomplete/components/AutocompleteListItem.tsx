import React from "react";
import styled from "styled-components";
import { useAutocompleteState } from "../AutocompleteContext";

interface ItemProps {
  $highlighted?: boolean;
  disabled?: boolean;
  $itemColor?: string;
}

const Item = styled.div<ItemProps>`
  position: relative;
  cursor: pointer;
  display: block;
  line-height: 1.4;
  padding: 6px 10px;
  font-size: 0.875rem;

  background-color: ${({ $highlighted, $itemColor }) =>
    $highlighted ? "var(--usa-alt)" : $itemColor || "var(--bg-card)"};
  color: ${({ $highlighted }) =>
    $highlighted ? "#ffffff" : "var(--primary-text)"};

  transition:
    background-color 0.15s ease,
    color 0.15s ease;

  &[disabled] {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  }

  &:hover {
    background-color: var(--ussr);
    color: #ffffff;
  }

  &:focus-visible {
    outline: 2px solid var(--usa);
    outline-offset: 2px;
  }
`;

interface AutocompleteListItemProps {
  children: React.ReactNode;
  id?: string;
  index: number;
  value: any;
  itemColor?: string;
  disabled?: boolean;
  [key: string]: any;
}

const AutocompleteListItem: React.FC<AutocompleteListItemProps> = ({
  children,
  id,
  index,
  value,
  itemColor,
  disabled,
  ...rest
}) => {
  const { highlightedIndex, getItemProps } = useAutocompleteState();
  const itemProps = getItemProps ? getItemProps({ item: value, index }) : {};
  const onClick = (itemProps as any)?.onClick;
  const restItemProps = { ...itemProps };
  delete (restItemProps as any).onClick;

  const isHighlighted = highlightedIndex === index;

  return (
    <Item
      key={`${id}${index}`}
      {...rest}
      $highlighted={isHighlighted}
      $itemColor={itemColor}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      {...restItemProps}
    >
      {children}
    </Item>
  );
};

export { AutocompleteListItem };
