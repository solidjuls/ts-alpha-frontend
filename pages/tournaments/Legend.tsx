import React from "react"
import { styled } from "stitches.config";

const LegendContainer = styled("div", {
  display: "flex",
  flexDirection: "row",
  gap: "$small",
  padding: "8px 0",
});

// Each row of the legend
const LegendItem = styled("div", {
  display: "flex",
  alignItems: "center",
  gap: "$small",
  color: "$text",
  margin: "4px"
});

// Color box
const ColorBox = styled("div", {
  width: "24px",
  height: "24px",
});

// Label text
const Label = styled("span", {
  fontSize: "14px",
});

const Legend = () => {
  return (
    <LegendContainer>
      <LegendItem>
        <ColorBox css={{ backgroundColor: "$redAlpha", marginRight: "4px" }} />
        <Label>Closed</Label>
      </LegendItem>

      <LegendItem>
        <ColorBox css={{ backgroundColor: "$greenAlpha", marginRight: "4px" }} />
        <Label>Active</Label>
      </LegendItem>

      <LegendItem>
        <ColorBox css={{ backgroundColor: "$yellowAlpha", marginRight: "4px" }} />
        <Label>Registration Open</Label>
      </LegendItem>

      <LegendItem>
        <ColorBox css={{ backgroundColor: "$blueAlpha", marginRight: "4px" }} />
        <Label>Registration Closed</Label>
      </LegendItem>
    </LegendContainer>
  );
};

export { Legend }
