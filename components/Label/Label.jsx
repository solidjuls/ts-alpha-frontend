import * as LabelPrimitive from "@radix-ui/react-label";
import styled from "styled-components";

const StyledLabel = styled(LabelPrimitive.Root)`
  font-size: 15px;
  font-weight: 500;
  color: var(--primary-text);
  user-select: none;
  margin: 4px;
`;

export { StyledLabel as Label };
