import { GetInputPropsOptions } from "downshift";
import React, { createContext, useContext, ReactNode } from "react";

interface AutocompleteContextType {
  isOpen?: boolean;
  id?: string;
  error?: boolean;
  getInputProps: <T>(options?: T) => T & GetInputPropsOptions;
  getToggleButtonProps?: <T>(options?: T) => T;
  getMenuProps?: <T>(options?: T) => T;
  getItemProps?: <T>(options?: T) => T;
  highlightedIndex?: number;
  openMenu?: () => void;
}

const defaultContextValue: AutocompleteContextType = {
  isOpen: false,
  getInputProps: () => ({}),
  getToggleButtonProps: () => ({}),
  getMenuProps: () => ({}),
  getItemProps: () => ({}),
  highlightedIndex: -1,
  openMenu: () => {},
};

const AutoCompleteContext = createContext<AutocompleteContextType>(defaultContextValue);

interface AutocompleteProviderProps {
  children: ReactNode;
  value: AutocompleteContextType;
}

export const AutocompleteProvider: React.FC<AutocompleteProviderProps> = ({ children, value }) => {
  return <AutoCompleteContext.Provider value={value}>{children}</AutoCompleteContext.Provider>;
};

// Custom hook to use the Autocomplete context
export const useAutocompleteState = () => {
  const context = useContext(AutoCompleteContext);

  if (!context) {
    throw new Error("useAutocompleteState must be used within an AutocompleteProvider");
  }

  return context;
};
