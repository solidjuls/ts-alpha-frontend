import { Root, Trigger, Content, Item } from "@radix-ui/react-dropdown-menu";
import { TriangleDownIcon } from "@radix-ui/react-icons";
import { styled } from "stitches.config";
import { Box, Span } from "components/Atoms";

const styledItemStyles = {
  fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
  fontSize: "$2",
  lineHeight: "1",
  color: "$textDark",
  cursor: "pointer",
  borderRadius: "$1",
  // padding: "$1 $2 $1 $5",
  padding: "4px 8px 4px 8px",
  transition: "all 50ms",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  position: "relative",

  "&:focus": {
    outline: "none",
    backgroundColor: "darkBlue",
    color: "$textLight",
  },
};

const StyledItem = styled(Item, { ...styledItemStyles });

const StyledTrigger = styled(Trigger, {
  padding: "0px",
  border: "none",
});

const StyledContent = styled(Content, {
  backgroundColor: "white",
  borderRadius: "4px",
  boxShadow: "0 0 15px $colors$shadow",
  border: "solid 1px black",
  width: "300px",
  padding: "$1",
});

const StyledTriangleDownIcon = styled(TriangleDownIcon, {
  position: "absolute",
  top: "11px",
  right: "9px",
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

type ItemType = {
  text: string;
  value: string;
};

type DropdownMenuProps = {
  items: Array<ItemType>;
  selectedItem: string;
  onSelect: Function;
  width: string;
};

const DropdownMenu = ({
  items,
  selectedItem,
  onSelect,
  width,
}: DropdownMenuProps) => {
  return (
    <Root>
      <StyledTrigger>
        <Box
          css={{
            position: "relative",
            cursor: "pointer",
          }}
        >
          <SelectedItemDiv css={{ width }}>
            <Span
              css={{
                marginLeft: "8px",
              }}
            >
              {selectedItem}
            </Span>
          </SelectedItemDiv>
          <StyledTriangleDownIcon />
        </Box>
      </StyledTrigger>

      <StyledContent css={{ width }}>
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
