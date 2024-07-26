import * as LabelPrimitive from "@radix-ui/react-label";
import { styled } from "stitches.config";
import { Flex } from "components/Atoms";

const StyledLabel = styled(LabelPrimitive.Root, {
  fontSize: 10,
  fontWeight: 500,
  color: "lightgray",
  userSelect: "none",
});

const StyledLabelInfo = styled(LabelPrimitive.Root, {
  fontSize: 14,
  fontWeight: 500,
  color: "$textDark",
  userSelect: "none",
});

const DisplayInfo = ({ label, infoText, maxWidth = "150px" }) => {
  return (
    <Flex css={{ flexDirection: "column", maxWidth }}>
      <StyledLabel htmlFor="userName">{label}</StyledLabel>
      <StyledLabelInfo id="userName">{infoText}</StyledLabelInfo>
    </Flex>
  );
};

export { DisplayInfo };
