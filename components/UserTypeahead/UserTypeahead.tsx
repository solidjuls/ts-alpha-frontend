import React, { useState } from "react";
import { Typeahead } from "components/Autocomplete/Typeahead";
import WithLabel from "components/SubmitGame/WithLabel";
import { useAllUsers } from "hooks/useUsers";
import { DropdownItemType } from "types/types";
import { UsersListResponse } from "services/users.service";

export interface UserTypeaheadProps {
  labelText: string;
  selectedItem: string | number | null;
  onSelect: (value: DropdownItemType | null) => void;
  placeholder: string;
  onBlur?: () => void;
  css?: any;
  error?: boolean;
  debounceTime?: number;
  minChars?: number;
  listWidth?: string;
  pageSize?: number;
}

const UserTypeahead: React.FC<UserTypeaheadProps> = ({
  labelText,
  selectedItem,
  onSelect,
  placeholder,
  onBlur,
  error = false,
  debounceTime = 300,
  minChars = 1,
  listWidth = "100%",
  pageSize = 100,
  ...rest
}) => {
  const [input, setInput] = useState("");
  const { data: usersData, isLoading } = useAllUsers(1, pageSize, input.length >= minChars ? input : undefined) as {
    data: UsersListResponse | undefined;
    isLoading: boolean;
  };

  const onChange = (localInput: string) => {
    setInput(localInput);
  };

  const userItems: DropdownItemType[] = usersData?.results?.map((user: any) => ({
    value: user.id,
    text: user?.name.trim(),
  })) || [];

  const filteredUsers = userItems.filter((user) => {
    if (!input || input.length < minChars) return true; // Show all if no input or below min chars
    return user.text?.toLowerCase().includes(input.toLowerCase());
  });

  const selectedItemParsed = userItems.find((user) => 
    user.value === selectedItem?.toString()
  ) || null;

  return (
    <WithLabel labelText={labelText}>
      <Typeahead
        debounceTime={debounceTime}
        onChange={onChange}
        minChars={minChars}
        onSelect={(value) => onSelect(value || null)}
        selectedValue={selectedItemParsed}
        onBlur={onBlur}
        {...rest}
      >
        <Typeahead.Input
          label={labelText}
          error={error}
          placeholder={placeholder}
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
        {!isLoading && input.length >= minChars && filteredUsers.length === 0 && (
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
