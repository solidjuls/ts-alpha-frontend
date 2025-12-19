import React from "react";
import { CheckIcon } from "@radix-ui/react-icons";
import { Label } from "components/Label";
import { Box } from "components/Atoms";
import { StyledCheckbox, StyledIndicator } from './Checkbox.styled';

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
