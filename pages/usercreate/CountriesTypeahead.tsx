import { useState } from "react";
import { Typeahead } from "components/Autocomplete/Typeahead";
import WithLabel from "../submitform/WithLabel";
import { DropdownItemType } from "types/types";

type CountriesTypeaheadProps = {
  labelText: string;
  selectedItem: string;
  items: DropdownItemType[];
  onSelect: (value: DropdownItemType) => void;
  placeholder: string;
  onBlur: any;
  css: any;
  error: boolean;
};

const CountriesTypeahead: React.FC<CountriesTypeaheadProps> = ({
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
  const [input, setInput] = useState("");
  const onChange = (localInput: string) => {
    setInput(localInput);
  };
  const countriesSuggestions = items?.filter((country) => {
    if (country.text.toLowerCase().includes(input.toLowerCase())) {
      return true;
    }
  });

  const selectedItemParsed =
    countriesSuggestions?.find((country) => country.value === selectedItem) || null;

  return (
    <WithLabel labelText={labelText}>
      <Typeahead
        debounceTime={300}
        onChange={onChange}
        minChars={1}
        onSelect={onSelect}
        selectedValue={selectedItemParsed}
        onBlur={onBlur}
        {...rest}
      >
        <Typeahead.Input css={css} error={error} placeholder={placeholder} />
        {countriesSuggestions?.length > 0 && (
          <Typeahead.List css={{ width: "320px" }}>
            {countriesSuggestions.map(({ value, text }, index) => (
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

export default CountriesTypeahead;
