import { Root} from "@radix-ui/react-dropdown-menu";
import { DropdownItemType } from "types/types";
import { 
  StyledItem,
  StyledTriangleDownIcon,
  SelectedItemDiv,
  DynamicStyledContent,
  DynamicStyledTrigger,
  TriggerContainer,
  StyledSpan
 } from "./DropdownMenu.styled";

interface DropdownMenuProps {
  items: DropdownItemType[];
  selectedItem: string;
  onSelect: (value: string) => void;
  placeholder?: string;
  height?: string;
  width?: string;
  error?: boolean;
}

const DropdownMenu = ({
  items,
  selectedItem,
  onSelect,
  error,
  height = undefined,
  width = "500px",
}: DropdownMenuProps) => {
  let selectedItemMapped = items.find(
    (item) => item.value?.toLowerCase() === selectedItem?.toLowerCase(),
  )?.text;

  return (
    <Root>
      <DynamicStyledTrigger width={width} hasError={error}>
        <TriggerContainer>
          <SelectedItemDiv>
            <StyledSpan>
              {selectedItemMapped}
            </StyledSpan>
          </SelectedItemDiv>
          <StyledTriangleDownIcon />
        </TriggerContainer>
      </DynamicStyledTrigger>

      <DynamicStyledContent maxHeight={height} width={width}>
        {items.map((item) => (
          <StyledItem key={item.value} onSelect={() => onSelect(item.value)}>
            {item.text}
          </StyledItem>
        ))}
      </DynamicStyledContent>
    </Root>
  );
};

export default DropdownMenu;
