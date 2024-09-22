import { styled } from "stitches.config";

const Button = styled("button", {
  display: "flex",
  justifyContent: "center",
  padding: "8px",
  cursor: "pointer",
  // margin: "0 0.3em 0.3em 0",
  borderRadius: "8px",
  boxSizing: " border-box",
  textDecoration: "none",
  margin: "4px",
  fontWeight: "300",
  color: "$textLight",
  backgroundColor: "$backgroundColorDark",
  textAlign: "center",
  transition: " all 0.2s",
  //backgroundColor: "rgb(103, 58, 183)",
});

export { Button };
