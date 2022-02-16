import { Root, Trigger, Content, Item } from "@radix-ui/react-dropdown-menu";
import { TriangleDownIcon } from "@radix-ui/react-icons";
import { styled } from "@stitches/react";

const styledItemStyles = {
  fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
  fontSize: "$2",
  lineHeight: "1",
  color: "black",
  cursor: "pointer",
  borderRadius: "$1",
  padding: "$1 $2 $1 $5",
  transition: "all 50ms",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  position: "relative",

  "&:focus": {
    outline: "none",
    backgroundColor: "darkBlue",
    color: "white",
  },
};

const StyledItem = styled(Item, { ...styledItemStyles });

const StyledTrigger = styled(Trigger, {
  padding: "0px",
  border: "none",
});

const StyledContent = styled(Content, {
  backgroundColor: "white",
  borderRadius: "$2",
  boxShadow: "0 0 15px $colors$shadow",
  border: "solid 1px black",
  width: "300px",
  padding: "$1",
  minWidth: 150,
});

const StyledTriangleDownIcon = styled(TriangleDownIcon, {
  position: "absolute",
  top: "11px",
  right: "9px",
});

const Span = styled("span", {
  marginLeft: "8px",
});
const SelectedItemDiv = styled("div", {
  width: "300px",
  height: "36px",
  border: "solid 1px black",
  backgroundColor: "white",
  textAlign: "left",
  lineHeight: 2,
  borderRadius: 4,
  fontSize: 15,
});

const BoxInput = styled("div", {
  position: "relative",
  cursor: "pointer",
});

type ItemType = {
  text: string;
  value: string;
};

type DropdownMenuProps = {
  items: Array<ItemType>;
  selectedItem: ItemType;
  onSelect: Function;
};

const DropdownMenu = ({ items, selectedItem, onSelect }: DropdownMenuProps) => {
  return (
    <Root>
      <StyledTrigger>
        <BoxInput>
          <SelectedItemDiv>
            <Span>{selectedItem.text}</Span>
          </SelectedItemDiv>
          <StyledTriangleDownIcon />
        </BoxInput>
      </StyledTrigger>

      <StyledContent>
        {items.map((item) => (
          <StyledItem key={item.value} onSelect={() => onSelect(item.value)}>
            {item.text}
          </StyledItem>
        ))}
      </StyledContent>
    </Root>
  );
};

export default DropdownMenu;
