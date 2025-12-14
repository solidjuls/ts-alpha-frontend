import { Root, Trigger, Content, Item } from "@radix-ui/react-dropdown-menu";
import { TriangleDownIcon } from "@radix-ui/react-icons";
import styled from "styled-components";
import { Box, Span } from "components/Atoms";
import { DropdownItemType } from "types/types";

const StyledItem = styled(Item)`
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif;
  font-size: ${props => props.theme.fontSizes.fontSizeM};
  line-height: 1;
  color: ${props => props.theme.colors.textDark};
  cursor: pointer;
  border-radius: 4px;
  padding: 4px 8px 4px 8px;
  transition: all 50ms;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;

  &:focus {
    outline: none;
    background-color: darkBlue;
    color: ${props => props.theme.colors.textLight};
  }
`;

interface StyledTriggerProps {
  hasError?: boolean;
}

const StyledTrigger = styled(Trigger)<StyledTriggerProps>`
  padding: 0px;
  border: 1px solid #ced4da;
  outline: none;
  /* box-shadow: 0 0 0 1px #ced4da; */
  border-radius: 4px;
  background-color: white;

  ${props => props.hasError && `
    border: solid 1px red;
    box-shadow: none;

    &:focus {
      box-shadow: 0 0 0 1px red;
    }
  `}

  &:focus {
    /* outline: none; */
    border: none;
    box-shadow: 0 0 0 1px #2196f3;
  }
`;

const StyledContent = styled(Content)`
  border-radius: 4px;
  background-color: white;
  width: 390px;
  overflow: scroll;
  /* box-shadow: 0 0 15px rgba(0, 0, 0, 0.1); */
  border: 1px solid #ced4da;
  z-index: 99;
`;

const StyledTriangleDownIcon = styled(TriangleDownIcon)`
  position: absolute;
  top: 11px;
  right: 9px;
`;

const SelectedItemDiv = styled.div`
  height: 36px;
  border-radius: 4px;
  background-color: white;
  text-align: left;
  line-height: 2.3;
  font-size: 15px;
  color: ${props => props.theme.colors.textDark};
`;

interface DropdownMenuProps {
  items: DropdownItemType[];
  selectedItem: string;
  onSelect: (value: string) => void;
  placeholder?: string;
  height?: string;
  width?: string;
  error?: boolean;
}

const TriggerContainer = styled(Box)`
  position: relative;
  cursor: pointer;
`;

const StyledSpan = styled(Span)`
  margin-left: 8px;
`;

const DynamicStyledTrigger = styled(StyledTrigger)<{ width: string }>`
  width: ${props => props.width};
`;

const DynamicStyledContent = styled(StyledContent)<{ maxHeight?: string; width: string }>`
  max-height: ${props => props.maxHeight || 'auto'};
  width: ${props => props.width};
`;

const DropdownMenu = ({
  items,
  selectedItem,
  onSelect,
  error,
  height = undefined,
  width = "390px",
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
