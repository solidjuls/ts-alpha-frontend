import React from "react";
import { styled } from "stitches.config";
import PropTypes from "prop-types";
import { useAutocompleteState } from "../AutocompleteContext";

const styledItemStyles = {
  fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
  fontSize: "$2",
  lineHeight: "1",
  color: "$textDark",
  cursor: "pointer",
  borderRadius: "$1",
  padding: "4px 8px 4px 8px",
  transition: "all 50ms",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  position: "relative",

  "&:focus": {
    outline: "none",
    backgroundColor: "darkBlue",
    color: "$textLight",
  },
};

const Item = styled("div", {
  position: "relative",
  cursor: "pointer",
  display: "block",
  lineHeight: 1,
  color: "$textDark",
  fontSize: "$2",
  padding: "4px 8px 4px 8px",
  backgroundColor: "$backgroundColorLight",
  variants: {
    color: {
      lightgray: { backgroundColor: "darkBlue", color: "white" },
      white: { backgroundColor: "$backgroundColorLight" },
    },
  },

  "&[disabled]": {
    opacity: 0.5,
    cursor: "auto",
    pointerEvents: "none",
  },
});

Item.defaultProps = {
  highlight: false,
};

Item.propTypes = {
  // if selected change background-color
  highlight: PropTypes.bool,
};

const AutocompleteListItem = ({ children, id, index, value, itemColor, disabled, ...rest }) => {
  const { highlightedIndex, getItemProps } = useAutocompleteState();
  const { onClick, ...restItemProps } = getItemProps({ item: value, index });
  return (
    <Item
      key={`${id}${index}`}
      itemColor={itemColor}
      {...rest}
      color={highlightedIndex === index ? "lightgray" : "white"}
      onClick={disabled ? Function.prototype : onClick}
      {...restItemProps}
    >
      {children}
    </Item>
  );
};

AutocompleteListItem.defaultProps = {
  itemColor: "grey50",
};

AutocompleteListItem.propTypes = {
  children: PropTypes.node,
  id: PropTypes.string,
  index: PropTypes.number,
  value: PropTypes.object,
  disabled: PropTypes.bool,
  itemColor: PropTypes.string,
};

export { AutocompleteListItem };
