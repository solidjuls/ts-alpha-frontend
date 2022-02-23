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
  border: 2,
  borderRadius: 1,
  marginTop: 1,
  marginBottom: 1,
  padding: 0,
  backgroundColor: "white",
  outline: 0,
  zIndex: 200,
  boxShadow: "0 0 0 2px black",
  maxHeight: "300px",
  overflowY: "auto",
  width: "100%",
  display: "block",
  position: "absolute",
  top: 0,
  left: 0,
});

// const StyledListContainer = styled(ListContainer)`
//   padding: ${themeGet("space.4")};
// `;
const AutocompleteList = ({
  children,
  noResultsCustomText,
  noResultsTextLocale,
  ...rest
}) => {
  const { isOpen, getMenuProps } = useAutocompleteState();

  if (!isOpen) return null;

  return (
    <Box css={{
      position: "relative",
      zIndex: 200,
    }}>
      <ListContainer {...getMenuProps({ isOpen })} {...rest} >
        {children}
      </ListContainer>
    </Box>
  );
};

AutocompleteList.defaultProps = {
  noResultsTextLocale: "en",
};

AutocompleteList.propTypes = {
  children: PropTypes.node,
  noResultsCustomText: PropTypes.string,
  noResultsTextLocale: PropTypes.oneOf(["en", "de"]),
};

export { AutocompleteList };
