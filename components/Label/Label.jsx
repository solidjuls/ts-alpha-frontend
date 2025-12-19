import * as LabelPrimitive from "@radix-ui/react-label";
import styled from "styled-components";

const StyledLabel = styled(LabelPrimitive.Root)`
  font-size: 15px;
  font-weight: 500;
  color: #1f2937;
  user-select: none;
  margin: 4px;
`;

export { StyledLabel as Label };
