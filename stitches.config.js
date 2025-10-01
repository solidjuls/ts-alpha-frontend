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
      link: "#b12236",
      linkHover: "#365f65",
      redAlpha: "rgba(255, 0, 0, 0.4)",
      greenAlpha: "rgba(0, 128, 0, 0.4)",
      yellowAlpha: "rgba(255, 215, 0, 0.4)",
      blueAlpha: "rgba(0, 0, 255, 0.4)",
    },
    fontSizes: {
    fontSizeS: "12px",
    fontSizeM: "16px",
    fontSizeL: "20px",
    fontSizeXL: "24px",
    },
    space: {
      small: '8px',
      medium: '16px',
      large: '32px',
    }
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
