import React from "react";
import { styled } from "stitches.config";
import PropTypes from "prop-types";
import { useAutocompleteState } from "../AutocompleteContext";
import { Box } from "components/Atoms";

export const i18ns = {
  noResults: {
    en: "Unfortunately no results were found.",
    de: "Leider haben wir zu Ihrer Suche keine passenden Ergebnisse gefunden.",
  },
};

const ListContainer = styled("div", {
  borderRadius: 4,

  borderRadius: "4px",
  backgroundColor: "white",
  outline: 0,
  zIndex: 200,
  border: "1px solid black",
  maxHeight: "300px",
  overflowY: "auto",
  width: "100%",
  display: "block",
  position: "absolute",
  top: 0,
  left: 0,
});

const AutocompleteList = ({ children, noResultsCustomText, css, ...rest }) => {
  const { isOpen, getMenuProps } = useAutocompleteState();

  if (!isOpen) return null;

  return (
    <Box
      css={{
        position: "relative",
        zIndex: 200,
      }}
    >
      <ListContainer {...getMenuProps({ isOpen })} style={css} {...rest}>
        {children}
      </ListContainer>
    </Box>
  );
};

export { AutocompleteList };
