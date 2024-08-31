import { Flex } from "components/Atoms";
import { StyledLabel, StyledLabelInfo } from "./DisplayInfo.styles";

type DisplayInfoProps = {
  label: string;
  infoText: string;
  maxWidth: string;
};

const DisplayInfo: React.FC<DisplayInfoProps> = ({ label, infoText, maxWidth = "300px" }) => {
  return (
    <Flex css={{ flexDirection: "column", maxWidth }}>
      <StyledLabel htmlFor="userName">{label}</StyledLabel>
      <StyledLabelInfo id="userName">{infoText || "-"}</StyledLabelInfo>
    </Flex>
  );
};

export { DisplayInfo };
