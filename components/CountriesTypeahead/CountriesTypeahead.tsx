import React, { useState } from "react";
import { Typeahead } from "components/Autocomplete/Typeahead";
import WithLabel from "components/SubmitGame/WithLabel";
import { useCountries } from "hooks/useCountries";
import { DropdownItemType } from "types/types";

export interface CountriesTypeaheadProps {
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
}

const CountriesTypeahead: React.FC<CountriesTypeaheadProps> = ({
  labelText,
  selectedItem,
  onSelect,
  placeholder,
  onBlur,
  css,
  error = false,
  debounceTime = 300,
  minChars = 3,
  listWidth = "320px",
  ...rest
}) => {
  const [input, setInput] = useState("");
  const { data: countries, isLoading } = useCountries(input);

  const onChange = (localInput: string) => {
    setInput(localInput);
  };

  // Transform countries data to DropdownItemType format
  const countryItems: DropdownItemType[] = countries?.map((country) => ({
    value: country.id,
    text: country.country_name,
  })) || [];

  // Filter countries based on input (client-side filtering for better UX)
  const filteredCountries = countryItems.filter((country) => {
    if (!input || input.length < minChars) return false;
    return country.text?.toLowerCase().includes(input.toLowerCase());
  });

  // Find selected item
  const selectedItemParsed = countryItems.find((country) => 
    country.value === selectedItem?.toString()
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
        {filteredCountries.length > 0 && (
          <Typeahead.List css={{ width: listWidth }}>
            {filteredCountries.map(({ value, text }, index) => (
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
        {isLoading && input.length >= minChars && (
          <Typeahead.List css={{ width: listWidth }}>
            <div style={{ padding: '8px', textAlign: 'center', color: '#666' }}>
              Loading countries...
            </div>
          </Typeahead.List>
        )}
        {!isLoading && input.length >= minChars && filteredCountries.length === 0 && (
          <Typeahead.List css={{ width: listWidth }}>
            <div style={{ padding: '8px', textAlign: 'center', color: '#666' }}>
              No countries found
            </div>
          </Typeahead.List>
        )}
      </Typeahead>
    </WithLabel>
  );
};

export default CountriesTypeahead;
