import React from "react";
import styled from "styled-components";
import { useAutocompleteState } from "../AutocompleteContext";

export const i18ns = {
  noResults: {
    en: "Unfortunately no results were found.",
    de: "Leider haben wir zu Ihrer Suche keine passenden Ergebnisse gefunden.",
  },
};

const RelativeContainer = styled.div`
  position: relative;
  z-index: 200;
`;

const ListContainer = styled.div`
  border-radius: 4px;
  background-color: white;
  outline: 0;
  z-index: 200;
  border: 1px solid black;
  max-height: 300px;
  overflow-y: auto;
  width: 100%;
  display: block;
  position: absolute;
  top: 0;
  left: 0;
`;

interface AutocompleteListProps {
  children: React.ReactNode;
  noResultsCustomText?: string;
  css?: React.CSSProperties;
  [key: string]: any;
}

const AutocompleteList: React.FC<AutocompleteListProps> = ({ children, noResultsCustomText, css, ...rest }) => {
  const { isOpen, getMenuProps } = useAutocompleteState();

  if (!isOpen) return null;

  return (
    <RelativeContainer>
      <ListContainer {...(getMenuProps ? getMenuProps({ isOpen }) : {})} style={css} {...rest}>
        {children}
      </ListContainer>
    </RelativeContainer>
  );
};

export { AutocompleteList };
