import {
  Root,
  Trigger,
  Content,
  Label,
  Item,
  Group,
  CheckboxItem,
  ItemIndicator,
  RadioGroup,
  Arrow,
  RadioItem,
  TriggerItem,
  Separator,
} from "@radix-ui/react-dropdown-menu";
import { TriangleDownIcon } from "@radix-ui/react-icons";
import { styled } from "@stitches/react";
import { Input } from "../Input";

const StyledTrigger = styled(Trigger, {
  padding: "0px",
  border: "none",
})
const StyledContent = styled(Content, {
  backgroundColor: "white",
  borderRadius: "$2",
  boxShadow: "0 0 15px $colors$shadow",
  padding: "$1",
  minWidth: 150,
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
  backgroundColor: "white"
})
const Box = styled("div", {
  display: "flex",
  alignItems: "start",
  justifyContent: "center",
  paddingTop: "$5",
});

const BoxInput = styled("div", {
  position: "relative",
});

const IconButton = styled("div", {
  appearance: "none",
  border: "none",
  width: "36px",
  height: "36px",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  //borderRadius: "$2",
  border: "none",
  backgroundColor: "$violet9",
  color: "white",
  transition: "all 150ms",
  "&:hover": {
    backgroundColor: "rgba(255 255 255 / .2)",
  },
  "&:focus": {
    outline: "none",
    boxShadow: "0 0 0 2px $colors$violet8",
  },
});

const DropdownMenu = () => {
  return (
      <Root>
        <StyledTrigger>
          <BoxInput>
            <SelectedItemDiv />
            <StyledTriangleDownIcon />
          </BoxInput>
        </StyledTrigger>

        <StyledContent>
          <Label>item 1</Label>
          <Label>item 1</Label>
          <Label>item 1</Label>
          <Item />
        </StyledContent>
      </Root>
  );
};
export { DropdownMenu };
