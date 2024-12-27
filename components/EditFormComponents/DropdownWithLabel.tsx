import DropdownMenu from "components/DropdownMenu";
import MultiSelect from "components/MultiSelect";
import WithLabel from "./WithLabel";
import { DropdownItemType } from "types/types";

type DropdownWithLabelProps = {
  labelText: string;
  selectedItem: string;
  onSelect: (value: string) => void;
  items: DropdownItemType[];
  selectedValueProperty?: string;
  selectedInputProperty?: string;
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
  ...rest
}: DropdownWithLabelProps) => (
  <WithLabel labelText={labelText}>
    <DropdownMenu
      items={items}
      placeholder={placeholder}
      selectedItem={selectedItem}
      onSelect={onSelect}
      // filter={false}
      selectionLimit={1}
    />
    {error && <div style={{ color: "red" }}>{`${placeholder} is invalid`}</div>}
  </WithLabel>
);

export { DropdownWithLabel };
