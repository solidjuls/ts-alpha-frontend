import * as LabelPrimitive from "@radix-ui/react-label";
import { styled } from "stitches.config";

const StyledLabel = styled(LabelPrimitive.Root, {
    fontSize: 15,
    fontWeight: 500,
    color: "black",
    userSelect: "none",
    margin: "4px"
  });
  

export { StyledLabel as Label };
