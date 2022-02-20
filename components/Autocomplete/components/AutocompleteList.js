import React from "react";
import stitches from "stitches.config";
import PropTypes from "prop-types";
import { useAutocompleteState } from "../AutocompleteContext";

export const i18ns = {
  noResults: {
    en: "Unfortunately no results were found.",
    de: "Leider haben wir zu Ihrer Suche keine passenden Ergebnisse gefunden.",
  },
};

const RelativeWrapper = stitches.styled("div", {
  position: "relative",
  zIndex: 200,
});

const ListContainer = stitches.styled("div", {
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

  // if (React.Children.count(children) === 0) {
  //   return (
  //     <StyledListContainer>
  //       <Text color="secondaryText" size={2} data-testid="no-results-found">
  //         {noResultsCustomText || i18ns.noResults[noResultsTextLocale]}
  //       </Text>
  //     </StyledListContainer>
  //   );
  // }

  return (
    <RelativeWrapper>
      <ListContainer {...getMenuProps({ isOpen })} {...rest}>
        {children}
      </ListContainer>
    </RelativeWrapper>
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
