import React from "react";
import WithLabel from "./WithLabel";
import { Input } from "components/Input";

type EditTextComponentProps = {
  labelText: string;
  inputValue: string;
  onInputValueChange: (value: string) => void;
  error: boolean;
  maxLength: number;
  css?: any;
};
const EditTextComponent = ({
  labelText,
  inputValue,
  onInputValueChange,
  maxLength = 255,
  error,
  css,
  ...rest
}: EditTextComponentProps) => {
  return (
    <WithLabel labelText={labelText}>
      <Input
        type="text"
        id="video1"
        maxLength={maxLength}
        value={inputValue}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
          onInputValueChange(event.target.value)
        }
        css={css}
        {...rest}
        border={error ? "error" : undefined}
      />
    </WithLabel>
  );
};

export { EditTextComponent };
