import { createStitches } from "@stitches/react";

export const stitchesConfig = createStitches({
  theme: {
    colors: {
      gray900: "hsl(205,5%,7%)",
      gray700: "hsl(205,5%,25%)",
      gray500: "hsl(205,5%,35%)",
      gray50: "hsl(205,5%,95%)",
      blue500: "hsl(205,90%,45%)",

      // Alias
      primary: "$gray900",
      secondary: "$gray700",
      tertiary: "$gray500",
      link: "$blue500",
      background: "$gray50",
      border: "$gray900",
    },
  },
  media: {
    dark: "(prefers-color-scheme: dark)",
  },
});

export const darkTheme = stitchesConfig.createTheme({
  colors: {
    primary: "$gray100",
    secondary: "$gray200",
    tertiary: "$gray300",
    link: "$blue500",
    background: "$gray900",
    border: "$gray100",
  },
});
