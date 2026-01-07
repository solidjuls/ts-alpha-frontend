import DropdownMenu from "components/DropdownMenu";
import WithLabel from "./WithLabel";
import { DropdownItemType } from "types/types";
import { FieldWrapper, ErrorText } from "./DropdownWithLabel.styled";

type DropdownWithLabelProps = {
  labelText: string;
  selectedItem: string;
  onSelect: (value: string) => void;
  placeholder: string;
  items: DropdownItemType[];
  selectedValueProperty?: string;
  selectedInputProperty?: string;
  height?: string;
  disabled?: boolean;
  error: boolean;
  css?: any;
};

const DropdownWithLabel = ({
  labelText,
  selectedItem,
  placeholder,
  onSelect,
  items,
  error,
  height,
  ...rest
}: DropdownWithLabelProps) => (
  <WithLabel labelText={labelText}>
    <FieldWrapper>
      <DropdownMenu
        items={items}
        placeholder={placeholder}
        selectedItem={selectedItem}
        onSelect={onSelect}
        height={height}
        {...rest}
        error={error}
      />
      {error && (
        <ErrorText>{`${placeholder} is invalid`}</ErrorText>
      )}
    </FieldWrapper>
  </WithLabel>
);

export { DropdownWithLabel };
