import { styled } from "stitches.config";

const Button = styled("button", {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "8px",
  cursor: "pointer",
  borderRadius: "8px",
  boxSizing: " border-box",
  textDecoration: "none",
  margin: "4px",
  fontWeight: "600",
  color: "black",
  backgroundColor: "var(--gray-200)",
  border: "solid 1px var(--gray-300)",
  textAlign: "center",
  transition: " all 0.2s",
  outline: "none",
});

export { Button };
