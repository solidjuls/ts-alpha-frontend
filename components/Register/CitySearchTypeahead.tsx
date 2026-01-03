import React, { useMemo, useState } from "react";
import { Typeahead } from "components/Autocomplete/Typeahead";
import { DropdownItemType } from "types/types";
import { useCities } from "hooks/useCities";

type CitySearchTypeaheadProps = {
  selectedItem: string;
  onSelect: (value: DropdownItemType | null | undefined) => void;
  placeholder: string;
  onBlur: () => void;
  css?: React.CSSProperties;
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
  const [input, setInput] = useState("");
  const { data: cities, isLoading } = useCities(input);

  const cityItems: DropdownItemType[] = useMemo(
    () =>
      (cities || []).map((city: any) => ({
        value: city.id,
        text: city.name,
      })),
    [cities],
  );

  const selectedItemParsed =
    cityItems.find((city) => city.value === selectedItem) || null;

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
        label="City"
        placeholder={placeholder}
        error={error}
        width="100%"
      />

      <Typeahead.List css={{ width: "100%" }} noResultsCustomText="No Cities Found">
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
        ) : cityItems.length > 0 ? (
          cityItems.map(({ value, text }, index) => (
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
            value={{ value: "__empty__", text: "No Cities Found" }}
            index={0}
            id="empty"
            disabled
          >
            <div style={{ opacity: 0.8 }}>No Cities Found</div>
          </Typeahead.Item>
        )}
      </Typeahead.List>
    </Typeahead>
  );
};

export default CitySearchTypeahead;
