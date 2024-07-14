import { createContext, useContext } from "react";

const AutoCompleteContext = createContext({});

export const AutocompleteProvider = AutoCompleteContext.Provider;

export const useAutocompleteState = () => useContext(AutoCompleteContext);
