import styled from "styled-components";
import * as LabelPrimitive from "@radix-ui/react-label";

export const Container = styled.div<{ $maxWidth: string }>`
  display: flex;
  flex-direction: column;
  max-width: ${(p) => p.$maxWidth};
`;

export const StyledLabel = styled(LabelPrimitive.Root)`
  font-size: 10px;
  color: var(--alt-text);
  user-select: none;
`;

export const StyledLabelInfo = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: var(--alt-text);
`;
