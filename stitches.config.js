import { createStitches } from "@stitches/react";

export const { styled, globalCss, css, getCssText, createTheme, keyframes } = createStitches({
  theme: {
    colors: {
      textDark: "black",
      textLight: "white",
      itemHighlight: "lightgray",
      backgroundColorDark: "black",
      backgroundColorLight: "white",
      gray900: "hsl(205,5%,7%)",
      gray700: "hsl(205,5%,25%)",
      gray500: "hsl(205,5%,35%)",
      skeletonColorPrimary: "#e9eef0",
      skeletonColorSecondary: "#bcc9d1",
      infoForm: "white",
      greyLight: "#eeeeee",
      primary: "$gray900",
      secondary: "$gray700",
      tertiary: "$gray500",
      // tournament
      redSolid: "#FF0000",
      redAlpha: "rgba(255, 0, 0, 0.5)",
      greenSolid: "#00FF00",
      greenAlpha: "rgba(0, 255, 0, 0.5)",
      yellowSolid: "#FFFF00",
      yellowAlpha: "rgba(255, 255, 0, 0.5)",
      blueSolid: "#0000FF",
      blueAlpha: "rgba(0, 0, 255, 0.5)",
      text: "#333",
    },
  },
  fontSizes: {
    fontSizeS: "12px",
    fontSizeM: "16px",
    fontSizeL: "20px",
    fontSizeXL: "24px",
  },
  media: {
    sm: "(max-width: 480px)",
    md: "(max-width: 768px)",
    lg: "(max-width: 1024px)",
  },
});

// export const globalMultiselectStyles = (filter) => globalCss({
//   ".p-multiselect": {
//     width: "250px",
//     padding: "0",
//   },
//   ".p-multiselect-header": {
//     display: filter ? "flex" : "none"
//   }
// });

export const darkTheme = createTheme({
  colors: {
    primary: "$gray100",
    secondary: "$gray200",
    tertiary: "$gray300",
    link: "$blue500",
    background: "$gray900",
    border: "$gray100",
  },
});
