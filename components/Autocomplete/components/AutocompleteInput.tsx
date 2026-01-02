// AutocompleteInput.tsx
import React from "react";
import { Input } from "components/Input";
import PropTypes from "prop-types";
import { useAutocompleteState } from "../AutocompleteContext";
import styled from "styled-components";

type AutocompleteInputProps = {
  label: string;
  placeholder: string;
  error: boolean;
  width?: string;
};

const InputWrapper = styled.div<{ $width?: string }>`
  width: ${({ $width }) => $width || "320px"};
  max-width: 100%;

  input {
    background-color: var(--bg-card);
    color: var(--primary-text);
    border-radius: 8px;
    border: 1px solid var(--border);
    font-family: var(--font-body);

    &:focus-visible {
      outline: 2px solid var(--usa);
      outline-offset: 2px;
    }
  }
`;

const AutocompleteInput: React.FC<AutocompleteInputProps> = ({
  label,
  width,
  placeholder,
  error,
  ...rest
}) => {
  const { getInputProps, openMenu } = useAutocompleteState();

  return (
    <InputWrapper $width={width}>
      <Input
        {...getInputProps({
          placeholder,
          label,
          onFocus: openMenu,
        })}
        // resetIcon={resetIcon}
        // icon=""
        {...rest}
        width="100%"
        border={error ? "error" : undefined}
      />
    </InputWrapper>
  );
};

AutocompleteInput.propTypes = {
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
};

export { AutocompleteInput };
