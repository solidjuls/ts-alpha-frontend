import { useState } from "react";
import { trpc } from "contexts/APIProvider";
import { Typeahead } from "components/Autocomplete/Typeahead";
import WithLabel from "./WithLabel";

const useTypeaheadState = () => {
  const { data } = trpc.useQuery(["user-get-all"]);
  const userList = data?.map((user) => ({ value: user.id, text: user.name })) || [];
  const [userSuggestions, setUserSuggestions] = useState([]);
  //console.log("userList", userList);
  const onChange = (input) => {
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
const UserTypeahead = ({ labelText, selectedItem, onSelect, css, error, ...rest }) => {
  const { userSuggestions, onChange } = useTypeaheadState();

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
        <Typeahead.Input css={css} error={error} placeholder="Type the player name..." />
        {userSuggestions.length > 0 && (
          <Typeahead.List css={css}>
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
