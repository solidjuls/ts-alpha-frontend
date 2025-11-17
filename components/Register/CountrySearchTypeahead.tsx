import React, { useState } from 'react';
import { Typeahead } from 'components/Autocomplete/Typeahead';
import { DropdownItemType } from 'types/types';
import { useCountries } from 'hooks/useCountries';

type CountrySearchTypeaheadProps = {
  selectedItem: string;
  onSelect: (value: DropdownItemType | null | undefined) => void;
  placeholder: string;
  onBlur: () => void;
  css: any;
  error: boolean;
};

const CountrySearchTypeahead: React.FC<CountrySearchTypeaheadProps> = ({
  selectedItem,
  onSelect,
  placeholder,
  onBlur,
  css,
  error,
  ...rest
}) => {
  const [input, setInput] = useState('');
  const { data: countries, isLoading } = useCountries(input);

  const onChange = (localInput: string) => {
    setInput(localInput);
  };

  // Convert countries to dropdown items
  const countryItems = countries?.map(country => ({
    value: country.id,
    text: country.country_name,
  })) || [];

  // Find selected item
  const selectedItemParsed = countryItems.find(country => country.value === selectedItem) || null;

  return (
    <Typeahead
      debounceTime={300}
      onChange={onChange}
      minChars={3}
      onSelect={onSelect}
      selectedValue={selectedItemParsed}
      onBlur={onBlur}
      {...rest}
    >
      <Typeahead.Input error={error} placeholder={placeholder} {...css} />
      {countryItems?.length > 0 && (
        <Typeahead.List css={{ width: "100%" }} noResultsCustomText="No countries found">
          {countryItems.map(({ value, text }, index) => (
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
    </Typeahead>
  );
};

export default CountrySearchTypeahead;
