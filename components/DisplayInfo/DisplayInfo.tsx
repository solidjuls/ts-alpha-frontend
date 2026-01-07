import React, { useId } from "react";
import { Container, StyledLabel, StyledLabelInfo } from "./DisplayInfo.styled";

type DisplayInfoProps = {
  label: string;
  infoText: string;
  maxWidth?: string;
  id?: string; 
};

const DisplayInfo: React.FC<DisplayInfoProps> = ({
  label,
  infoText,
  maxWidth = "300px",
  id,
}) => {
  const reactId = useId();
  const valueId = id ?? `displayinfo-${reactId}`;

  return (
    <Container $maxWidth={maxWidth}>
      <StyledLabel htmlFor={valueId}>{label}</StyledLabel>
      <StyledLabelInfo id={valueId}>{infoText || "-"}</StyledLabelInfo>
    </Container>
  );
};

export { DisplayInfo };
