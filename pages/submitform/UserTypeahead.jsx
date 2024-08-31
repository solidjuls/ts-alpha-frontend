import { useState } from "react";
import { Typeahead } from "components/Autocomplete/Typeahead";
import WithLabel from "./WithLabel";
import useFetchInitialData from "hooks/useFetchInitialData";

const useTypeaheadState = () => {
  const [userSuggestions, setUserSuggestions] = useState([]);

  const { data, error } = useFetchInitialData({ url: "/api/user" });
  if (!data) return null;
  console.log(data);
  const userList = data.map((user) => ({ value: user.id, text: user.name })) || [];

  const onChange = (input) => {
    console.log("onChange executed", input);
    setUserSuggestions(
      userList?.filter((user) => {
        if (user.text.toLowerCase().includes(input.toLowerCase())) {
          return true;
        }
      }),
    );
  };

  return { userSuggestions, onChange };
};
const UserTypeahead = ({ labelText, selectedItem, onSelect, placeholder, css, error, ...rest }) => {
  const { userSuggestions, onChange } = useTypeaheadState();
  console.log("rerender");
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
          <Typeahead.List css={{ ...css, width: "270px" }}>
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
