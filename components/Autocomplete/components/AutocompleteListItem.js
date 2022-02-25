import React from "react";
import { styled } from "stitches.config";
import PropTypes from "prop-types";
import { useAutocompleteState } from "../AutocompleteContext";

const Item = styled("div", {
  position: "relative",
  cursor: "pointer",
  display: "block",
  lineHeight: 1, //${themeGet('lineHeights.2')},
  color: "black", //${themeGet('colors.grey500')},
  fontSize: 12, //${themeGet('fontSizes.2')},
  padding: "8px 16px", //${themeGet('space.2')} ${themeGet('space.4')},
  backgroundColor: "white", //baseTheme.colors[itemColor] : baseTheme.colors['white'],
  variants: {
    color: {
      lightgray: { backgroundColor: "lightgray" },
      white: { backgroundColor: "white" },
    },
  },
  // "&:hover:not([disabled])": {
  //   cursor: "pointer",
  //   backgroundColor: "red", //${baseTheme.colors['grey50']}},
  // },
  // "&:focus": {
  //   cursor: "pointer",
  //   backgroundColor: "red", //${baseTheme.colors['grey50']}},
  // },
  "&[disabled]": {
    opacity: 0.5,
    cursor: "auto",
    pointerEvents: "none",
    // img {
    //   filter: grayscale(100%),
    // };
  },
});

Item.defaultProps = {
  highlight: false,
};

Item.propTypes = {
  // if selected change background-color
  highlight: PropTypes.bool,
};

const AutocompleteListItem = ({
  children,
  id,
  index,
  value,
  itemColor,
  disabled,
  ...rest
}) => {
  const { highlightedIndex, getItemProps } = useAutocompleteState();
  const { onClick, ...restItemProps } = getItemProps({ item: value, index });
  console.log(
    "highlightedIndex === index",
    highlightedIndex === index,
    restItemProps
  );
  return (
    <Item
      key={`${id}${index}`}
      itemColor={itemColor}
      {...rest}
      //disabled={disabled}
      // highlight={highlightedIndex === index}
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
  /** Select background-color from winery palette */
  itemColor: PropTypes.string,
};

export { AutocompleteListItem };
