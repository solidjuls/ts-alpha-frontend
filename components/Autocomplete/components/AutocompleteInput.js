import React from "react";
import { Input } from "components/Input";
import PropTypes from "prop-types";
import { useAutocompleteState } from "../AutocompleteContext";

const AutocompleteInput = ({
  icon,
  resetIcon,
  label,
  placeholder,
  ...rest
}) => {
  const { getInputProps, openMenu } = useAutocompleteState();

  return (
    <div display="block" position="relative">
      <Input
        {...getInputProps({
          placeholder,
          label,
          onFocus: openMenu,
        })}
        datatest-id="inputText"
        icon={icon}
        resetIcon={resetIcon}
        {...rest}
      />
    </div>
  );
};

AutocompleteInput.defaultProps = {
  icon: "",
  resetIcon: "ShapeCrossCircle",
};

AutocompleteInput.propTypes = {
  /** icon name from winery Icons */
  icon: PropTypes.string,
  resetIcon: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string,
};

export { AutocompleteInput };
