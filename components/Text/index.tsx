import { styled } from "stitches.config";

const Text = styled("p", {
  fontWeight: "0",
  margin: '4px',
  fontSize: '12px',
  variants: {
    strong: {
      bold: {
        fontWeight: "700",
      },
    },
  },
});

export default Text;
