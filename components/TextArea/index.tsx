import { styled } from "stitches.config";

const TextArea = styled("textarea", {
  variants: {
    margin: {
      xxl: { margin: 64 },
      url: { margin: "0 0 24px 0" },
      login: { margin: "0 0 12px 0" },
    },
    border: {
      dropdown: {
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
      },
      error: {
        border: "solid 1px red",
        "&:focus": {
          boxShadow: `0 0 0 2px red`,
        },
        boxShadow: "none",
      },
    },
    filter: {
      filter: {
        minHeight: "80px",
      },
    },
  },
  all: "unset",
  display: "inline-flex",
  alignItems: "flex-start",
  justifyContent: "flex-start",
  borderRadius: 4,
  padding: "8px 10px",
  minHeight: 60,
  fontSize: 15,
  lineHeight: 1.4,
  border: "1px solid #ced4da",
  color: "black",
  resize: "vertical", // allows resizing vertically only
  "&:focus": {
    outline: "none",
    // boxShadow: `0 0 0 2px #ced4da`,
  },
});

export { TextArea }
