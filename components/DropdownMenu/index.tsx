import { Root, Trigger, Content, Item } from "@radix-ui/react-dropdown-menu";
import { TriangleDownIcon } from "@radix-ui/react-icons";
import { styled } from "stitches.config";
import { Box, Span } from "components/Atoms";
import { blackA } from "@radix-ui/colors";
import type * as Stitches from "@stitches/react";

const styledItemStyles = {
  fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
  fontSize: "$2",
  lineHeight: "1",
  color: "$textDark",
  cursor: "pointer",
  borderRadius: "$1",
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
  outline: "none",
  boxShadow: `0 0 0 1px black`,
  borderRadius: 4,
  backgroundColor: "white",
  variants: {
    border: {
      error: {
        border: "solid 1px red",
        boxShadow: "none",
        "&:focus": {
          boxShadow: `0 0 0 2px red`,
        },
      },
    },
  },
  "&:focus": {
    //outline: "none",
    boxShadow: `0 0 0 2px black`,
  },
});

const StyledContent = styled(Content, {
  borderRadius: 4,
  backgroundColor: "white",
  boxShadow: "0 0 15px $colors$shadow",
  border: "solid 1px black",
  padding: "$1",
});

const StyledTriangleDownIcon = styled(TriangleDownIcon, {
  position: "absolute",
  top: "11px",
  right: "9px",
});

const SelectedItemDiv = styled("div", {
  height: "36px",
  borderRadius: 4,
  backgroundColor: "white",
  textAlign: "left",
  lineHeight: 2.3,
  fontSize: 15,
});

type DropdownItemType = {
  value: string;
  text: string;
};

const DropdownMenu = ({
  items,
  selectedItem,
  onSelect,
  error,
  css,
}: {
  items: DropdownItemType[];
  selectedItem: string;
  onSelect: (value: string) => void;
  error: boolean;
  css: Stitches.CSS;
}) => {
  return (
    <Root>
      <StyledTrigger css={css} border={error ? "error" : undefined}>
        <Box
          css={{
            position: "relative",
            cursor: "pointer",
          }}
        >
          <SelectedItemDiv>
            <Span
              css={{
                marginLeft: "8px",
              }}
            >
              {items.find((item) => item.value === selectedItem)?.text}
            </Span>
          </SelectedItemDiv>
          <StyledTriangleDownIcon />
        </Box>
      </StyledTrigger>

      <StyledContent css={css}>
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
