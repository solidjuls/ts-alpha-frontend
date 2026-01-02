// Typeahead.tsx
import React, { ReactNode, useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import Downshift, { ControllerStateAndHelpers, StateChangeOptions } from "downshift";
import { AutocompleteInput, AutocompleteList, AutocompleteListItem } from "./components";
import { AutocompleteProvider } from "./AutocompleteContext";
import { DropdownItemType } from "types/types";
import styled from "styled-components";

type TypeaheadProps = {
  debounceTime: number;
  onChange: (value: string) => void;
  minChars: number;
  onSelect: (obj: DropdownItemType | null | undefined) => void;
  selectedValue: DropdownItemType | null | undefined;
  children: ReactNode;
  onBlur?: () => void;
  width?: string;
  error?: boolean;
  id?: string;
  resetOnSelect?: boolean;
  css?: React.CSSProperties;
};

const TypeaheadRoot = styled.div`
  display: block;
  font-family: var(--font-body);
  color: var(--primary-text);
`;

const Typeahead: React.FC<TypeaheadProps> & {
  Input: typeof AutocompleteInput;
  List: typeof AutocompleteList;
  Item: typeof AutocompleteListItem;
} = ({
  debounceTime,
  onChange,
  minChars,
  onSelect,
  selectedValue,
  children,
  onBlur,
  error,
  id,
  resetOnSelect,
  css,
}) => {
  const [value, setValue] = useState<DropdownItemType | null | undefined>(selectedValue);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm] = useDebounce(searchTerm, debounceTime);

  useEffect(() => {
    if (debouncedTerm) {
      onChange(debouncedTerm);
    }
  }, [debouncedTerm, onChange]);

  useEffect(() => {
    if (selectedValue?.text && selectedValue?.text !== value?.text) {
      setValue(selectedValue);
    }
  }, [selectedValue, value]);

  const manageState = (
    changes: StateChangeOptions<DropdownItemType>,
    actions: ControllerStateAndHelpers<DropdownItemType>,
  ) => {
    if (Object.prototype.hasOwnProperty.call(changes, "selectedItem")) {
      if (changes.selectedItem) {
        !resetOnSelect && setValue(changes.selectedItem);
        onSelect(changes.selectedItem);
        resetOnSelect && actions.clearSelection();
      }
    } else if (Object.prototype.hasOwnProperty.call(changes, "inputValue")) {
      if (changes?.inputValue?.length === 0) {
        onBlur && onBlur();
        setValue(null);
        setSearchTerm("");
      }
      if (changes.inputValue && changes.inputValue.length >= minChars) {
        setSearchTerm(changes.inputValue);
      }
    }
  };

  const resetState = () => {
    onBlur && onBlur();
    onSelect(null);
    onChange("");
  };

  const handleStateChange = (
    changes: StateChangeOptions<DropdownItemType>,
    actions: ControllerStateAndHelpers<DropdownItemType>,
  ) => {
    if (changes.type === Downshift.stateChangeTypes.keyDownEscape) {
      resetState();
    } else {
      manageState(changes, actions);
    }
  };

  return (
    <Downshift
      selectedItem={value}
      itemToString={(item) => item?.text || ""}
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
        <TypeaheadRoot
          {...getRootProps(undefined, undefined)}
          style={{
            ...css,
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
        </TypeaheadRoot>
      )}
    </Downshift>
  );
};

Typeahead.Input = AutocompleteInput;
Typeahead.List = AutocompleteList;
Typeahead.Item = AutocompleteListItem;

export { Typeahead };
