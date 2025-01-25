import { useState } from "react";
import { Typeahead } from "components/Autocomplete/Typeahead";
import WithLabel from "../submitform/WithLabel";
import getAxiosInstance from "utils/axios";

const useTypeaheadState = () => {
  const [citySuggestions, setCitySuggestions] = useState([]);

  // const { data, error } = useFetchInitialData({ url: "/api/cities" });
  // if (!data) return null;

  // const citiesList = data.map((city) => ({ value: city.id, text: city.name })) || [];
  const onChange = async (input) => {
    const { data } = await getAxiosInstance().get(`/api/cities?q=${input}`);
    setCitySuggestions(data?.map((city) => ({ value: city.id, text: city.name })) || []);
  };

  return { citySuggestions, onChange };
};

const CitiesTypeahead = ({
  labelText,
  selectedItem,
  items,
  onSelect,
  placeholder,
  onBlur,
  css,
  error,
  ...rest
}) => {
  // const { citySuggestions, onChange } = useTypeaheadState();

  const [input, setInput] = useState("");
  const onChange = (input) => {
    setInput(input);
  };
  const citySuggestions = items?.filter((city) => {
    if (city.text.toLowerCase().includes(input.toLowerCase())) {
      return true;
    }
  });

  const selectedItemParsed = citySuggestions?.find((city) => city.value === selectedItem) || {};

  return (
    <WithLabel labelText={labelText}>
      <Typeahead
        debounceTime={300}
        onChange={onChange}
        minChars={1}
        // selectedValueProperty="value"
        selectedInputProperty="text"
        onSelect={onSelect}
        selectedValue={selectedItemParsed}
        onBlur={onBlur}
        {...rest}
      >
        <Typeahead.Input css={css} error={error} placeholder={placeholder} />
        {citySuggestions?.length > 0 && (
          <Typeahead.List css={{ ...css, width: "500px" }}>
            {citySuggestions.map(({ value, text }, index) => (
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

export default CitiesTypeahead;
