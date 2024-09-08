import Link from "next/link";
import { styled } from "stitches.config";

const borderStyle = "solid 1px $greyLight";
export const PlayerInfo = styled("div", {
  display: "flex",
  flexDirection: "column",
  // borderBottom: borderStyle,
  padding: "4px",
  margin: "4px",
  borderWidth: "1px",
  borderRadius: "6px",
  border: "solid 1px $greyLight",
  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1),0 4px 6px -2px rgba(0, 0, 0, 0.05)",
});

const StyledCardRow = styled("div", {
  display: "grid",
  gap: "1rem",
  gridTemplateColumns: "min-content 3fr 2fr min-content",
  paddingInlineStart: "8px",
  paddingInlineEnd: "8px",
  paddingTop: "4px",
  paddingBottom: "4px",
  borderWidth: "1px",
  borderRadius: "6px",
  border: "solid 1px $greyLight",
  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1),0 4px 6px -2px rgba(0, 0, 0, 0.05)",
});

export const StyledResultsPanel = styled("div", {
  display: "flex",
  flexDirection: "column",
  backgroundColor: "$infoForm",
  border: "solid 1px none",
  borderRadius: "12px",
  flexGrow: "1",
  marginBottom: "12px",
  minHeight: "600px"
});

export const FilterPanel = styled("div", {
  display: "flex",
  flexDirection: "row",
  padding: "8px",
  margin: "8px",
  borderBottom: borderStyle,
});

export const UnstyledLink = styled(Link, {
  all: "unset" /* Unset all styles */,
  display: "inline" /* Reset to inline display */,
  cursor: "pointer" /* Set cursor to pointer */,
});
