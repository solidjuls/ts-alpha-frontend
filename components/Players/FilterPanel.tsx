import React from "react";
import Select from "react-select";
import { FilterPanel as StyledFilterPanel } from "components/Homepage/Homepage.styles";
import { Option, CustomSelectContainer } from "./CustomSelect";
import { SelectOption } from "./Players.types";
import { MultiSelectItemType } from "types/types";
import { FilterSelectContainer, FilterDivider, SelectStyles } from "./Players.styles";

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
  return (
    <StyledFilterPanel>
      <FilterSelectContainer>
        <Select<SelectOption, true>
          isMulti
          options={playerOptions}
          placeholder="Select Players..."
          closeMenuOnSelect={false}
          blurInputOnSelect={false}
          inputValue={playerInputValue}
          onInputChange={(newValue, action) => {
            if (action.action === "input-change") {
              setPlayerInputValue(newValue);
            }
          }}
          onChange={handlePlayerChange}
          value={playerOptions.filter(option => 
            playersSelected?.some((item: MultiSelectItemType) => item.code === option.value)
          )}
          components={{ 
            Option,
            SelectContainer: CustomSelectContainer,
            MultiValue: () => null
          }}
          menuPortalTarget={document.body}
          styles={SelectStyles}
          aria-label="Players"
        />
        <FilterDivider />
      </FilterSelectContainer>
      
      <FilterSelectContainer>
        <Select<SelectOption, true>
          isMulti
          options={countryOptions}
          placeholder="Select Countries..."
          closeMenuOnSelect={false}
          blurInputOnSelect={false}
          inputValue={countryInputValue}
          onInputChange={(newValue, action) => {
            if (action.action === "input-change") {
              setCountryInputValue(newValue);
            }
          }}
          onChange={handleCountryChange}
          value={countryOptions.filter(option => 
            countriesSelected?.includes(option.value)
          )}
          components={{ 
            Option,
            SelectContainer: CustomSelectContainer,
            MultiValue: () => null
          }}
          menuPortalTarget={document.body}
          styles={SelectStyles}
          aria-label="Countries"
        />
        <FilterDivider />
      </FilterSelectContainer>
      
      <Select<SelectOption, true>
        isMulti
        options={playdekOptions}
        placeholder="Select Playdeks..."
        closeMenuOnSelect={false}
        blurInputOnSelect={false}
        inputValue={playdekInputValue}
        onInputChange={(newValue, action) => {
          if (action.action === "input-change") {
            setPlaydekInputValue(newValue);
          }
        }}
        onChange={handlePlaydekChange}
        value={playdekOptions.filter(option => 
          playdekSelected?.some((item: MultiSelectItemType) => item.code === option.value)
        )}
        components={{ 
          Option,
          SelectContainer: CustomSelectContainer,
          MultiValue: () => null
        }}
        menuPortalTarget={document.body}
        styles={SelectStyles}
        aria-label="Playdeks"
      />
    </StyledFilterPanel>
  );
};

export default FilterPanel; 