import React from "react";
import { styled } from "@stitches/react";
import { violet, blackA } from "@radix-ui/colors";
import { CheckIcon } from "@radix-ui/react-icons";
import { Indicator, Root } from "@radix-ui/react-checkbox";
import { Label } from "components/Label";
import { Box } from "components/Atoms";

const StyledCheckbox = styled(Root, {
  all: "unset",
  width: 20,
  height: 20,
  borderRadius: 4,
  display: "flex",
  alignItems: "baseline",
  justifyContent: "center",
  border: "solid 1px black",
  margin: "8px",
  cursor: "pointer",
  "&:hover": { backgroundColor: violet.violet3 },
});

const StyledIndicator = styled(Indicator, {
  color: violet.violet11,
});

type CheckboxProps = {
  checked: boolean;
  text: string;
  onCheckedChange: (value: boolean) => void;
  css?: any;
};

const Checkbox = ({ checked, text, onCheckedChange, css }: CheckboxProps) => (
  <Box css={{ display: "flex", alignItems: "center", ...css }}>
    <StyledCheckbox checked={checked} onCheckedChange={onCheckedChange}>
      <StyledIndicator>
        <CheckIcon width={20} height={20} />
      </StyledIndicator>
    </StyledCheckbox>
    <Label>{text}</Label>
  </Box>
  //   <StyledCheckbox checked={checked ? "true" : "false"}>
  //     <StyledIndicator>
  //       <CheckIcon fill={checked ? "white" : "black"}></CheckIcon>
  //     </StyledIndicator>
  //   </StyledCheckbox>
);

export { Checkbox };
