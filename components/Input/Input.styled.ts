import styled from "styled-components";

export const Input = styled.input`
  all: unset;
  box-sizing: border-box;
  min-width: 0;

  display: block;
  width: ${({ width }) => width || "100%"};

  border-radius: 8px;
  padding: 0 10px;
  height: ${({ filter }) => (filter === "filter" ? "40px" : "35px")};
  font-size: 15px;
  line-height: 1;

  border: ${({ border }) => (border === "error" ? "solid 1px red" : "1px solid var(--border)")};

  color: var(--primary-text);
  background-color: var(--bg-card);

  margin: ${({ margin }) => {
    switch (margin) {
      case "xxl":
        return "64px";
      case "url":
        return "0 0 24px 0";
      case "login":
        return "0 0 12px 0";
      default:
        return "0";
    }
  }};

  ${({ border }) =>
    border === "dropdown" &&
    `
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    `}

  ${({ border }) =>
    border === "error" &&
    `
      box-shadow: none;
      &:focus {
        box-shadow: 0 0 0 2px red;
      }
    `}
`;
