import 'styled-components';

// Define the theme interface
export interface Theme {
  colors: {
    textDark: string;
    textLight: string;
    itemHighlight: string;
    backgroundColorDark: string;
    backgroundColorLight: string;
    gray900: string;
    gray700: string;
    gray500: string;
    skeletonColorPrimary: string;
    skeletonColorSecondary: string;
    infoForm: string;
    greyLight: string;
    primary: string;
    secondary: string;
    tertiary: string;
    link: string;
    linkHover: string;
    redAlpha: string;
    greenAlpha: string;
    yellowAlpha: string;
    blueAlpha: string;
    orangeAlpha: string;
  };
  fontSizes: {
    fontSizeS: string;
    fontSizeM: string;
    fontSizeL: string;
    fontSizeXL: string;
  };
  space: {
    small: string;
    medium: string;
    large: string;
  };
  media: {
    sm: string;
    md: string;
    lg: string;
  };
}

// Extend styled-components DefaultTheme
declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}

// Main theme object
export const theme: Theme = {
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
    primary: "hsl(205,5%,7%)",
    secondary: "hsl(205,5%,25%)",
    tertiary: "hsl(205,5%,35%)",
    link: "#b12236",
    linkHover: "#365f65",
    redAlpha: "rgba(255, 0, 0, 0.4)",
    orangeAlpha: "rgba(255, 159, 10, 0.4)",
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
  },
  media: {
    sm: "(max-width: 480px)",
    md: "(max-width: 768px)",
    lg: "(max-width: 1024px)",
  },
};

// Dark theme variant
export const darkTheme: Theme = {
  ...theme,
  colors: {
    ...theme.colors,
    primary: "#f1f3f4", // gray100 equivalent
    secondary: "#e8eaed", // gray200 equivalent
    tertiary: "#dadce0", // gray300 equivalent
    link: "#4285f4", // blue500 equivalent
    background: "hsl(205,5%,7%)", // gray900
    border: "#f1f3f4", // gray100 equivalent
  },
};

// Media query helpers for styled-components
export const media = {
  sm: `@media ${theme.media.sm}`,
  md: `@media ${theme.media.md}`,
  lg: `@media ${theme.media.lg}`,
};
