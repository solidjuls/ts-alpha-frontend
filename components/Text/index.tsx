import { styled } from "stitches.config";

const Text = styled("p", {
  fontWeight: "0",
  margin: '4px',
  variants: {
    strong: {
      bold: {
        fontWeight: "600",
      },
    },
  },
});

export default Text;
