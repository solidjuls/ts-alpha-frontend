import { createStitches } from "@stitches/react";

export const { styled, getCssText, createTheme } = createStitches({
  theme: {
    colors: {
      textDark: "black",
      textLight: "white",
      itemHighlight: "lightgray",
      backgroundColorDark: 'black',
      backgroundColorLight: 'white',
      gray900: "hsl(205,5%,7%)",
      gray700: "hsl(205,5%,25%)",
      gray500: "hsl(205,5%,35%)",
      greyLight:'#eeeeee',
      primary: "$gray900",
      secondary: "$gray700",
      tertiary: "$gray500",
      //   gray50: "hsl(205,5%,95%)",
      //   blue500: "hsl(205,90%,45%)",
      //   // Alias
      //   primary: "$gray900",
      //   secondary: "$gray700",
      //   tertiary: "$gray500",
      //   link: "$blue500",
      //   background: "$gray50",
      //   border: "$gray900",
    },
  },
  fontSizes: {
    fontSizeS: '12px',
    fontSizeM: '16px',
    fontSizeL: '20px',
    fontSizeXL: '24px',
  },
  media: {
    sm: "(max-width: 480px)",
    md: "(max-width: 768px)",
    lg: "(max-width: 1024px)",
  },
});

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

export default stitches;
