import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  :root {
    /* ============================
       Core Brand Colors
    ============================ */
    --usa: #345f64;
    --usa-alt: #365f65;
    --ussr: #b12335;

    /* ============================
       Text
    ============================ */
    --primary-text: #1f2937;
    --muted-text: #6b7280;

    /* ============================
       Backgrounds
    ============================ */
    --bg-main: #f9fafb;
    --bg-cards: #ffffff;

    /* ============================
       Borders / Dividers
    ============================ */
    --border: #e5e7eb;

    /* ============================
       Shadows
    ============================ */
    --shadow-soft: 0 4px 12px rgba(0, 0, 0, 0.05);

    /* ============================
       Typography
    ============================ */
    --font-body: "Open Sans", -apple-system, BlinkMacSystemFont,
      "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell,
      "Helvetica Neue", sans-serif;

    --font-mono: "IBM Plex Mono", "JetBrains Mono", monospace;
  }

  /* ============================
     Base Reset
  ============================ */
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  body {
    font-family: var(--font-body);
    margin: 0;
    padding: 0;
    min-height: 100vh;
    background-color: var(--bg-main);
    color: var(--primary-text);
    line-height: 1.6;
  }

  /* ============================
     Headings
  ============================ */
  h1 {
    font-weight: 700;
    letter-spacing: -0.01em;
  }

  h2,
  h3 {
    font-weight: 600;
  }

  h4,
  h5,
  h6 {
    font-weight: 500;
  }

  /* ============================
     Links (Brand-critical)
  ============================ */
  a {
    color: var(--usa);
    font-weight: 600;
    text-decoration: none;
    transition: color 0.15s ease, text-decoration 0.15s ease;
  }

  a:hover,
  a:active {
    color: var(--ussr);
    text-decoration: underline;
  }

  /* ============================
     Accessibility
  ============================ */
  :focus-visible {
    outline: 2px solid var(--usa);
    outline-offset: 2px;
  }

  /* ============================
     Tables
  ============================ */
  table {
    width: 100%;
    border-collapse: collapse;
    background-color: var(--bg-cards);
    border: 1px solid var(--border);
  }

  th {
    background-color: var(--usa-alt);
    color: #ffffff;
    font-weight: 600;
    text-align: left;
    padding: 0.75rem;
  }

  td {
    padding: 0.75rem;
    border-top: 1px solid var(--border);
  }

  tbody tr:nth-child(even) {
    background-color: var(--bg-main);
  }

  /* ============================
     Cards (Click Affordance)
  ============================ */
  .card {
    background-color: var(--bg-cards);
    border-radius: 8px;
    box-shadow: var(--shadow-soft);
    transition: box-shadow 0.2s ease, transform 0.2s ease;
  }

  .card--clickable {
    cursor: pointer;
  }

  .card--clickable:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
  }

  /* ============================
     Utility
  ============================ */
  .mono {
    font-family: var(--font-mono);
  }

  /* ============================
     Dark Mode Variables (Future)
     Enable with: [data-theme="dark"]
  ============================ */
  [data-theme="dark"] {
    --bg-main: #0f1416;
    --bg-cards: #161c1f;
    --primary-text: #e5e7eb;
    --muted-text: #9ca3af;
    --border: #2a343a;

    --usa: #4f8a91;
    --ussr: #c94a5a;
  }
`;

export default GlobalStyles;