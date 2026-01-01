import styled from "styled-components";
import * as LabelPrimitive from "@radix-ui/react-label";

export const StyledLabel = styled(LabelPrimitive.Root)`
  font-size: 10px;
  color: var(--muted-text);
  user-select: none;
`;

export const StyledLabelInfo = styled(LabelPrimitive.Root)`
  font-size: 14px;
  font-weight: 500;
  color: var(--primary-text);
`;
