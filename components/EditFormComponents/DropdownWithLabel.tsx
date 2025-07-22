import DropdownMenu from "components/DropdownMenu";
import MultiSelect from "components/MultiSelect";
import WithLabel from "./WithLabel";
import { DropdownItemType } from "types/types";

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
  css: any;
};

const DropdownWithLabel = ({
  labelText,
  selectedItem,
  placeholder,
  onSelect,
  items,
  error,
  css,
  height = undefined,
  ...rest
}: DropdownWithLabelProps) => (
  <WithLabel labelText={labelText}>
    <DropdownMenu
      items={items}
      placeholder={placeholder}
      selectedItem={selectedItem}
      onSelect={onSelect}
      height={height}
      {...rest}
      // filter={false}
    />
    {error && <div style={{ color: "red" }}>{`${placeholder} is invalid`}</div>}
  </WithLabel>
);

export { DropdownWithLabel };
