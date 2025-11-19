import { Flex } from "components/Atoms";
import { StyledLabel, StyledLabelInfo } from "./DisplayInfo.styled";

type DisplayInfoProps = {
  label: string;
  infoText: string;
  maxWidth?: string;
};

const DisplayInfo: React.FC<DisplayInfoProps> = ({ label, infoText, maxWidth = "300px" }) => {
  return (
    <div style={{ display: "flex",flexDirection: "column", maxWidth }}>
      <StyledLabel htmlFor="userName">{label}</StyledLabel>
      <StyledLabelInfo id="userName">{infoText || "-"}</StyledLabelInfo>
    </div>
  );
};

export { DisplayInfo };
