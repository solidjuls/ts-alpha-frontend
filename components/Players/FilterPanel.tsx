import React from "react";
import { MultiSelectCombobox, Option } from "components/MultiSelectCombobox/MultiSelectCombobox";
import { FilterPanel as StyledFilterPanel } from "components/Homepage/Homepage.styles";
import { SelectOption } from "./Players.types";
import { MultiSelectItemType } from "types/types";
import { FilterSelectContainer, FilterDivider } from "./Players.styles";

interface FilterPanelProps {
  playerInputValue: string;
  setPlayerInputValue: (value: string) => void;
  countryInputValue: string;
  setCountryInputValue: (value: string) => void;
  playdekInputValue: string;
  setPlaydekInputValue: (value: string) => void;
  playerOptions: SelectOption[];
  countryOptions: SelectOption[];
  playdekOptions: SelectOption[];
  playersSelected: MultiSelectItemType[];
  countriesSelected: string[];
  playdekSelected: MultiSelectItemType[];
  handlePlayerChange: (selectedOptions: any) => void;
  handleCountryChange: (selectedOptions: any) => void;
  handlePlaydekChange: (selectedOptions: any) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  playerInputValue,
  setPlayerInputValue,
  countryInputValue,
  setCountryInputValue,
  playdekInputValue,
  setPlaydekInputValue,
  playerOptions,
  countryOptions,
  playdekOptions,
  playersSelected,
  countriesSelected,
  playdekSelected,
  handlePlayerChange,
  handleCountryChange,
  handlePlaydekChange,
}) => {
  // Convert selected values to string arrays for MultiSelectCombobox
  const playerSelectedValues = playersSelected.map((item) => item.code);
  const playdekSelectedValues = playdekSelected.map((item) => item.code);

  return (
    <StyledFilterPanel>
      <FilterSelectContainer>
        <MultiSelectCombobox
          options={playerOptions}
          selected={playerSelectedValues}
          onChange={(selected) => {
            // Convert selected string[] to the format expected by handlePlayerChange
            const selectedOptions = selected.map((value) => {
              const option = playerOptions.find((opt) => opt.value === value);
              return { value: option?.value || "", label: option?.label || "" };
            });
            handlePlayerChange(selectedOptions);
          }}
          placeholder="Select Players..."
          maxDisplayItems={2}
        />
        <FilterDivider />
      </FilterSelectContainer>

      <FilterSelectContainer>
        <MultiSelectCombobox
          options={countryOptions}
          selected={countriesSelected}
          onChange={(selected) => {
            // Convert selected string[] to the format expected by handleCountryChange
            const selectedOptions = selected.map((value) => {
              const option = countryOptions.find((opt) => opt.value === value);
              return { value: option?.value || "", label: option?.label || "" };
            });
            handleCountryChange(selectedOptions);
          }}
          placeholder="Select Countries..."
          maxDisplayItems={2}
        />
        <FilterDivider />
      </FilterSelectContainer>

      <MultiSelectCombobox
        options={playdekOptions}
        selected={playdekSelectedValues}
        onChange={(selected) => {
          // Convert selected string[] to the format expected by handlePlaydekChange
          const selectedOptions = selected.map((value) => {
            const option = playdekOptions.find((opt) => opt.value === value);
            return { value: option?.value || "", label: option?.label || "" };
          });
          handlePlaydekChange(selectedOptions);
        }}
        placeholder="Select Playdeks..."
        maxDisplayItems={2}
      />
    </StyledFilterPanel>
  );
};

export default FilterPanel;
