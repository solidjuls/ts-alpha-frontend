import React, { useCallback, useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { useDebounce } from "use-debounce";
import Downshift from "downshift";
import { AutocompleteInput, AutocompleteList, AutocompleteListItem } from "./components";
import { AutocompleteProvider } from "./AutocompleteContext";
import { Box } from "components/Atoms";

const Typeahead = ({
  debounceTime,
  onChange,
  minChars,
  onSelect,
  selectedValue,
  selectedInputProperty,
  children,
  onBlur,
  error,
  id,
  resetOnSelect,
}) => {
  const [value, setValue] = useState(selectedValue);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm] = useDebounce(searchTerm, debounceTime);

  useEffect(() => {
    if (debouncedTerm) {
      onChange(debouncedTerm);
    }
  }, [debouncedTerm]);
  // Required to autofill input from outside
  useEffect(() => {
    // clear input value
    if (!selectedValue || Object.keys(selectedValue).length === 0) {
      setValue(selectedValue);
    }
    if (
      selectedValue?.[selectedInputProperty] &&
      selectedValue?.[selectedInputProperty] !== value?.[selectedInputProperty]
    ) {
      setValue(selectedValue);
    }
  }, [selectedValue, selectedInputProperty, value]);

  /**
   * State machine for the downshift component, here the state of the component can be managed in any way. Details explained here: https://github.com/downshift-js/downshift#onstatechange
   * @param {object} changes - Possible values: {highlightedIndex: number, inputValue: string, isOpen: boolean, selectedItem: any, type: statechangetypes}. https://github.com/downshift-js/downshift#statechangetypes
   */
  const manageState = (changes, actions) => {
    if (changes.hasOwnProperty("selectedItem")) {
      if (changes.selectedItem) {
        !resetOnSelect && setValue(changes.selectedItem);
        onSelect(changes.selectedItem);
        resetOnSelect && actions.clearSelection();
      }
    } else if (changes.hasOwnProperty("inputValue")) {
      if (changes?.inputValue?.length === 0) {
        onBlur && onBlur();
        setValue({});
        setSearchTerm("");
      }
      if (changes.inputValue && changes.inputValue.length >= minChars) {
        setSearchTerm(changes.inputValue);
      }
    }
  };

  const resetState = () => {
    onBlur && onBlur();
    onSelect({});
    onChange("");
  };

  const handleStateChange = (changes, actions) => {
    if (changes.type === Downshift.stateChangeTypes.keyDownEscape) {
      resetState();
    } else {
      manageState(changes, actions);
    }
  };

  return (
    <Downshift
      selectedItem={value}
      itemToString={(item) => item?.[selectedInputProperty] || ""}
      onStateChange={handleStateChange}
    >
      {({
        getRootProps,
        getInputProps,
        getToggleButtonProps,
        getMenuProps,
        getItemProps,
        isOpen,
        highlightedIndex,
      }) => (
        <Box
          {...getRootProps({})}
          css={{
            display: "block",
          }}
        >
          <AutocompleteProvider
            value={{
              isOpen,
              id,
              error,
              getInputProps,
              getToggleButtonProps,
              getMenuProps,
              getItemProps,
              highlightedIndex,
            }}
          >
            {children}
          </AutocompleteProvider>
        </Box>
      )}
    </Downshift>
  );
};

Typeahead.propTypes = {
  /** Unique id attribute */
  id: PropTypes.string,
  /** Number of characters that trigger the execution of the callback */
  minChars: PropTypes.number,
  /** Number of milliseconds from the input value change to the callback being triggered */
  debounceTime: PropTypes.number,
  /** Handler triggered when the user remove the value of the input element */
  onBlur: PropTypes.func,
  /** Handler triggered when the user selects a new value */
  onSelect: PropTypes.func,
  /** Property displayed into the input component when an item has been selected from the list*/
  selectedInputProperty: PropTypes.string,
  /** Components that will be rendered  */
  children: PropTypes.node,
  /** Selected value */
  selectedValue: PropTypes.object,
  /** Function executed when the input value changes. Receives the current input value as param */
  onChange: PropTypes.func,
  /** Resets the selected value when has been selected */
  resetOnSelect: PropTypes.bool,
};

Typeahead.Input = AutocompleteInput;
Typeahead.List = AutocompleteList;
Typeahead.Item = AutocompleteListItem;

export { Typeahead };
