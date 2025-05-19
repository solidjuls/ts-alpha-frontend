import { styled } from "stitches.config";
import Link from "next/link";

export const UnstyledLink = styled(Link, {
  all: "unset",
  cursor: "pointer",
});

export const ResultsStyleWrapper = styled("div", {
  display: "flex",
  flexDirection: "column",
  gap: "0.5rem",
  backgroundColor: "$background",
  border: "solid 1px none",
  borderRadius: "12px",
  flexGrow: "1",
  marginBottom: "12px",
  width: "100%",
  maxWidth: "1000px",
  minHeight: "500px",
  position: "relative",
  paddingBottom: "80px",
});

export const PaginationContainer = styled("div", {
  position: "absolute",
  bottom: "20px",
  left: "0px",
  display: "flex",
  justifyContent: "flex-start",
  backgroundColor: "$background",
  padding: "12px 0",
  zIndex: 1,
});

export const StyledResultsPanel = styled("div", {
  display: "flex",
  flexDirection: "column",
  backgroundColor: "$background",
  border: "solid 1px none",
  borderRadius: "12px",
  flexGrow: "1",
  marginBottom: "12px",
  minHeight: "500px",
});

export const StyledCardRow = styled("div", {
  display: "grid",
  gap: "1rem",
  margin: "4px",
  gridTemplateColumns: "min-content 3fr min-content",
  paddingInlineStart: "8px",
  paddingInlineEnd: "8px",
  paddingTop: "4px",
  paddingBottom: "4px",
  borderWidth: "1px",
  borderRadius: "6px",
  border: "solid 1px $greyLight",
  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1),0 4px 6px -2px rgba(0, 0, 0, 0.05)",
});

export const FilterPanel = styled("div", {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  margin: "0 0 16px 0",
  padding: "8px",
  backgroundColor: "$infoForm",
  borderRadius: "12px",
});

export const FilterSelectContainer = styled("div", {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  gap: "8px",
});

export const FilterDivider = styled("div", {
  width: "1px",
  height: "24px",
  backgroundColor: "$greyLight",
  margin: "0 8px",
}); 