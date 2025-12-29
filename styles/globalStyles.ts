import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  body {
    font-family: "Open Sans", sans-serif;
    height: 100%;
    padding: 0;
    margin: 0;
  }

  a {
    color: #345f64;
    text-decoration: none;
    font-weight: bold;
  }

  a:hover {
    text-decoration: underline;
    color: #b12335;
  }
`;

export default GlobalStyles;