import React from "react";
import WithLabel from "./WithLabel";
import { TextArea } from "components/TextArea";

type EditTextAreaComponentProps = {
  labelText: string;
  inputValue: string;
  onInputValueChange: (value: string) => void;
  error: boolean;
  maxLength: number;
  css?: any;
};
const EditTextAreaComponent = ({
  labelText,
  inputValue,
  onInputValueChange,
  maxLength = 255,
  error,
  css,
  ...rest
}: EditTextAreaComponentProps) => {
  return (
    <WithLabel labelText={labelText}>
      <TextArea
        type="text"
        id="video1"
        maxLength={maxLength}
        defaultValue={inputValue}
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

export { EditTextAreaComponent };