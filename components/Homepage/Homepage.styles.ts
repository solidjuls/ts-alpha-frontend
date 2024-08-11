import Link from "next/link";
import { styled } from "stitches.config";

const borderStyle = "solid 1px $greyLight";
export const PlayerInfo = styled("div", {
  display: "flex",
  flexDirection: "column",
  borderBottom: borderStyle,
  margin: "4px",
});

export const ResultsPanel = styled("div", {
  display: "flex",
  flexDirection: "column",
  backgroundColor: "$infoForm",
  border: "solid 1px none",
  borderRadius: "12px",
  flexGrow: "1",
  marginBottom: "12px",
  height: "500px",
  overflowY: "scroll",
});

export const FilterPanel = styled("div", {
  padding: "8px",
  margin: "8px",
  borderBottom: borderStyle,
});

export const UnstyledLink = styled(Link, {
  all: "unset" /* Unset all styles */,
  display: "inline" /* Reset to inline display */,
  cursor: "pointer" /* Set cursor to pointer */,
});
