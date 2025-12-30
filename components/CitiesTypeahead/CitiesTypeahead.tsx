import React, { useState } from "react";
import { Typeahead } from "components/Autocomplete/Typeahead";
import WithLabel from "components/SubmitGame/WithLabel";
import { useCities } from "hooks/useCities";
import { DropdownItemType } from "types/types";

export interface CitiesTypeaheadProps {
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

const CitiesTypeahead: React.FC<CitiesTypeaheadProps> = ({
  labelText,
  selectedItem,
  onSelect,
  placeholder,
  onBlur,
  css,
  error = false,
  debounceTime = 300,
  minChars = 3,
  listWidth = "500px",
  ...rest
}) => {
  const [input, setInput] = useState("");
  const { data: cities, isLoading } = useCities(input);

  const onChange = (localInput: string) => {
    setInput(localInput);
  };

  // Transform cities data to DropdownItemType format
  const cityItems: DropdownItemType[] = cities?.map((city) => ({
    value: city.id,
    text: city.name,
  })) || [];

  // Filter cities based on input (client-side filtering for better UX)
  const filteredCities = cityItems.filter((city) => {
    if (!input || input.length < minChars) return false;
    return city.text?.toLowerCase().includes(input.toLowerCase());
  });

  // Find selected item
  const selectedItemParsed = cityItems.find((city) => 
    city.value === selectedItem?.toString()
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
          {...rest}
        />
        {filteredCities.length > 0 && (
          <Typeahead.List css={{ width: listWidth }}>
            {filteredCities.map(({ value, text }, index) => (
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
              Loading cities...
            </div>
          </Typeahead.List>
        )}
        {!isLoading && input.length >= minChars && filteredCities.length === 0 && (
          <Typeahead.List css={{ width: listWidth }}>
            <div style={{ padding: '8px', textAlign: 'center', color: '#666' }}>
              No cities found
            </div>
          </Typeahead.List>
        )}
      </Typeahead>
    </WithLabel>
  );
};

export default CitiesTypeahead;
