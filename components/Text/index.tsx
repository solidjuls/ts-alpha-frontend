import { styled } from "stitches.config";

const Text = styled("p", {
  fontWeight: "0",
  margin: "4px",
  fontSize: 16,
  variants: {
    strong: {
      bold: {
        fontWeight: "600",
      },
    },
    fontSize: {
      small: {
        fontSize: 12,
        margin: 0
      },
      medium: {
        fontSize: 16,
        margin: 0
      },
      big: {
        fontSize: 20,
        margin: 0
      },
    }
  },
});

export default Text;
