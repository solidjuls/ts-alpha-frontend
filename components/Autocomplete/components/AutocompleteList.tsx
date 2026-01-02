import React from "react";
import styled from "styled-components";
import { useAutocompleteState } from "../AutocompleteContext";

export const i18ns = {
  noResults: {
    en: "No Results Were Found.",
    de: "Leider haben wir zu Ihrer Suche keine passenden Ergebnisse gefunden.",
  },
};

const RelativeContainer = styled.div`
  position: relative;
  z-index: 200;
`;

/**
 * Dropdown list container
 * - Uses card background + border tokens
 * - Soft shadow per style guide
 * - Positioned absolutely under the input
 */
const ListContainer = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;

  background-color: var(--bg-card);
  color: var(--primary-text);
  border-radius: 8px;
  border: 1px solid var(--border);
  box-shadow: var(--shadow-soft);

  max-height: 300px;
  overflow-y: auto;
  outline: 0;
  z-index: 200;
  padding: 4px 0;
`;

interface AutocompleteListProps {
  children: React.ReactNode;
  noResultsCustomText?: string;
  css?: React.CSSProperties;
  [key: string]: any;
}

const AutocompleteList: React.FC<AutocompleteListProps> = ({
  children,
  noResultsCustomText,
  css,
  ...rest
}) => {
  const { isOpen, getMenuProps } = useAutocompleteState();

  if (!isOpen) return null;

  return (
    <RelativeContainer>
      <ListContainer
        {...(getMenuProps ? getMenuProps({ isOpen }) : {})}
        style={css}
        {...rest}
      >
        {children}
      </ListContainer>
    </RelativeContainer>
  );
};

export { AutocompleteList };
