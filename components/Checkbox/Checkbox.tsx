import React from "react";
import { styled } from "@stitches/react";
import { violet, blackA } from "@radix-ui/colors";
import { CheckIcon } from "@radix-ui/react-icons";
import { Indicator, Root } from "@radix-ui/react-checkbox";
import { Label } from "components/Label";
import { Box } from "components/Atoms";

const StyledCheckbox = styled(Root, {
  all: "unset",
  width: 25,
  height: 25,
  borderRadius: 4,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: "solid 1px black",
  margin: "8px",
  cursor: "pointer",
  boxShadow: `0 2px 10px ${blackA.blackA7}`,
  "&:hover": { backgroundColor: violet.violet3 },
  "&:focus": { boxShadow: `0 0 0 2px black` },
  //   variants: {
  //     checked: {
  //       true: {
  //         backgroundColor: "black",
  //       },
  //       false: {
  //         backgroundColor: "white",
  //       },
  //     },
  //   },
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
        <CheckIcon />
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
