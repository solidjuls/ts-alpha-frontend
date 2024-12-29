import { useState } from "react";
import { Typeahead } from "components/Autocomplete/Typeahead";
import WithLabel from "./WithLabel";

const UserTypeahead = ({ labelText, users, selectedItem, onSelect, placeholder, css, error, ...rest }) => {
  const [input, setInput] = useState("");
  const onChange = (input) => {
    setInput(input)
  }
  const userSuggestions = users?.filter((user) => {
    if (user.text.toLowerCase().includes(input.toLowerCase())) {
      return true;
    }
  })
  return (
    <WithLabel labelText={labelText}>
      <Typeahead
        debounceTime={300}
        onChange={onChange}
        minChars={1}
        // selectedValueProperty="value"
        selectedInputProperty="text"
        onSelect={onSelect}
        selectedValue={selectedItem}
        // onBlur={setValue}
        {...rest}
      >
        <Typeahead.Input css={css} error={error} placeholder={placeholder} />
        {userSuggestions.length > 0 && (
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
