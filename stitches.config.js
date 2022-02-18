import { createStitches } from "@stitches/react";

const stitches = createStitches({
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
    sm: "(max-width: 480px)",
    md: '(max-width: 768px)',
    lg: '(max-width: 1024px)',
  },
});

export const darkTheme = stitches.createTheme({
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