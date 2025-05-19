import { useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "redux/store";
import { MultiValue } from "react-select";
import { UserType } from "types/user.types";
import { Country, SelectOption } from "./Players.types";
import {
  setPlayersFilter,
  setCountriesFilter,
  setPlaydekFilter,
} from "../../redux/playersListSlice";

export const usePlayersFilters = (
  users: UserType[] | undefined,
  countries: Country[] | undefined,
) => {
  const dispatch = useDispatch<AppDispatch>();
  const { filters } = useSelector((state: RootState) => state.playersList);
  const { playersSelected, countriesSelected, playdekSelected } = filters;

  // State variables to track input values
  const [playerInputValue, setPlayerInputValue] = useState("");
  const [countryInputValue, setCountryInputValue] = useState("");
  const [playdekInputValue, setPlaydekInputValue] = useState("");

  // Format data for react-select
  const playerOptions = useMemo(
    () => users?.map((user) => ({ value: user.id || "", label: user.name || "" })) || [],
    [users],
  );

  const countryOptions = useMemo(
    () =>
      countries?.map((country) => ({
        value: country.id || "",
        label: country.country_name || "",
      })) || [],
    [countries],
  );

  // Extract unique playdek names from users with their IDs
  const playdekOptions = useMemo(() => {
    if (!users) return [];

    // Create a map of playdek names to their IDs
    const playdekMap = new Map<string, string>();

    // First pass: collect all playdek names and their associated user IDs
    users.forEach((user) => {
      if (typeof user.playdek === "string" && user.playdek.trim() !== "" && user.id) {
        playdekMap.set(user.playdek, user.id);
      }
    });

    // Convert to options array and sort alphabetically by name
    return Array.from(playdekMap.entries())
      .map(([name, id]) => ({
        value: id, // Use the user ID as the value
        label: name, // Use the playdek name as the label
      }))
      .sort((a, b) => a.label.localeCompare(b.label)); // Sort alphabetically by label (name)
  }, [users]);

  // Filter handlers
  const handlePlayerChange = (selectedOptions: MultiValue<SelectOption>) => {
    const selectedValues = selectedOptions
      ? selectedOptions.map((option) => ({ code: option.value, name: option.label }))
      : [];
    dispatch(setPlayersFilter(selectedValues));
  };

  const handleCountryChange = (selectedOptions: MultiValue<SelectOption>) => {
    const selectedValues = selectedOptions ? selectedOptions.map((option) => option.value) : [];
    dispatch(setCountriesFilter(selectedValues));
  };

  const handlePlaydekChange = (selectedOptions: MultiValue<SelectOption>) => {
    const selectedValues = selectedOptions
      ? selectedOptions.map((option) => ({ code: option.value, name: option.label }))
      : [];
    dispatch(setPlaydekFilter(selectedValues));
  };

  // Check if any filter has selections
  const hasAnySelections =
    playersSelected?.length > 0 || countriesSelected?.length > 0 || playdekSelected?.length > 0;

  return {
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
    hasAnySelections,
  };
};
