import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { Typeahead } from "components/Autocomplete/Typeahead";
import WithLabel from "./WithLabel";
import { DropdownItemType } from "types/types";

export interface UserTypeaheadProps {
  labelText: string;
  selectedItem: string | number | null;
  onSelect: (value: DropdownItemType | null) => void;
  placeholder: string;
  onBlur?: () => void;
  css?: React.CSSProperties;
  error?: boolean;
  debounceTime?: number;
  width?: string;
  minChars?: number;
  listWidth?: string;
  users: DropdownItemType[];
}

const TypeaheadScope = styled.div`
  width: 100%;
  min-width: 0;

  [role="option"] {
    cursor: pointer;
  }

  [role="option"]:hover,
  [role="option"][aria-selected="true"] {
    background-color: var(--ussr);
    color: var(--alt-text);
  }

  [role="option"] * {
    color: inherit;
  }
`;

const EmptyState = styled.div`
  padding: 10px 12px;
  text-align: center;
  color: var(--primary-text);
  opacity: 0.75;
`;

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

  // Find selected user (convert selectedItem to string for comparisons)
  const selectedItemParsed =
    users.find((u) => u.value === (selectedItem ?? "").toString()) || null;

  // Keep input showing selected user's name when selection changes
  useEffect(() => {
    if (selectedItemParsed?.text) {
      setInput(selectedItemParsed.text);
    }
  }, [selectedItemParsed]);

  const filteredUsers = useMemo(() => {
    // If user hasn't typed enough yet, show nothing (less noisy)
    if (!input || input.length < minChars) return [];

    const q = input.toLowerCase();
    return users.filter((u) => (u.text || "").toLowerCase().includes(q));
  }, [input, minChars, users]);

  const showList = input.length >= minChars;

  return (
    <WithLabel labelText={labelText}>
      <Typeahead
        debounceTime={debounceTime}
        onChange={(localInput) => setInput(localInput)}
        minChars={minChars}
        onSelect={(value) => onSelect(value || null)}
        selectedValue={selectedItemParsed}
        onBlur={onBlur}
        css={{ width: "100%", ...css }}
        {...rest}
      >
        <TypeaheadScope>
          <Typeahead.Input
            label={labelText}
            error={error}
            placeholder={placeholder}
            width="100%"
          />

          {showList && (
            <Typeahead.List
              css={{ width: listWidth }}
              noResultsCustomText="No users found"
            >
              {filteredUsers.length > 0 ? (
                filteredUsers.map(({ value, text }, index) => (
                  <Typeahead.Item
                    key={value}
                    value={{ value, text }}
                    index={index}
                    id={value}
                    disabled={false}
                  >
                    <div>{text}</div>
                  </Typeahead.Item>
                ))
              ) : (
                <EmptyState>No users found</EmptyState>
              )}
            </Typeahead.List>
          )}
        </TypeaheadScope>
      </Typeahead>
    </WithLabel>
  );
};

export default UserTypeahead;
