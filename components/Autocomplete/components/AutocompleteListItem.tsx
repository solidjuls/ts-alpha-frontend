import React from "react";
import styled from "styled-components";
import { useAutocompleteState } from "../AutocompleteContext";

interface ItemProps {
  $color?: 'lightgray' | 'white';
  disabled?: boolean;
}

const Item = styled.div<ItemProps>`
  position: relative;
  cursor: pointer;
  display: block;
  line-height: 1;
  color: ${props => props.theme?.colors?.textDark || '#333'};
  font-size: ${props => props.theme.fontSizes.fontSizeM || '14px'};
  padding: 4px 8px;
  background-color: ${props => {
    if (props.$color === 'lightgray') return 'darkBlue';
    return props.theme?.colors?.backgroundColorLight || '#fff';
  }};
  color: ${props => {
    if (props.$color === 'lightgray') return 'white';
    return props.theme?.colors?.textDark || '#333';
  }};
  transition: all 50ms;

  &[disabled] {
    opacity: 0.5;
    cursor: auto;
    pointer-events: none;
  }

  &:focus {
    outline: none;
    background-color: darkBlue;
    color: white;
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

  return (
    <Item
      key={`${id}${index}`}
      {...rest}
      $color={highlightedIndex === index ? "lightgray" : "white"}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      {...restItemProps}
    >
      {children}
    </Item>
  );
};

// Default props are handled through TypeScript interface defaults

export { AutocompleteListItem };
