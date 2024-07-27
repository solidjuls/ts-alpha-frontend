import { styled } from "stitches.config";
import * as LabelPrimitive from "@radix-ui/react-label";

export const StyledLabel = styled(LabelPrimitive.Root, {
    fontSize: 10,
    fontWeight: 500,
    color: "lightgray",
    userSelect: "none",
  });
  
export const StyledLabelInfo = styled(LabelPrimitive.Root, {
    fontSize: 14,
    fontWeight: 500,
    color: "$textDark",
    userSelect: "none",
  });
  