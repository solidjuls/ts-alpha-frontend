import styled from "styled-components";
import { Indicator, Root } from "@radix-ui/react-checkbox";

export const StyledCheckbox = styled(Root)`
  all: unset;
  width: 20px;
  height: 20px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: solid 1px var(--border);
  margin: 8px;
  cursor: pointer;

  &:hover {
    background-color: var(--ussr);
  }
`;

export const StyledIndicator = styled(Indicator)`
  color: var(--ussr);

  /* 👇 When the checkbox is hovered, change indicator color */
  ${StyledCheckbox}:hover & {
    color: var(--alt-text);
  }
`;
