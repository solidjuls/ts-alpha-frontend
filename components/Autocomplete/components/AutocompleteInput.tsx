import React from "react";
import { Input } from "components/Input";
import PropTypes from "prop-types";
import { useAutocompleteState } from "../AutocompleteContext";

type AutocompleteInputProps = {
  label: string;
  placeholder: string;
  error: boolean;
};
const AutocompleteInput: React.FC<AutocompleteInputProps> = ({
  label,
  width,
  resetIcon = "ShapeCrossCircle",
  placeholder,
  error,
  ...rest
}) => {
  const { getInputProps, openMenu } = useAutocompleteState();
  return (
    <div>
      <Input
        {...getInputProps({
          placeholder,
          label,
          onFocus: openMenu,
        })}
        datatest-id="inputText"
        // resetIcon={resetIcon}
        // icon=""
        {...rest}
        width={width}
        border={error ? "error" : undefined}
      />
    </div>
  );
};

export { AutocompleteInput };
