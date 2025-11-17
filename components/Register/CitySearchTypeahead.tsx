import React, { useState } from 'react';
import { Typeahead } from 'components/Autocomplete/Typeahead';
import { DropdownItemType } from 'types/types';
import { useCities } from 'hooks/useCities';

type CitySearchTypeaheadProps = {
  selectedItem: string;
  onSelect: (value: DropdownItemType | null | undefined) => void;
  placeholder: string;
  onBlur: () => void;
  css: any;
  error: boolean;
};

const CitySearchTypeahead: React.FC<CitySearchTypeaheadProps> = ({
  selectedItem,
  onSelect,
  placeholder,
  onBlur,
  css,
  error,
  ...rest
}) => {
  const [input, setInput] = useState('');
  const { data: cities, isLoading } = useCities(input);

  const onChange = (localInput: string) => {
    setInput(localInput);
  };

  // Convert cities to dropdown items
  const cityItems = cities?.map(city => ({
    value: city.id,
    text: city.name,
  })) || [];

  // Find selected item
  const selectedItemParsed = cityItems.find(city => city.value === selectedItem) || null;

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
      {cityItems?.length > 0 && (
        <Typeahead.List css={{ width: "100%" }} noResultsCustomText="No cities found">
          {cityItems.map(({ value, text }, index) => (
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

export default CitySearchTypeahead;
