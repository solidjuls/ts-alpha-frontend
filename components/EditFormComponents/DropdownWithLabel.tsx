import DropdownMenu, { DropdownItemType } from "components/DropdownMenu";
import WithLabel from "./WithLabel";

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
  onSelect,
  items,
  error,
  css,
  ...rest
}: DropdownWithLabelProps) => (
  <WithLabel labelText={labelText}>
    <DropdownMenu
      items={items}
      selectedItem={selectedItem}
      onSelect={onSelect}
      css={css}
      {...rest}
      error={error}
    />
  </WithLabel>
);

export { DropdownWithLabel };
