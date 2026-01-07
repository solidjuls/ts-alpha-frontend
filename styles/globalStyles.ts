import { createGlobalStyle } from 'styled-components';
import { media } from "theme";

const GlobalStyles = createGlobalStyle`
  :root {
    /* ============================
       Core Brand Colors
    ============================ */
    --usa: #345f64;
    --usa-alt: #365f65;
    --ussr: #b12335;
    --usa-half: rgba(34, 95, 64, 0.5);
    --ussr-half: rgba(177, 35, 53, 0.5);
    --ussr-quarter: rgba(177, 35, 53, 0.25) ;

    /* ============================
       Text
    ============================ */
    --primary-text: #1f2937;
    --muted-text: #6b7280;
    --alt-text: #f9fafb;

    /* ============================
       Backgrounds
    ============================ */
    --bg-main: #f9fafb;
    --bg-card: #ffffff;

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
     Links (Brand-Critical)
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
      background-color: var(--bg-card);
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
      background-color: var(--bg-card);
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

  @media (prefers-color-scheme: dark) {
    :root {
      /* Backgrounds */
      --bg-main: #0f1416;
      --bg-card: #161c1f;
      --bg-elevated: #1c2428;

      /* Text */
      --primary-text: #e5e7eb;
      --secondary-text: #9ca3af;
      --muted-text: #6b7280;

      /* Brand (softened for dark mode) */
      --usa: #4f8a91;
      --usa-alt: #4f8a91;
      --ussr: #c94a5a;

      /* Borders */
      --border: #2a343a;
      --divider: #233036;

      /* Tables */
      --table-header-bg: #1c2428;
      --table-row-even: #141b1f;
      --table-row-odd: #10171a;
    }
  }

  /* ============================
    React Day Picker Styles
  ============================ */ 
    .DayPickerInput > input {
      all: unset;
      width: 100px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      border: 1px solid var(--border);
      padding: 0 10px;
      height: 35px;
      font-size: 15px;
      line-height: 1;
      color: var(--primary-text);
    }

    .DayPicker {
      background-color: var(--bg-card);
      color: var(--primary-text);
    }

    .DayPicker-Day:not(.DayPicker-Day--outside):not(.DayPicker-Day--disabled):not(.DayPicker-Day--selected):hover {
      background-color: var(--ussr) !important;
      color: var(--alt-text);
    }

    .DayPicker-Day--today:not(.DayPicker-Day--selected) {
      color: var(--usa);
    }

    .DayPicker-TodayButton {
      color: var(--usa);
      font-weight: 600;
      text-decoration: none;
    }

    .DayPicker-TodayButton:hover,
    .DayPicker-TodayButton:active {
      color: var(--ussr);
      text-decoration: underline;
    }

    .DayPicker-NavButton {
      background-color: var(--bg-card);
      background-repeat: no-repeat;
      background-position: center;
      transition: background-color 0.15s ease;
      border-radius: 48px;
    }

    .DayPicker-NavButton:hover {
      background-color: var(--ussr);
    }

  /* ===========================
    PrimeReact MultiSelect
  =========================== */
    .p-multiselect-panel {
      background-color: var(--bg-card);
      border: 1px solid var(--border);
    }

    /* Individual items */
    .p-multiselect-item {
      color: var(--primary-text);
      background-color: var(--bg-card);
      font-family: inherit;
      transition: background-color 0.15s ease, color 0.15s ease;
    }

    /* Hover state */
    .p-multiselect-item:not(.p-disabled):hover {
      background-color: var(--ussr);
      color: #ffffff;
    }

    /* Selected item */
    .p-multiselect-item.p-highlight {
      background-color: var(--usa);
      color: #ffffff;
    }

    /* Selected + hover (tension moment) */
    .p-multiselect-item.p-highlight:hover {
      background-color: var(--ussr);
    }

  /* ===========================
    PrimeReact Checkbox
   =========================== */

    .p-checkbox {
      display: inline-flex;
      align-items: center;
    }

    .p-checkbox-box {
      width: 20px;
      height: 20px;
      border-radius: 4px;
      border: 1px solid var(--border);
      background-color: var(--bg-card);
      display: flex;
      align-items: center;
      justify-content: center;
      transition:
        background-color 0.15s ease,
        border-color 0.15s ease,
        box-shadow 0.15s ease;
    }

    /* Hover (tension moment) */
    .p-checkbox-box:not(.p-disabled):hover {
      background-color: var(--ussr);
      border-color: var(--ussr);
    }

    /* Checked */
    .p-checkbox-box.p-highlight {
      background-color: var(--usa);
      border-color: var(--usa);
    }

    /* Checked + hover */
    .p-checkbox-box.p-highlight:not(.p-disabled):hover {
      background-color: var(--ussr);
      border-color: var(--ussr);
    }

    /* Checkmark */
    .p-checkbox-icon {
      color: var(--usa);
      font-size: 12px;
    }

    /* Disabled */
    .p-checkbox-box.p-disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    /* Focus (accessibility) */
    .p-checkbox-box:focus-visible {
      outline: 2px solid var(--usa);
      outline-offset: 2px;
    }

  /* ===========================
    PrimeReact MultiSelect Filter
  =========================== */

    .p-multiselect-header {
      padding: 0.5rem;
      border-bottom: 1px solid var(--border);
      background-color: var(--bg-card);
    }

    .p-multiselect-header .p-inputtext {
      width: 100%;
      padding: 6px 8px;
      font-family: var(--font-body);
      font-size: 0.875rem;

      color: var(--primary-text);
      background-color: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 6px;

      transition:
        border-color 0.15s ease,
        box-shadow 0.15s ease;
    }

    .p-multiselect-filter {
      width: 100%;
    }

    .p-multiselect-filter input {
      width: 100%;
      padding: 6px 8px;
      font-family: var(--font-body);
      font-size: 0.875rem;

      color: var(--primary-text);
      background-color: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 6px;

      transition:
        border-color 0.15s ease,
        box-shadow 0.15s ease;
    }

    .p-multiselect-filter input::placeholder {
      color: var(--muted-text);
    }

    /* Focus state */
    .p-multiselect-filter input:focus {
      outline: none;
      border-color: var(--usa);
      box-shadow: 0 0 0 2px rgba(52, 95, 100, 0.2);
    }

  /* ============================
    Mobile Styles
  ============================ */ 
    ${media.md} {
      button {
        width: 100%;
      }
    }
`;



export default GlobalStyles;