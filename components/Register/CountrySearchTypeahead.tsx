import React, { useMemo, useState } from "react";
import { Typeahead } from "components/Autocomplete/Typeahead";
import { DropdownItemType } from "types/types";
import { useCountries } from "hooks/useCountries";

type CountrySearchTypeaheadProps = {
  selectedItem: string;
  onSelect: (value: DropdownItemType | null | undefined) => void;
  placeholder: string;
  onBlur: () => void;
  css?: React.CSSProperties;
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
  const [input, setInput] = useState("");
  const { data: countries, isLoading } = useCountries(input);

  const countryItems: DropdownItemType[] = useMemo(
    () =>
      (countries || []).map((country: any) => ({
        value: country.id,
        text: country.country_name,
      })),
    [countries],
  );

  const selectedItemParsed =
    countryItems.find((country) => country.value === selectedItem) || null;

  return (
    <Typeahead
      debounceTime={300}
      onChange={(localInput: string) => setInput(localInput)}
      minChars={3}
      onSelect={onSelect}
      selectedValue={selectedItemParsed}
      onBlur={onBlur}
      error={error}
      resetOnSelect
      css={{ width: "100%", ...css }}
      {...rest}
    >
      <Typeahead.Input
        label="Country"
        placeholder={placeholder}
        error={error}
        width="100%"
      />

      <Typeahead.List css={{ width: "100%" }} noResultsCustomText="No Countries Found">
        {isLoading ? (
          <Typeahead.Item
            key="loading"
            value={{ value: "__loading__", text: "Loading..." }}
            index={0}
            id="loading"
            disabled
          >
            <div style={{ opacity: 0.8 }}>Loading…</div>
          </Typeahead.Item>
        ) : countryItems.length > 0 ? (
          countryItems.map(({ value, text }, index) => (
            <Typeahead.Item
              key={value}
              value={{ value, text }}
              index={index}
              id={value}
              disabled={false}
            >
              <div>{text}</div>
            </Typeahead.Item>
          ))
        ) : (
          <Typeahead.Item
            key="empty"
            value={{ value: "__empty__", text: "No Countries Found" }}
            index={0}
            id="empty"
            disabled
          >
            <div style={{ opacity: 0.8 }}>No Countries Found</div>
          </Typeahead.Item>
        )}
      </Typeahead.List>
    </Typeahead>
  );
};

export default CountrySearchTypeahead;
