import { useState } from "react";
import { Typeahead } from "components/Autocomplete/Typeahead";
import WithLabel from "./WithLabel";
import { DropdownItemType } from "types/types";

type UserTypeaheadProps = {
  labelText: string;
  users: DropdownItemType[];
  selectedItem: string;
  onSelect: (item: DropdownItemType) => void;
  placeholder: string;
  css: any;
  error: boolean;
};

const UserTypeahead: React.FC<UserTypeaheadProps> = ({
  labelText,
  users,
  selectedItem,
  onSelect,
  placeholder,
  css,
  error,
  ...rest
}) => {
  const [input, setInput] = useState("");
  const onChange = (input: string) => {
    setInput(input);
  };
  const userSuggestions = users?.filter((user) => {
    if (user.text.toLowerCase().includes(input.toLowerCase())) {
      return true;
    }
  });
  const selectedItemParsed = userSuggestions?.find((user) => user.value === selectedItem) || null;
  return (
    <WithLabel labelText={labelText}>
      <Typeahead
        debounceTime={300}
        onChange={onChange}
        minChars={1}
        onSelect={onSelect}
        selectedValue={selectedItemParsed}
        // onBlur={setValue}
        {...rest}
      >
        <Typeahead.Input css={css} error={error} placeholder={placeholder} />
        {userSuggestions?.length > 0 && (
          <Typeahead.List css={{ ...css }}>
            {userSuggestions.map(({ value, text }, index) => (
              <Typeahead.Item key={value} value={{ value, text }} index={index} id={value}>
                <div>{text}</div>
              </Typeahead.Item>
            ))}
          </Typeahead.List>
        )}
      </Typeahead>
    </WithLabel>
  );
};

export default UserTypeahead;
