import React, { useState, useEffect } from "react";
import { Typeahead } from "components/Autocomplete/Typeahead";
import WithLabel from "./WithLabel";
import { DropdownItemType } from "types/types";

export interface UserTypeaheadProps {
  labelText: string;
  selectedItem: string | number | null;
  onSelect: (value: DropdownItemType | null) => void;
  placeholder: string;
  onBlur?: () => void;
  css?: any;
  error?: boolean;
  debounceTime?: number;
  width?: string;
  minChars?: number;
  listWidth?: string;
  users: DropdownItemType[]; // Users passed as prop instead of API call
}

const UserTypeahead: React.FC<UserTypeaheadProps> = ({
  labelText,
  selectedItem,
  onSelect,
  placeholder,
  onBlur,
  css,
  error = false,
  debounceTime = 300,
  minChars = 1,
  listWidth = "100%",
  users = [],
  ...rest
}) => {
  const [input, setInput] = useState("");

  const onChange = (localInput: string) => {
    setInput(localInput);
  };

  // Client-side filtering
  const filteredUsers = users.filter((user) => {
    if (!input || input.length < minChars) return true; // Show all if no input or below min chars
    return user.text?.toLowerCase().includes(input.toLowerCase());
  });

  // Find selected item and set input to show selected user name
  const selectedItemParsed = users.find((user) => 
    user.value === selectedItem?.toString()
  ) || null;

  // Set input to selected user's name when selectedItem changes
  useEffect(() => {
    if (selectedItemParsed) {
      setInput(selectedItemParsed.text || "");
    }
  }, [selectedItemParsed]);

  return (
    <WithLabel labelText={labelText}>
      <Typeahead
        debounceTime={debounceTime}
        onChange={onChange}
        minChars={minChars}
        onSelect={(value) => onSelect(value || null)}
        selectedValue={selectedItemParsed}
        onBlur={onBlur}
        css={css}
        {...rest}
      >
        <Typeahead.Input
          label={labelText}
          error={error}
          placeholder={placeholder}
          {...rest}
        />
        {filteredUsers.length > 0 && (
          <Typeahead.List css={{ width: listWidth }}>
            {filteredUsers.map(({ value, text }, index) => (
              <Typeahead.Item 
                key={value} 
                value={{ value, text }} 
                index={index} 
                id={value}
                itemColor="grey50"
                disabled={false}
              >
                <div>{text}</div>
              </Typeahead.Item>
            ))}
          </Typeahead.List>
        )}
        {input.length >= minChars && filteredUsers.length === 0 && (
          <Typeahead.List css={{ width: listWidth }}>
            <div style={{ padding: '8px', textAlign: 'center', color: '#666' }}>
              No users found
            </div>
          </Typeahead.List>
        )}
      </Typeahead>
    </WithLabel>
  );
};

export default UserTypeahead;
