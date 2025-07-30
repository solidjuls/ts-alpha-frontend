import { styled } from "stitches.config";
import Link from "next/link";

export const ResultsStyleWrapper = styled("div", {
  display: "flex",
  flexDirection: "column",
  backgroundColor: "$infoForm",
  border: "solid 1px none",
  borderRadius: "12px",
  flexGrow: "1",
  marginBottom: "12px",
  width: "100%",
  maxWidth: "1000px",
  height: "500px",
});

export const PlayerInfo = styled("div", {
  display: "flex",
  flexDirection: "column",
  width: '100%',
  padding: "4px",
  margin: "4px",
  borderWidth: "1px",
  borderRadius: "6px",
  border: "solid 1px $greyLight",
  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1),0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  variants: {
    status: {
      played: {
        backgroundColor: "rgba(0, 128, 0, 0.4)",
      },
      default: {
        backgroundColor: "white",
      },
      duedate: {
        backgroundColor: "rgba(255, 0, 0, 0.4)",
      },
    },
  },
  defaultVariants: {
    status: "default",
  },
});

export const DueDateCell = styled("div", {
  display: "flex",
  flexDirection: "column",
  justifyContent: 'center',
  padding: "4px",
  margin: "4px",
  borderWidth: "1px",
  borderRadius: "6px",
  border: "solid 1px $greyLight",
  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1),0 4px 6px -2px rgba(0, 0, 0, 0.05)",
});

export const UnstyledLink = styled(Link, {
  all: "unset" /* Unset all styles */,
  display: "inline" /* Reset to inline display */,
  cursor: "pointer" /* Set cursor to pointer */,
});